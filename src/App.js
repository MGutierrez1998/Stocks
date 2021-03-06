import React, {useState, useEffect} from 'react'
import stocks from "./Data"
import Form from "./Form"
import Chart from "./Chart"
import Info from "./Info"
import Trade from "./Trade"
import Purchases from "./Purchases"
import AddStock from "./AddStock"

const getLocalStorage = () => {
  let purchases = localStorage.getItem('purchases');
  if(purchases){
    return JSON.parse(localStorage.getItem('purchases'));
  }else{
    return [];
  }
}

function App({setNav}) {
  const [stockList,setStockList] = useState(stocks);
  const [stockSymbol,setStockSymbol] = useState("TSLA");
  const [graphType,setGraphType] = useState(false);
  const [sma,setSMA] = useState(false);
  const [smaInputs,setSMAInputs] = useState({short:0,long:0});
  const [sr,setSR] = useState(false);
  const [currentPrice, setCurrentPrice] = useState("");
  const [purchases,setPurchases] = useState(getLocalStorage());
  const [srLines,setSRLines] = useState({R1:0,S1:0,R2:0,S2:0});

  useEffect(()=>{
    localStorage.setItem('purchases',JSON.stringify(purchases));
  },[purchases])

  useEffect(() => {
    setSMA(false);
    setSR(false);
    setCurrentPrice(0);

    const getCurrentPrice = (data) => {
      let latest = data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
      setCurrentPrice(parseFloat(latest["4. close"]).toFixed(2));
    }
    const fetchData = async () => {
      try {
        const API_KEY = "91CZUFQR4BCV8NIV";
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=1min&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        getCurrentPrice(data);
      } catch (err) {
        alert(err.message);
      }
    }
    fetchData();
    const interval=setInterval(()=>{
      fetchData();
    },60000);  

    return () => clearInterval(interval);

  },[stockSymbol])

  
  return (
    <div>
      <button className="backButton" type="button" onClick={() => setNav("Home")}> ← Back to Website</button> 
      <h1 style={{'text-align':'center'}}>Stocks</h1>
      <Purchases stockSymbol={stockSymbol} currentPrice={currentPrice} purchases={purchases} setPurchases={setPurchases} />
      {stockList.map((stock) => {
        const {id,name,symbol} = stock;
        return (<section key={`${id}-stock`} >
          <div className="companyMenu">
          <button className="companyButton" type="btn" onClick={()=>setStockSymbol(symbol)}>{stockSymbol === symbol ? "-" : "+"}</button>
          <h2>{name} {symbol}</h2>
          </div>
          {stockSymbol === symbol ? 
          <div>
            <Trade stockSymbol={stockSymbol} purchases={purchases} setPurchases={setPurchases} currentPrice={currentPrice} srLines={srLines} />
            <Info stockSymbol={stockSymbol} currentPrice={currentPrice}/>
            <Form graphType={graphType} setGraphType={setGraphType} sma={sma} setSMA={setSMA} smaInputs={smaInputs} setSMAInputs={setSMAInputs} sr={sr} setSR={setSR} /> 
            <Chart stockSymbol={stockSymbol} graphType={graphType} sma={sma} smaInputs={smaInputs} sr={sr} srLines={srLines} setSRLines={setSRLines} />
          </div> 
          : <></> }
        </section>);
      })} 
      <AddStock stockList={stockList} setStockList={setStockList}/>
    </div>
  );
}

export default App;
