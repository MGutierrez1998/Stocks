import Plot from "react-plotly.js"
import React, {useState, useEffect} from 'react'

function Info({stockSymbol, currentPrice}) {
  const [showInfo, setShowInfo] = useState(false);
  const [companyData,setCompanyData] = useState({});
  const [fairVal,setFairVal] = useState("");
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
        setFairVal((parseFloat (data["PERatio"]) / parseFloat (data["PEGRatio"])) * parseFloat (data["EPS"]));
      } catch (err) {
        alert(err.message);
      }

    }
    fetchData();
  },[stockSymbol]);


  return <div><button className="companyButton" type="button" onClick={() => {setShowInfo(!showInfo)}}>{showInfo ? "Hide Company Info" : "Show Company Info"}</button>
  {showInfo 
  && <div>
      <div className="graph">
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
      <div className="graph">
        <Plot data={[{
              type: 'bar',
              x: [currentPrice, fairVal],
              y: ['Current Price', 'Fair Value'],
              orientation: 'h',
              marker:{
                color: ['rgba(239,239,39,1)', 'rgba(39,229,239,1)']
              },
            }]} layout={{title: companyData["Name"] + " Fair Value",
            shapes: [
              {
                  type: 'rect',
                  xref: 'x',  
                  yref: 'paper',
                  x0: currentPrice,
                  y0: 0,
                  x1: fairVal,
                  y1: 1,
                  fillcolor: `${(parseFloat(currentPrice) / parseFloat(fairVal))  > 1 ? '#9C0412': '#13840F'}`,
                  opacity: 0.2,
                  line: {
                      width: 0
                  },
                  text: ['difference']
              }],
            annotations: [
              {
                xref: 'paper',
                yref: 'paper',
                xanchor: 'center',
                yanchor: 'center',
                text: `${(Math.abs((parseFloat(currentPrice) / parseFloat(fairVal))-1) * 100).toFixed(1)}% ${(parseFloat(currentPrice) / parseFloat(fairVal))  > 1 ?  'Overvalued' : 'Undervalued'}`,
                showarrow: false,
                font: {
                  color: "black",
                  size: 20,
                },
              },
            ]

            }} /> 
      </div>
    </div>} 
  </div>;
}

export default Info;