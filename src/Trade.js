import React, {useState, useEffect} from 'react'

function Trade({stockSymbol,purchases,setPurchases,totalProfit,setTotalProfit}) {

  const [currentPrice, setCurrentPrice] = useState("");
  const [buy,setBuy] = useState(false);
  const [stockAmount,setStockAmount] = useState(0);

  useEffect(() => {
    const getCurrentPrice = (data) => {
      let latest = data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
      setCurrentPrice(latest["4. close"]);
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
      //fetchData();
     },60000);  

    return () => clearInterval(interval);

    },[stockSymbol]);

  const handleSubmit = (e) => {
    e.preventDefault()
    setPurchases([...purchases,{id: new Date().getTime().toString(), symbol:stockSymbol, amount:stockAmount, current:currentPrice, totalPrice:(parseFloat(stockAmount) * parseFloat(currentPrice)).toString()}]);
    setStockAmount(0);
  }

  const resolvePurchase = (id,symbol,amount,current) => {
    if(symbol === stockSymbol) {
      const updatePurchases = purchases.filter((purchase) => purchase.id !== id);
      let profit = ((parseFloat(currentPrice) * amount) - (current * amount)) + totalProfit;
      setTotalProfit(profit);
      setPurchases(updatePurchases);
    }
    else{
      alert("You must open the specific stock to sell");
    }
  } 

  return (<div>
    <button type="button" onClick={() => setBuy(!buy)} >Make Trade {buy ? "x" : "+"}</button>
    {buy && <h3>Total Profit: ${totalProfit}</h3>}

    {buy && purchases.map((purchase)=>{
        const {id,symbol,amount,current,totalPrice} = purchase;
        return ( <section key={id} id={id}>
          <h4>{symbol}<br/>
          Quanity: {amount}<br/>
          Bought at: ${current}<br/>
          Total: ${totalPrice}</h4>
          <button type="button" onClick={() => resolvePurchase(id,symbol,amount,current)}>Exit Position</button>
        </section> );
    })}
    {buy && <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="stockAmount">Buy Stocks</label>
        <input type="number" name="stockAmount" id="stockAmount" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} />
        <button type="submit">Purchase</button>
      </form>
      <h4>Current Price: ${currentPrice}<br/>Total Cost: $ {stockAmount * currentPrice}</h4>
    </div>}
  </div>);

}

export default Trade;