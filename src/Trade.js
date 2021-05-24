import React, {useState} from 'react'

function Trade({stockSymbol,purchases,setPurchases,currentPrice}) {

  const [buy,setBuy] = useState(false);
  const [stockAmount,setStockAmount] = useState(0);

  const handleTrade = (tradeType) => {
    if(stockAmount > 0) {
      setPurchases([...purchases,{id: new Date().getTime().toString(), type:tradeType, symbol:stockSymbol, amount:stockAmount, current:currentPrice, totalPrice:(parseFloat(stockAmount) * parseFloat(currentPrice)).toString()}]);
    }else{
      alert("Trade Quantity must be more that 0");
    }
    setStockAmount(0);
  }

  return (<div>
    <button className="companyButton" type="button" onClick={() => setBuy(!buy)} >Make Trade {buy ? "x" : "+"}</button>

    {buy && <div style={{'margin-top': '1rem'}}>
        <label htmlFor="stockAmount">Quantity</label>
        <input type="number" name="stockAmount" id="stockAmount" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} />
        <button className="purchaseButton" type="button" onClick={() => handleTrade("Buy")}>Buy</button>
        <button className="exitButton" type="button" onClick={() => handleTrade("Sell")}>Sell</button>
      <h3>Current Price: ${currentPrice}<br/>Total Cost: $ {stockAmount * currentPrice}</h3>
    </div>}
  </div>);

}

export default Trade;