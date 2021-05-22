import React from 'react';
import Plot from "react-plotly.js";

function Company({setNav}) {
  
  return <div style={{'background-color':'white'}}>
    <div className="container">
			<div className="nav-wrapper">
				<div className="left-side">
					<div className="nav-link-wrapper">
						<button className="websiteButton" onClick={() => {setNav("Home")}}>Go back</button>
					</div>
				</div>
				<div className="right-side">
					<div className="brand">
						The Stock Trading Helper
					</div>
				</div>
			</div>
		</div>
    <div className="background">
      <section className="summary">
        <h2>Executive Summary</h2>
        <p>Google <b>Market Cap</b> as of May 17, 2021 is <b>$1526.89B</b>.</p>
        <p>Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.</p>
      </section>
	    <section className="snowflake">                           
	    	<Plot data={[
          {
            type: "scatterpolar",
            name: "angular categories",
            r: [5, 5, 3, 0, 3],
            theta: ['Past','Health','Future','Dividend', 'Value'],
            fill: "toself",
          },
        ]}
        layout={{ autosize:false,
                  width:500,
                  height:500,
                  title:"GOOGLE Snowflake Analysis",
        }}/>
	    </section>

      <section className="pter">
        <h2>Price to Earnings Ratio</h2>
        <p>The price to earnings ratio is calculated by taking the latest closing price and dividing it by the most recent earnings per share (EPS) number.</p> 
        <p>The PE ratio is a simple way to assess whether a stock is over or under valued and is the most widely used valuation measure.</p> 
        <p>Alphabet PE ratio as of May 17, 2021 is <b>30.33</b>.</p>
        <br/>
      </section>
      <section className="pter_graph">                        
        <Plot data={[
          {
            type: "bar",
            x:[30.33,35.85,19.8],
	          y:["Company","Industry","Market"],
	          orientation:"h",
          },
        ]}
        layout={{ autosize:false,
                  width:500,
                  height:500,
                  title:"Price to Earnings Ratio",
                  xaxis: {title:"PE Ratio"},
        }}/>
      </section>

    <section className="pe_results">
      <h3>Observations</h3>
      <p><b>PE vs Industry:</b> Google is <b>good</b> value based on its PE Ratio <b>30</b> compared to the US Interactive Media and Services industry average <b>36</b>.</p>
      <p><b>PE vs Market:</b> Google is <b>poor</b> value based on its PE Ratio <b>30</b> compared to the US market <b>20</b>.</p>
    </section>
	  <br/>
    <section className="ptbr">
      <h2>Price to Book Ratio</h2>
      <p>The Price to Book ratio is used to compare a company&#39;s current market price to its book value. This ratio is strongly preferred by conservative investors.</p>
      <p>Alphabet PB ratio as of May 17, 2021 is <b>6.64</b>.</p>
    </section>
    <section className="ptbr_graph">
      <Plot data={[
          {
            type: "bar",
            x:[6.64,3.68,2.69],
	          y:["Company","Industry","Market"],
	          orientation:"h",
          },
        ]}
        layout={{ autosize:false,
                  width:500,
                  height:500,
                  title:"Price to Book Ratio",
                  xaxis: {title:"Price/Book Ratio"},
        }}/>
    </section>
      <section className="pb_results">
      <h3>Observations</h3>
      <p><b>PB vs Industry:</b> Google is <b>overvalued</b> based on its PB Ratio <b>6.7</b> compared to the industry average <b>3.7</b>.</p>
    </section>
    <br/>
    <section className="annual_revenue">
      <h2>Annual Revenue over 10 Years</h2>
      <p>Revenue can be defined as the amount of money a company receives from its customers in exchange for the sales of goods or services.</p> 
      <p>Revenue is the top line item on an income statement from which all costs and expenses are subtracted to arrive at net income.</p>
    </section>
    <section className="ar_graph">
      <Plot data={[
          {
            type: "bar",
            y:["$29,321","$37,905","$46,039","$55,519","$66,001","$74,989","$90,272","$110,855","$136,819","$161,857","$182,527",],
	          x:[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,],
	          orientation:"v",
          },
        ]}
        layout={{ autosize:false,
                  width:1000,
                  height:500,
                  title:"Google Annual Revenue",
                  xaxis: {title:"Year"},
                  yaxis: {title:"Annual Revenue"}
        }}/>
    </section>
    
    <section className ="annual_result">
      <h3>Observations</h3>
      <p>Google&#39;s <b>annual revenue</b> for 2020 was <b>$182.527B</b>, a <b>12.77%</b> increase from 2019.</p>
    </section>
    
    <br/>

    <section className ="assets_liability">
      <h2>Assets and Liabilities</h2>
      <h3>Total Assets</h3>
      <p>Total assets can be defined as the sum of all assets on a company&#39;s balance sheet.</p>
      <p>Google&#39;s total assets from <b>2006</b> to <b>2021</b>.</p> 
    </section>

    <section className="assets_graph">
      <Plot data={[
          {
            type: "bar",
            y:["$18,473","$25,336","$31,768","$40,497","$57,851","$72,574","$93,798","$110,920","$129,187","$147,461","$167,497","$197,295","$232,792","$319,616",],
	          x:[2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,],
	          orientation:"v",
          },
        ]}
        layout={{ autosize:false,
                  width:1000,
                  height:500,
                  title:"Google Annual Total Assets",
                  xaxis: {title:"Date"},
                  yaxis: {title:"Total Assets"}
        }}/>
    </section>
    
    <section className ="total_assets_result">
      <h3>Observations</h3>
      <p>Alphabet total assets for 2020 were <b>$319.616B</b>, a <b>15.84%</b> increase from 2019.</p> 
    </section>
    <br/>
    <section className ="total_liability">
      <h3>Total Liabilities</h3>
      <p>Total liabilities can be defined as the total value of all possible claims against the corporation.</p>
      <p>Google&#39;s total liabilities from <b>2006</b> to <b>2021</b>.</p>
    </section>

    <section className="liability_graph">
      <Plot data={[
          {
            type: "bar",
            y:["$1,434","$2,646","$3,529","$4,493","$11,610","$14,429","$22,083","$23,611","$25,327","$27,130","$28,461","$44,793","$55,164","$74,467","$97,072",],
	          x:[2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,],
	          orientation:"v",
          },
        ]}
        layout={{ autosize:false,
                  width:1000,
                  height:500,
                  title:"Google Annual Total Liability",
                  xaxis: {title:"Date"},
                  yaxis: {title:"Total Liabilities"}
        }}/>
    </section>
    <section className="total_liability_result">
      <h3>Observations</h3>
      <p>Alphabet total liabilities for 2020 were <b>$97.072B</b>, a <b>30.36%</b> increase from 2019.</p>
    </section>

    <br/>
    <section className ="dividend">
      <h2>Dividend</h2>
      <p><b>Information Unavailable</b></p>
      <p>The current dividend payout for Google as of May 17, 2021 is <b>$0.00M</b>.</p> 
      <p>The current dividend yield for Alphabet as of May 17, 2021 is <b>0.00%</b>.</p>
    </section>
    <br/>
    <br/>
    <br/>
    <section className="DEMO">
      <h2>Demonstration using HTML, CSS and Python Plotly</h2>
    </section>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br></br>


    </div>

  </div>
}
export default Company;