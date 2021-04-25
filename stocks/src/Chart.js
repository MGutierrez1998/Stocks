import React, { useState, useEffect} from 'react'
import granuality from "./granuality"
import Line from "./Line"
import Candle from "./Candle"

function Chart({stockSymbol, gran, graphType, sma, smaInputs, sr}) {
  
  const [stockData, setStockData] = useState({open:[],high:[],low:[],close:[],volume:[],time:[]});
  const [smaData,setSMAData] = useState({short:[],long:[]});
  const [smaSignal,setSMASignal] = useState([]);
  const [srLines,setSRLines] = useState({R1:0,S1:0,R2:0,S2:0});

  useEffect(() => {

    const parseData = (data) => {
      let timeData = [];
      let openData = [];
      let highData = [];
      let lowData = [];
      let closeData = [];
      let volumeData = [];

      if(gran === "Weekly"){
        for(let key in data[`${gran} Time Series`]){
          timeData.push(key);
          openData.push(data[`${gran} Time Series`][key]["1. open"])
          highData.push(data[`${gran} Time Series`][key]["2. high"])
          lowData.push(data[`${gran} Time Series`][key]["3. low"])
          closeData.push(data[`${gran} Time Series`][key]["4. close"])
          volumeData.push(data[`${gran} Time Series`][key]["5. volume"])
        }
      }else {
        for(let key in data[`Time Series (${gran})`]){
          timeData.push(key);
          openData.push(data[`Time Series (${gran})`][key]["1. open"])
          highData.push(data[`Time Series (${gran})`][key]["2. high"])
          lowData.push(data[`Time Series (${gran})`][key]["3. low"])
          closeData.push(data[`Time Series (${gran})`][key]["4. close"])
          volumeData.push(data[`Time Series (${gran})`][key]["5. volume"])
        }
      }
      setStockData({open:openData,high:highData,low:lowData,close:closeData,volume:volumeData,time:timeData});
    }

    const fetchData = async () => {
      try {
        const API_KEY = '8QR357GOH31UVIU8';
        let url = "";
        if(gran === "Weekly") {
          url = `https://www.alphavantage.co/query?function=TIME_SERIES_${gran.toUpperCase()}&symbol=${stockSymbol}&apikey=${API_KEY}`
        } else if(gran === "Daily") {
          url = `https://www.alphavantage.co/query?function=TIME_SERIES_${gran.toUpperCase()}&symbol=${stockSymbol}&apikey=${API_KEY}`
        }else{
          url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=${gran}&apikey=${API_KEY}`
        }

        const response = await fetch(url);
        const data = await response.json();
        parseData(data)
      } catch (err) {
        alert(err.message);
      }
    }
    
    let refresh = granuality.filter(time => time["intervals"] === gran)[0];

    fetchData()
    console.log(refresh.intervals)

    const interval=setInterval(()=>{
      fetchData();
      console.log(refresh.intervals);
     },refresh.ms);  

     return () => clearInterval(interval);

  },[stockSymbol, gran]);

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
    
    setSMAData({short:calcSMA(smaInputs.short),long:calcSMA(smaInputs.long)});

  },[stockData, smaInputs]);

  useEffect(() => {
      let signal = [];
      var flag = -1;
      for (let i=0; i<smaData.short.length; i++) {
        if (smaData.short[i] > smaData.long[i]) {
          if (flag !== 1) {
            signal.push("BUY");
            flag = 1;
          }else{
            signal.push(null);
          }
        } else if (smaData.short[i] < smaData.long[i]) {
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
  },[smaData]);

  useEffect(() => {

    const calcSR = (data) => {
      let last = data["Weekly Time Series"][Object.keys(data["Weekly Time Series"])[0]];
      let PP = (parseFloat(last["2. high"]) + parseFloat(last["3. low"]) + parseFloat(last["4. close"]))/3;
      let Resistance1 = (2 * PP) - parseFloat(last["3. low"]);
      let Support1 = (2 * PP) - parseFloat(last["2. high"]);
      let Resistance2 = PP + (parseFloat(last["2. high"]) - parseFloat(last["3. low"]));
      let Support2 =  PP - (parseFloat(last["2. high"]) - parseFloat(last["3. low"]));

      setSRLines({R1:Resistance1,S1:Support1,R2:Resistance2,S2:Support2});
    }

    const fetchData = async () => {
      try {
        const API_KEY = 'BLI05FRET5ZOBO05';
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stockSymbol}&apikey=${API_KEY}`
        const response = await fetch(url);
        const data = await response.json();
        calcSR(data);
      } catch (err) {
        alert(err.message);
      }
    }

    fetchData();
    
  },[stockSymbol]);

  return (<div>
    {graphType 
    ? <Candle stockData={stockData} sma={sma} smaSignal={smaSignal} sr={sr} srLines={srLines} />
    : <Line stockData={stockData} sma={sma} smaSignal={smaSignal} sr={sr} srLines={srLines} />}
  </div>);
}

export default Chart;