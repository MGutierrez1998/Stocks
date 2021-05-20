import React from 'react';

function Company({setNav}) {
  return (<div>
    <button onClick={() => setNav("Home")}>back</button>

  </div>);
}
export default Company;