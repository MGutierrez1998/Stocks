import Plot from "react-plotly.js"

function Line({stockData,sma,smaSignal,sr,srLines}) {
  return <Plot
        data={[
          {
            x: stockData.time,
            y: stockData.close,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          (sma ? {
            x: stockData.time, 
            y: stockData.close,
            mode: 'markers', 
            name: 'PRICE', 
            type: 'scatter', 
            marker: {
              size: 10, 
              color: smaSignal.map((value) => {
                if(value === "BUY"){
                  return 'rgb(0, 255, 0)';
                }else if (value === "SELL") {
                  return 'rgb(255, 0, 0)';
                }else {
                  return 'rgba(0, 0, 0, 0)';
                }
              })
            }, 
            text: smaSignal} : {}),
          (sr ? {
            x: stockData.time,
            y: Array(stockData.time.length).fill(srLines.R1),
            mode: 'lines',
            name: 'Resistance 1',
            marker: {color: 'green'},
          } : {}),
          (sr ? {
            x: stockData.time,
            y: Array(stockData.time.length).fill(srLines.S1),
            mode: 'lines',
            name: 'Support 1',
            marker: {color: 'green'},
          } : {}),
          (sr ? {
            x: stockData.time,
            y: Array(stockData.time.length).fill(srLines.R2),
            mode: 'lines',
            name: 'Resistance 2',
            marker: {color: 'green'},
          } : {}),
          (sr ? {
            x: stockData.time,
            y: Array(stockData.time.length).fill(srLines.S2),
            mode: 'lines',
            name: 'Support 2',
            marker: {color: 'green'},
          } : {}),
        ]}
        layout={ {width: 1000, height: 600} }/>
}

export default Line;