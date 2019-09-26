import React from 'react';
import {NavBar } from 'components/registration'



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