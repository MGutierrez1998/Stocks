import React, {useState} from 'react'

function Purchases({stockSymbol,currentPrice,purchases,setPurchases}) {
  const [totalProfit, setTotalProfit] = useState(0);
  const [showPurchase, setShowPurchase] = useState(false);

  const resolvePurchase = (id,type,symbol,amount,current) => {
    if(symbol === stockSymbol) {
      const updatePurchases = purchases.filter((purchase) => purchase.id !== id);
      let profit = 0;
      if(type === "Buy"){
        profit = ((parseFloat(currentPrice) * amount) - (current * amount)) + totalProfit;
      }else{
        profit = ((current * amount) - (parseFloat(currentPrice) * amount)) + totalProfit;
      }
      setTotalProfit(profit);
      setPurchases(updatePurchases);
    }
    else{
      alert("You must open the specific stock to sell");
    }
  }

  return (<div className="topRightFixed">
    <button type="button" className="companyButton" onClick={() => setShowPurchase(!showPurchase)}>{showPurchase ? <h3>Hide Current Purchases</h3> : <h3>Show Current Purchases</h3>}</button>
    <h3>Total Profit: ${totalProfit}</h3>
    {showPurchase &&
    <div className="purchasedBox">
    {purchases.map((purchase)=>{
        const {id,type,symbol,amount,current,totalPrice} = purchase;
        return ( <section className="purchasedItem" key={id} id={id}>
          <h4>{symbol}<br/>
          Type: {type}<br/>
          Quanity: {amount}<br/>
          Bought at: ${current}<br/>
          Total: ${totalPrice}</h4>
          <button className="exitButton" type="button" onClick={() => resolvePurchase(id,type,symbol,amount,current)}>Close</button>
        </section> );
        })}
    </div>}
  </div>);
}

export default Purchases;