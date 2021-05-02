import Plot from "react-plotly.js"
import React, {useState, useEffect} from 'react'

function Info({stockSymbol}) {
  const [showInfo, setShowInfo] = useState(false);
  const [companyData,setCompanyData] = useState({});
  const infoType = ["PEGRatio","BookValue", "EPS","PriceToSalesRatioTTM","PriceToBookRatio","EVToRevenue","ShortRatio","QuarterlyEarningsGrowthYOY","QuarterlyRevenueGrowthYOY"];
  const otherInfoType = ["RevenuePerShareTTM","AnalystTargetPrice","TrailingPE","ForwardPE","EVToEBITDA","52WeekHigh","52WeekLow","50DayMovingAverage","200DayMovingAverage"];

  useEffect(() => {

    const fetchData = async () => {
      try {
        const API_KEY = '9OLS5KJMS4TFV53E';
        let url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        setCompanyData(data);
      } catch (err) {
        alert(err.message);
      }

    }

    //fetchData();
  },[stockSymbol]);


  return <div><button type="button" onClick={() => {setShowInfo(!showInfo)}}>{showInfo ? "Hide Company Info" : "Show Company Info"}</button>
  {showInfo 
  ? <div>
      <Plot data={[
        {
        x:infoType,
        y:infoType.map((info) => {
          return parseFloat(companyData[info]);
        }),
        type:'bar',
        },
      ]} layout={{title: companyData["Symbol"] + " info",}} /> 
      <Plot data={[
        {
        x:otherInfoType,
        y:otherInfoType.map((info) => {
          return parseFloat(companyData[info]);
        }),
        type:'bar',
        },
      ]} layout={{title: companyData["Symbol"] + " other info",}} />
    </div>
      : <></>} 
  </div>;
}

export default Info;