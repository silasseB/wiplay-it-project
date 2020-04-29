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
 
    let styles = props && props.Styles;
    styles     = styles && styles.contents;
  	styles     = !styles && Styles.contents || styles;

   
      
    return (

         <div className="contents-nav-container">

            <div className="items-counter-box">
               <ul className="items-counter-box">
                    <li  className="items-btn-box">
                        { props.itemsCounter }
                    </li>
               </ul>
            </div>

            <ul  className="contents-nav-box" > 
               <li className="btn-box1">
                 { props.btn1 }
               </li>

               <li  className="btn-box2">
                  { props.btn2 }
               </li>

               <li className="btn-box3">
                  { props.btn3 }
               </li>
            </ul>
            
         </div>   
      

    )

}


export const Styles = {
      contents : {
         display      : 'flex',
         border       : 'px solid red',

      }
   }


export const PageErrorComponent = props => {
    console.log(props)
    let {error, isReloading } = props;
    if (isReloading) return '';

    return(
        <div className="page-error-box" id="page-error-box">
            <ul className="error-box">
                <li className="error-text">{error}</li>
            </ul>

            <ul className="reload-btn-box">
                
                    <button type="bottom"
                        onClick={()=> props.reLoader() }
                        className="reload-btn btn-sm">
                        <li className="reload-btn-box2">
                            <span className="reload-icon material-icons">refresh</span> 
                            <span className="reload-icon-text">Try Again</span>
                        </li>
                    </button>
            </ul>
        </div>
    )

}





export const AlertComponent =(props)=> {
    let defaulfMessage   = 'This is a warning message alert'
    let { message }      = props; 
    let textMessage      = message && message.textMessage || defaulfMessage; 

    let  messageType     = message && message.messageType;
    let classNames       = 'alert alert-container' 
    classNames           = messageType === 'error'   && `${classNames} alert-danger`   ||
                           messageType === 'success' &&  `${classNames} alert-success` || classNames;
                                 

    //console.log(classNames, messageType)        
    
    return(
        <div className={classNames}>
            <div className="alert-box">
                <ul className="alert-message">
                    <li>
                        { textMessage }
                    </li>
                </ul>
            </div>

        </div>
    )
};




export const UnconfirmedUserWarning =(props)=> {
 
    let {cacheEntities, currentUser} = props;
    currentUser     = !currentUser && cacheEntities && 
                       cacheEntities.currentUser && 
                       cacheEntities.currentUser.user || currentUser;

    //console.log(currentUser)
    
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

