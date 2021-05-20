import React, {useState} from 'react'

function Form({graphType, setGraphType, sma, setSMA, smaInputs, setSMAInputs, sr, setSR}) {

  const [smaShort,setSmaShort] = useState(smaInputs.short);
  const [smaLong,setSmaLong] = useState(smaInputs.long);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSMAInputs({short:smaShort,long:smaLong});
  }

  return ( <div>
    <form className="section-center" onSubmit={handleSubmit}>
      <section className="graphContainer">
      <button className="graphButton" type="button" onClick={() => setGraphType(!graphType)}>Toggle Graph: {graphType ? "Candle" : "Line"}</button>
      <button className="graphButton" type="button" onClick={() => setSR(!sr)}>Support/Resistance: {sr ? "x" : "+"}</button>
      <button className="graphButton" type="button" onClick={() => setSMA(!sma)}>SMA: {sma ? "x" : "+"}</button>
      </section>
      {sma &&
        <div className="graphContainer">
          <label htmlFor="shortTerm">Short Period:</label>
          <input type="number" name="shortTerm" id="shortTerm" value={smaShort} onChange={(e) => setSmaShort(e.target.value)} />
          <label htmlFor="longTerm">Long Period:</label>
          <input type="number" name="longTerm" id="longTerm" value={smaLong} onChange={(e) => setSmaLong(e.target.value)} /> 
          <button className="graphButton" type="submit">Apply</button>
        </div>}      
    </form>
  </div> );
}

export default Form;