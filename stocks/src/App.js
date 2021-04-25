import React, {useState, useEffect} from 'react'
import stocks from "./Data"
import Form from "./Form"
import Chart from "./Chart"
import Info from "./Info"

function App() {
  const [stockSymbol,setStockSymbol] = useState("TSLA");
  const [gran,setGran] = useState("1min");
  const [graphType,setGraphType] = useState(false);
  const [sma,setSMA] = useState(false);
  const [smaInputs,setSMAInputs] = useState({short:0,long:0});
  const [sr,setSR] = useState(false);

  useEffect(() => {
    setSMA(false);
    setGran("1min");
    setSR(false);
  },[stockSymbol])

  return (
    <main>
      <h1>Stocks</h1>
      {stocks.map((stocks) => {
        const {id,name,symbol} = stocks;
        return (<section key={`${id}-stock`} >
          <h3>{name} {symbol}</h3>
          <button type="btn" onClick={()=>setStockSymbol(symbol)}>{stockSymbol === symbol ? "-" : "+"}</button>
          {stockSymbol === symbol ? 
          <div>
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
