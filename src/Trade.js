import React, {useState} from 'react'

function Trade({stockSymbol,purchases,setPurchases,currentPrice}) {

  const [buy,setBuy] = useState(false);
  const [stockAmount,setStockAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault()
    setPurchases([...purchases,{id: new Date().getTime().toString(), symbol:stockSymbol, amount:stockAmount, current:currentPrice, totalPrice:(parseFloat(stockAmount) * parseFloat(currentPrice)).toString()}]);
    setStockAmount(0);
  }

  return (<div>
    <button className="companyButton" type="button" onClick={() => setBuy(!buy)} >Make Trade {buy ? "x" : "+"}</button>

    {buy && <div style={{'margin-top': '1rem'}}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="stockAmount">Buy Stocks</label>
        <input type="number" name="stockAmount" id="stockAmount" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} />
        <button className="purchaseButton" type="submit">Purchase</button>
      </form>
      <h3>Current Price: ${currentPrice}<br/>Total Cost: $ {stockAmount * currentPrice}</h3>
    </div>}
  </div>);

}

export default Trade;