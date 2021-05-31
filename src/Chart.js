import React, { useState, useEffect} from 'react'
import Line from "./Line"
import Candle from "./Candle"

function Chart({stockSymbol, graphType, sma, smaInputs, sr, srLines, setSRLines}) {
  
  const [stockData, setStockData] = useState({open:[],high:[],low:[],close:[],volume:[],time:[]});
  const [smaSignal,setSMASignal] = useState([]);

  useEffect(() => {
    const parseData = (data) => {
      let timeData = [];
      let openData = [];
      let highData = [];
      let lowData = [];
      let closeData = [];
      let volumeData = [];

      for(let key in data[`Time Series (Daily)`]){
        timeData.push(key);
        openData.push(data[`Time Series (Daily)`][key]["1. open"])
        highData.push(data[`Time Series (Daily)`][key]["2. high"])
        lowData.push(data[`Time Series (Daily)`][key]["3. low"])
        closeData.push(data[`Time Series (Daily)`][key]["4. close"])
        volumeData.push(data[`Time Series (Daily)`][key]["5. volume"])
      }
      setStockData({open:openData,high:highData,low:lowData,close:closeData,volume:volumeData,time:timeData});
    }

    const calcSR = (data) => {  
      let key = "";
      for(let day in data[`Time Series (Daily)`]){
        if (new Date(day).getDay() === 1){
          key = day;
          break;
        }
      } 

      let PivotPoint = (parseFloat(data[`Time Series (Daily)`][key]["2. high"]) + parseFloat(data[`Time Series (Daily)`][key]["3. low"]) + parseFloat(data[`Time Series (Daily)`][key]["4. close"]))/3;
      let Resistance1 = (2 * PivotPoint) - parseFloat(data[`Time Series (Daily)`][key]["3. low"]);
      let Support1 = (2 * PivotPoint) - parseFloat(data[`Time Series (Daily)`][key]["2. high"]);
      let Resistance2 = PivotPoint + (parseFloat(data[`Time Series (Daily)`][key]["2. high"]) - parseFloat(data[`Time Series (Daily)`][key]["3. low"]));
      let Support2 =  PivotPoint - (parseFloat(data[`Time Series (Daily)`][key]["2. high"]) - parseFloat(data[`Time Series (Daily)`][key]["3. low"]));

      setSRLines({PP:PivotPoint,R1:Resistance1,S1:Support1,R2:Resistance2,S2:Support2});
    }

    const fetchData = async () => {
      try {
        const API_KEY = '8QR357GOH31UVIU8';
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        parseData(data)
        calcSR(data);
      } catch (err) {
        alert(err.message);
      }
    }

    fetchData();
  },[stockSymbol,setSRLines]);

  useEffect(() => {
    const avg = (values) => {
      let sum = values.reduce((accumulator,currVal) => {return accumulator + parseFloat(currVal)},0);
      let avgVals = sum/values.length;

      return avgVals;
    }

    const calcSMA = (period) => {
      const smallMovingAverage = stockData.close.map((val,index,arr) => {
        if(index < period){
          val=null;
        }else{
          val=arr.slice(index-period, index);
          val=avg(val);
        }
        return val;
      },0);
      return smallMovingAverage;
    }

    const calcSignal = (short=calcSMA(smaInputs.short),long=calcSMA(smaInputs.long)) => {
      let signal = [];
      var flag = -1;
      for (let i=0; i<short.length; i++) {
        if (short[i] > long[i]) {
          if (flag !== 1) {
            signal.push("BUY");
            flag = 1;
          }else{
            signal.push(null);
          }
        } else if (short[i] < long[i]) {
          if (flag !== 0) {
            signal.push("SELL");
            flag = 0;
          }else{
            signal.push(null);
          }
        } else {
          signal.push(null);
        }
      }
      setSMASignal(signal);
    }
    
    calcSignal();
  },[stockData, smaInputs]);

  return (<div className="graph">
    {graphType 
    ? <Candle stockData={stockData} sma={sma} smaSignal={smaSignal} sr={sr} srLines={srLines} />
    : <Line stockData={stockData} sma={sma} smaSignal={smaSignal} sr={sr} srLines={srLines} />}
  </div>);
}

export default Chart;