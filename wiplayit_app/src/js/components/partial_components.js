import React from 'react';
import {NavBar } from '../components/registration'



export const DefaultWrongPage = props => {
	return(
		<div>
		   <NavBar {...props}/>
		   <div>
		      <div>
		        <div>

		        </div>
		      </div>
	   	</div>
		</div>

		)

}


export const ButtonsBox = props => {
 
    let styles = {};
    if (props.Styles) {
    	styles = props.Styles.contents;
    }	

      
    return (

         <div className="contents-nav-container">

            <div className="items-counter-box">
               <li  className="items-count">
                  { props.itemsCounter }
               </li>
            </div>

            <div style={styles} className="contents-nav-box" > 
               <div className="btn-box1">
                 { props.btn1 }
               </div>

               <div  className="btn-box2">
                  { props.btn2 }
               </div>

               <div className="options-box btn-box3">
                  { props.btn3 }
               </div>
            </div>
            
         </div>   
      

    )

}


export const Styles = {
      contents : {
         borderTop    : '1px solid  #D5D7D5',
         borderBottom : '1px solid  #D5D7D5',
         display      : 'flex',
         marginTop    : '4px',
         width        : '100%',
         

      }
   }



const AlertStyles = {
  
  alertBox: {
    width                   : '100%',
    margin                  : 'auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#38B0F0',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : 'auto', 
    bottom                  :  0,
    top                     :  'auto', 
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
  },

  alertMessageBox :{
    color   : '#fff',
    margin  : '5px 20px',
    
  },
  message :{
    listStyleType: 'none',
    margin: 0,
    padding: 0,

  }
};


export const AlertComponent =(props)=> {
    let defaulfMessage = 'This is a warning message alert'
    
    return(
        <div style={AlertStyles.alertBox} className="alert-box">
            <div style={AlertStyles.alertMessageBox} className="alert-ms-box">
                <ul style={AlertStyles.message}>
                    <li>
                        { props.errorMessage || props.successMessage || defaulfMessage}
                    </li>
                </ul>
            </div>

        </div>
    )
};


