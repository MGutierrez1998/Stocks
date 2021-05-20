import React, {useState}from 'react';
import App from './App';
import Company from './Company';

function Website() {
  const [nav,setNav] = useState("Home");

  return (nav === "Home" ?
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
      <h1><p className="homeInfo">This is where the other graphs are located.</p></h1>
      <p className="nav-link-wrapper"><button className="websiteButton" onClick={() => setNav("Company")}>See Alphabet (Google) Information</button></p>
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
          <div class="right-side">
            <div class="brand">
              The Stock Trading Helper
            </div>
          </div>
        </div>
        <div className="profile-content-wrapper">
          <h1><p className="aboutInfo">Hello</p></h1>
          <h3><p className="aboutInfo">This is website allows people to look at stocks and helps predict when to buy and sell, while also giving useful indicators of a companies health.</p></h3>
        </div>
      </div>
    : nav === "App" ? <App setNav={setNav} />
    : nav === "Company" ? <Company setNav={setNav} />
    :<></>
    );
  
}
export default Website;
