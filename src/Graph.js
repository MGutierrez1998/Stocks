import React, { useState, useEffect } from 'react'
import stocks from "./Data"
import granuality from "./granuality"
import Plot from "react-plotly.js"

function Graph() {
  const [symbol,setSymbol] = useState("TSLA");
  const [gran,setGran] = useState("1min");
  const [stock,setStock] = useState({symbol:"TSLA",gran:"1min"});
  
  const [sma,setSMA] = useState(false);
  const [smaShort,setSmaShort] = useState(0);
  const [smaLong,setSmaLong] = useState(0);
  const [smaData,setSmaData] = useState({short:[],long:[]});
  const [smaSignal,setSmaSignal] = useState([]);


  const [graphType,setGraphType] = useState(false);
  const [stockData, setStockData] = useState({open:[],high:[],low:[],close:[],volume:[],time:[]});

  useEffect(() => {

    const parseData = (data) => {
      let timeData = [];
      let openData = [];
      let highData = [];
      let lowData = [];
      let closeData = [];
      let volumeData = [];

      for(var key in data[`Time Series (${stock.gran})`]){
        timeData.push(key);
        openData.push(data[`Time Series (${stock.gran})`][key]["1. open"])
        highData.push(data[`Time Series (${stock.gran})`][key]["2. high"])
        lowData.push(data[`Time Series (${stock.gran})`][key]["3. low"])
        closeData.push(data[`Time Series (${stock.gran})`][key]["4. close"])
        volumeData.push(data[`Time Series (${stock.gran})`][key]["5. volume"])
      }
      setStockData({open:openData,high:highData,low:lowData,close:closeData,volume:volumeData,time:timeData});
    }

    const fetchData = async () => {
      try {
        const API_KEY = 'BLI05FRET5ZOBO05';
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.symbol}&interval=${stock.gran}&apikey=${API_KEY}`
        const response = await fetch(url);
        const data = await response.json();
        parseData(data)
      } catch (err) {
        alert(err.message);
      }
    }
    
    let refresh = granuality.filter(time => time["intervals"] === stock.gran)[0];

    //fetchData()
    console.log(refresh.intervals)

    const interval=setInterval(()=>{
      //fetchData();
      console.log(refresh.intervals);
     },refresh.ms);  

     return () => clearInterval(interval);

  },[stock]);

  useEffect(() => {

    const calcSmaSignal = () => {
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
      setSmaSignal(signal);
    };

    calcSmaSignal();

  },[smaData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStock({symbol,gran});
    setSmaData({short:calcSMA(smaShort),long:calcSMA(smaLong)});
  }

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

  return (<div>
        <h1>Stocks</h1>
      <button onClick={() => setGraphType(!graphType)}>Graph Type: {graphType ? "Candle" : "Line"}</button>
      <form onSubmit={handleSubmit}>
        <select name="stock" onChange={(e)=>setSymbol(e.target.value)}>
          {stocks.map((stocks)=>{
            const {id,name,symbol} = stocks;
            return <option key={id} value={symbol}>{name}</option>
          })}
        </select>
        <select name="granuality" onChange={(e)=>setGran(e.target.value)}>
          {granuality.map((granuality)=>{
            const {id,intervals} = granuality;
            return <option key={id} value={intervals}>{intervals}</option>
          })}
        </select>
        <button type="button" onClick={() => setSMA(!sma)}>SMA {sma ? "x" : "+"}</button>
        {sma ? <div>
          <label htmlFor="shortTerm">Short Period</label>
          <input type="number" name="shortTerm" id="shortTerm" value={smaShort} onChange={(e) => setSmaShort(e.target.value)} />
          <label htmlFor="longTerm">Long Period</label>
          <input type="number" name="longTerm" id="longTerm" value={smaLong} onChange={(e) => setSmaLong(e.target.value)} />
        </div>
        : ""}
        <button type="submit">Submit</button>
      </form>

      <section>
        <h3>{stock.symbol}</h3>
        <h3>{stock.gran}</h3>
        { graphType ? <Plot
        data={[
          {
            x: stockData.time,
            close: stockData.close,
            high: stockData.high,
            low: stockData.low,
            open: stockData.open,

            increasing: {line: {color: 'black'}},
            decreasing: {line: {color: 'red'}},

            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y'
          }, (sma ? {
            x: stockData.time, 
            y: stockData.close,
            mode: 'markers', 
            name: 'PRICE', 
            type: 'scatter', 
            marker: {
              size: 10, 
              color: smaSignal.map((value) => {
                if(value === "BUY"){
                  return 'rgb(0, 255, 0)';
                }else if (value === "SELL") {
                  return 'rgb(255, 0, 0)';
                }else {
                  return 'rgba(0, 0, 0, 0)';
                }
              })
            }, 
            text: smaSignal} : {})
        ]}
        layout={ {dragmode: 'zoom', showlegend: false,
                  xaxis: {rangeslider: {visible: false}}, title: symbol } }/> 
        : <Plot
        data={[
          {
            x: stockData.time,
            y: stockData.open,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          (sma ? {
            x: stockData.time, 
            y: stockData.close,
            mode: 'markers', 
            name: 'PRICE', 
            type: 'scatter', 
            marker: {
              size: 10, 
              color: smaSignal.map((value) => {
                if(value === "BUY"){
                  return 'rgb(0, 255, 0)';
                }else if (value === "SELL") {
                  return 'rgb(255, 0, 0)';
                }else {
                  return 'rgba(0, 0, 0, 0)';
                }
              })
            }, 
            text: smaSignal} : {})
        ]}
        layout={ {width: 1000, height: 600, title: symbol} }/>
      }
      </section>
  </div>);
}

export default Graph;