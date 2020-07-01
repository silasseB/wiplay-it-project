import React from 'react';
import * as Icon from 'react-feather';
import {SmsCodeModalBtn} from "templates/buttons";
import {validateEmail,
        validatePhoneNumber} from 'components/authentication/utils';

export const ButtonsBox = props => {
    let styles = props && props.Styles;
    styles     = styles && styles.contents;
  	styles     = !styles && Styles.contents || styles;
    
    return (
        <div className="contents-nav-container">

            <div className="items-counter-box">
               <ul className="items-counter-box">
                    <li  className="items-btn-box">
                        {props.itemsCounter || null}
                    </li>
               </ul>
            </div>

            <ul  className="contents-nav-box" > 
               <li className="btn-box1">
                 { props.btn1 || null}
               </li>

               <li  className="btn-box2">
                  { props.btn2 || null  }
               </li>

               <li className="btn-box3">
                  {props.btn3 || null }
               </li>
            </ul>
            
        </div>   
    )

};


export const Styles = {
    contents : {
        display      : 'flex',
        border       : 'px solid red',
    }
}


export const PageErrorComponent = props => {
    let {error, isReloading } = props;
    if (isReloading) return null;
    if (!error) return null;

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
    let { message,alertBoxStyles }      = props;

    let textMessage  = message && message.textMessage || defaulfMessage; 

    let  messageType = message && message.messageType;
     
    let classNames   = messageType === 'error'   && `alert-danger`   ||
                       messageType === 'success' &&  `alert-success` ;
        
    let styles= alertBoxStyles || {}; 
    return(
        <div  className="alert-container">
            <div style={styles} className={`alert  alert-success ${classNames}`}>
                <div  className="alert-box">

                    <ul className="alert-message">
                        <li>
                            { textMessage }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};




export const UnconfirmedUserWarning =(props)=> {
 
    let {cacheEntities, currentUser} = props;
    currentUser     = !currentUser && cacheEntities && 
                       cacheEntities.currentUser && 
                       cacheEntities.currentUser.user || currentUser;
 
    let smsCodeProps = {
            linkName  : "Here to confirm",
            currentUser,
        };

    return(
        <div>
            {currentUser && !currentUser.is_confirmed &&
            <div className="unconfirmed-user-warn-container">
                <div className="alert alert-warning unconfirmed-user-warn-box">
                    <button type="bottom" className="">
                        <Icon.AlertCircle id="feather-alert-circle" size={20}/>
                    </button>

                    <ul className="unconfirmed-user-warn">
                        <li>
                            Your account has not been confirmed and you won't be avble to
                            post or edit you profile.Please click 
                            <SmsCodeModalBtn {...smsCodeProps}/> your account.
                        </li>
                    </ul>
                </div>

            </div>
            }
        </div>
    );
};

const EmailVerifyWarning =(props)=> {
  let {cacheEntities, currentUser} = props;
  currentUser     = !currentUser && cacheEntities && 
                       cacheEntities.currentUser && 
                       cacheEntities.currentUser.user || currentUser;
    if (currentUser && validateEmail(currentUser.email)) {
        return(
            <li>

                Your account has not been confirmed and you won't be avble to 
                post or edit you profile.
                Please go to your email <span className="text-highlight">
                { currentUser && currentUser.email }</span> to
                confirm your account and start posting.
            </li>
        );
    }else{
        return null;
    }


}

const PhoneNumbeVerifyWarning =(props)=> {
    let {cacheEntities, currentUser} = props;
    currentUser     = !currentUser && cacheEntities && 
                       cacheEntities.currentUser && 
                       cacheEntities.currentUser.user || currentUser;

    if (currentUser && validatePhoneNumber(currentUser.email)) {
        let phone_number = currentUser && currentUser.phone_numbers;
        phone_number = phone_number && phone_number.national_format;

        let smsCodeProps = {
            linkName  : "Here",
            currentUser,
        };

        return(
            <li>
                We texted a code to your phone number <span className="text-highlight">
                {phone_number}</span> to confirm its your phone number.
                Please click  <SmsCodeModalBtn {...smsCodeProps}/>  to
                confirm your account.
            </li>
        );

    }else{
        return null;

    } 
};