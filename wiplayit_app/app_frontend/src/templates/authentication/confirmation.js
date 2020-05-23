import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import  EmailForm  from 'templates/authentication/email-form'; 
import { ConfirmationResendSmall,ConfirmationResendBig } from  'templates/authentication/utils'



 const AccountConfirmation = props => {
    console.log(props)
    let message = 'Your account has been successefully confirmed.'
    let error   = "Something wrong happened, please try again"
    let {successMessage, isConfirmed, errorMessage} = props;
  
    return(
   
        <div  className="account-confirmation-container" >
                 
            { props.onEmailResendForm &&
            <div className="confirmation-resend-container">
                <EmailForm {...props}/> 
            </div>

            ||
            <div>
                <ul className="form-title-box">
                    <li className="">{props.pageTitle}</li>
                </ul> 

            <div className="confirmation-message-box">
                { isConfirmed &&
                    <div>
                        <div className="confirmation-success-box">
                            <p className="confirmation-message message-success">
                                {successMessage || message}  You can login now and start posting
                            </p> 
                        </div>

                        <div className="confirmation-login-btn-box">
                            <LoginSmallScreem/>
                            <LoginBigScreem/>
                        </div>
                    </div>

                    ||

                    <div>
                        <div className="confirmation-error-box">
                            <p className="confirmation-message message-success">
                                {errorMessage || error}
                            </p>
                        </div>

                        <div className="resend-confirmation-btn-box">
                            <ConfirmationResendSmall {...props}/>
                            <ConfirmationResendBig {...props}/>
                        </div>
                    </div>
                }
            </div>
            </div>
        }
      
    </div>
   
  )
}

export default AccountConfirmation;
