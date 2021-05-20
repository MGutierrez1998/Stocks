import React, {useState} from 'react'

function AddStock({stockList, setStockList}) {
  const [showAdd,setShowAdd] = useState(false);
  const [stockName,setStockName] = useState("");
  const [stockSymbol,setStockSymbol] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStockList([...stockList,{id: stockList[stockList.length-1].id + 1, name:stockName, symbol:stockSymbol}]);
    setStockName("");
    setStockSymbol("");
    setShowAdd(false);
  }

  return (<div>
    <div className="companyMenu">
      <button className="companyButton" type="button" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "x" : "+"}</button> 
      <h2>Add Stock Option</h2>
    </div>
    {showAdd &&
    <form onSubmit={handleSubmit}>
        <label htmlFor="stockName">Stock Name:</label>
        <input type="text" name="stockName" id="stockName" value={stockName} onChange={(e) => setStockName(e.target.value)} />
        <label htmlFor="stockSymbol">Stock Symbol:</label>
        <input type="text" name="stockSymbol" id="stockSymbol" value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} />
        <button className="purchaseButton" type="submit">Add</button>
    </form>}
  </div>);
}
export default AddStock;
