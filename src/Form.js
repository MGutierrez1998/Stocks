import granuality from "./granuality"
import React, {useState} from 'react'

function Form({setGran, graphType, setGraphType, sma, setSMA, smaInputs, setSMAInputs, sr, setSR}) {

  const [smaShort,setSmaShort] = useState(smaInputs.short);
  const [smaLong,setSmaLong] = useState(smaInputs.long);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSMAInputs({short:smaShort,long:smaLong});
  }

  return ( <div>
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => setGraphType(!graphType)}>Graph Type: {graphType ? "Candle" : "Line"}</button>
      <select name="granuality" onChange={(e)=>setGran(e.target.value)}>
        {granuality.map((granuality)=>{
          const {id,intervals} = granuality;
          return <option key={`${id}-granuality`} value={intervals}>{intervals}</option>
        })}
      </select>
      <button type="button" onClick={() => setSR(!sr)}>Support/Resistance: {sr ? "x" : "+"}</button>
      <button type="button" onClick={() => setSMA(!sma)}>SMA: {sma ? "x" : "+"}</button>
      {sma 
      ? <div>
          <label htmlFor="shortTerm">Short Period</label>
          <input type="number" name="shortTerm" id="shortTerm" value={smaShort} onChange={(e) => setSmaShort(e.target.value)} />
          <label htmlFor="longTerm">Long Period</label>
          <input type="number" name="longTerm" id="longTerm" value={smaLong} onChange={(e) => setSmaLong(e.target.value)} /> 
          <button type="submit">Apply</button>
        </div>: <></>}      
    </form>
  </div> );
}

export default Form;