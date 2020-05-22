import React from 'react';


 const LogoTest = props => (
	<div id="logo-test-box">
	    <div className="logo-img-box" onClick={()=> props.reloadPage()}>
            <img alt="" src={require("media/logo.png")} className="logo-img"/>
        </div>
  		
   </div> 
);

export default  LogoTest;












