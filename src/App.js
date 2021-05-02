import React, {useState, useEffect} from 'react'
import stocks from "./Data"
import Form from "./Form"
import Chart from "./Chart"
import Info from "./Info"
import Trade from "./Trade"

function App() {
  const [stockSymbol,setStockSymbol] = useState("TSLA");
  const [gran,setGran] = useState("1min");
  const [graphType,setGraphType] = useState(false);
  const [sma,setSMA] = useState(false);
  const [smaInputs,setSMAInputs] = useState({short:0,long:0});
  const [sr,setSR] = useState(false);
  const [purchases,setPurchases] = useState([{id: "123435467", symbol:"AMZN", amount:"15", current:"3647",totalPrice:"54705"},{id: "123435317", symbol:"AAPL", amount:"20", current:"131",totalPrice:"2620"}]);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    setSMA(false);
    setGran("1min");
    setSR(false);
  },[stockSymbol])

  
  return (
    <main>
      <h1>Stocks</h1>
      {stocks.map((stock) => {
        const {id,name,symbol} = stock;
        return (<section key={`${id}-stock`} >
          <h2>{name} {symbol}</h2>
          <button type="btn" onClick={()=>setStockSymbol(symbol)}>{stockSymbol === symbol ? "-" : "+"}</button>
          {stockSymbol === symbol ? 
          <div>
            <Trade stockSymbol={stockSymbol} purchases={purchases} setPurchases={setPurchases} totalProfit={totalProfit} setTotalProfit={setTotalProfit} />
            <Info stockSymbol={stockSymbol}/>
            <Form setGran={setGran} graphType={graphType} setGraphType={setGraphType} sma={sma} setSMA={setSMA} smaInputs={smaInputs} setSMAInputs={setSMAInputs} sr={sr} setSR={setSR} /> 
            <Chart stockSymbol={stockSymbol} gran={gran} graphType={graphType} sma={sma} smaInputs={smaInputs} sr={sr}/>
          </div> 
          : <></> }
        </section>);
      })} 
    </main>
  );
}

export default App;
