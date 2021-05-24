import React, {useState, useEffect}from 'react';
import App from './App';
import Company from './Company';

const getLocalStorage = () => {
  let purchases = localStorage.getItem('purchases');
  if(purchases){
    return JSON.parse(localStorage.getItem('purchases'));
  }else{
    return [];
  }
}

function Website() {
  const [nav,setNav] = useState("Home");
  const [purchases,setPurchases] = useState(getLocalStorage());

  useEffect(()=>{
    localStorage.setItem('purchases',JSON.stringify(purchases));
  },[purchases])

  return (nav === "Home" ?
  <div>
    <div className="container">
      <div className="nav-wrapper">
        <div className="left-side">
          <div className="nav-link-wrapper active-nav-link">
            <button className="websiteButton" onClick={() => setNav("Home")}>Home</button>
          </div>
          <div className="nav-link-wrapper">
            <button className="websiteButton" onClick={() => setNav("About")}>About</button>
          </div>
          <div className="nav-link-wrapper">
            <button className="websiteButton" onClick={() => setNav("App")}>App</button>
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
      <div>
          <div style={{"width": "100%"}}>
              <img alt="" className="stock-image" style={{"float":"right"}} />
          </div>

          <div>
            <div className="homeInfo">
            <h1>Welcome</h1>
          </div>
      
          <section className ="home_about">
            <h2>Investing For Everyone</h2>
          </section>

            <section className="home_about">
            <h3>Commission-free, plus the tools that you need to put your money in motion.
            <br/><br/>
            Created by University of Technology Students for the ease of access that most stock trading website don't give to you.</h3>
          </section>
          </div>
      </div>

      <br/>
      <div>	
        <p className="nav-link-wrapper google_link"><button className="websiteButton" onClick={() => setNav("Company")}>See Alphabet (Google) Information</button></p>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
    </div>
    : nav === "About" ? 
      <div className="container">
        <div className="nav-wrapper">
          <div className="left-side">
            <div className="nav-link-wrapper">
              <button className="websiteButton" onClick={() => setNav("Home")}>Home</button>
            </div>
            <div className="nav-link-wrapper active-nav-link">
              <button className="websiteButton" onClick={() => setNav("About")}>About</button>
            </div>
            <div className="nav-link-wrapper">
              <button className="websiteButton" onClick={() => setNav("App")}>App</button>
            </div>
          </div>
          <div className="right-side">
            <div className="brand">
              The Stock Trading Helper
            </div>
          </div>
        </div>
        <div className="background">
          <h1><p className="aboutInfo">Hello</p></h1>
          <h3><p className="aboutInfo">This is website allows people to look at stocks and helps predict when to buy and sell, while also giving useful indicators of a companies health.</p></h3>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br></br>
        </div>
      </div>
    : nav === "App" ? <App setNav={setNav} purchases={purchases} setPurchases={setPurchases} />
    : nav === "Company" ? <Company setNav={setNav} />
    :<></>
    );
  
}
export default Website;
