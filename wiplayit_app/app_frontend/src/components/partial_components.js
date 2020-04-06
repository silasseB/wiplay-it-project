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
 
    let styles = props && props.Styles;
    styles     = styles && styles.contents;
  	styles     = !styles && Styles.contents || styles;


      
    return (

         <div className="contents-nav-container">

            <div className="items-counter-box">
               <ul className="items-counter-box">
                    <li  className="items-count">
                        { props.itemsCounter }
                    </li>
               </ul>
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
         display      : 'flex',
         width        : '100%',
         border       : 'px solid red',

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




export const UnconfirmedUserWarning =(props)=> {
 
    let {cacheEntities} = props;
    let currentUser = cacheEntities && cacheEntities.currentUser;
    currentUser     = currentUser && currentUser.user;
    console.log(currentUser)
    
    return(
        <div>
            {currentUser && !currentUser.is_confirmed &&
            <div className="unconfirmed-user-warn-container">
                <div className="alert alert-warning unconfirmed-user-warn-box">
                    <button type="bottom" className="">
                        <span className="warning-icon material-icons">warning</span>
                    </button>

                    <ul className="unconfirmed-user-warn">
                        <li>
                        Your account has not been confirmed.
                         Please go to your email <span className="unconfirmed-user-email">
                         { currentUser && currentUser.email }</span> to
                        confirm your account and start posting.
                        </li>
                    </ul>
                </div>

            </div>
            }
        </div>
    );
};
