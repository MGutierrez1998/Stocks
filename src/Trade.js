import React, {useState} from 'react'

function Trade({stockSymbol,purchases,setPurchases,currentPrice,srLines}) {

  const [buy,setBuy] = useState(false);
  const [stockAmount,setStockAmount] = useState(0);

  const handleTrade = (tradeType) => {
    if(stockAmount > 0) {
      setPurchases([...purchases,{id: new Date().getTime().toString(), type:tradeType, symbol:stockSymbol, amount:stockAmount, current:currentPrice, totalPrice:(parseFloat(stockAmount) * parseFloat(currentPrice)).toString()}]);
    }else{
      alert("Trade Quantity must be more that 0");
    }
    setStockAmount(0);
  };

  const buyColor = (price,sr) => {
    const buy1 = (sr["R2"] + sr["R1"]) / 2;
    const buy2 = (sr["PP"] + sr["R1"]) / 2;
    var numBuy = 7;
    if(price > buy1) {
      numBuy -= 7;
      if(price < sr["R1"]){
        numBuy += 7;
      }
    }
    if(price > buy2) {
      numBuy -= 7;
      if(price > sr["R1"]){
        numBuy += 7;
      }
    }
    return "buyButton-" + numBuy;
  };

  const sellColor = (price,sr) => {
    const sell1 = (sr["PP"] + sr["S1"]) / 2;
    const sell2 = (sr["S2"] + sr["S1"]) / 2;
    var numSell = 7;
    if(price < sell1) {
      numSell -= 7;
      if(price < sr["R1"]){
        numSell += 7;
      }
    }
    if(price < sell2) {
      numSell -= 7;
      if(price > sr["R1"]){
        numSell += 7;
      }
    }
    return "sellButton-" + numSell;
  };

  return (<div>
    <button className="companyButton" type="button" onClick={() => setBuy(!buy)} >Make Trade {buy ? "x" : "+"}</button>

    {buy && <div style={{'margin-top': '1rem'}}>
        <label htmlFor="stockAmount">Quantity</label>
        <input type="number" name="stockAmount" id="stockAmount" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)} />
        <button className={buyColor(currentPrice,srLines)} type="button" onClick={() => handleTrade("Buy")}>Buy</button>
        <button className={sellColor(currentPrice,srLines)} type="button" onClick={() => handleTrade("Sell")}>Sell</button>
      <h3>Current Price: ${currentPrice}<br/>Total Cost: $ {stockAmount * currentPrice}</h3>
    </div>}
  </div>);

}

export default Trade;