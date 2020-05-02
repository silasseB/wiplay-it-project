import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';

import { ConfirmationResendSmall,ConfirmationResendBig } from  'templates/authentication/utils'



export const AccountConfirmationComponent = props => {
  console.log(props)
  let message = 'Your account has been successefully confirmed.'
  let error   = "Something wrong happened, please try again"
  let {successMessage, isConfirmed, errorMessage} = props;
  
  return(
   
    <div  className="account-confirmation-container" >
        <div className="confirmation-title-box">
            <p className="confirmation-title">
                {props.pageTitle}
            </p>
        </div>
       
        { props.onEmailResendForm &&
            <div className="confirmation-resend-container">
                <EmailFormComponent {...props}/> 
            </div>

            ||

            <div className="confirmation-message-box">
                { isConfirmed &&
                    <div>
                        <div className="confirmation-success-box">
                            <p className="confirmation-message message-success">
                                {successMessage || message}  You can login now and start posting
                            </p> 
                        </div>

                        <div className="confirmation-login-box">
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
        }
      
    </div>
   
  )
}


const LoginSmall = props => {
   return (
      <Link type="button" to="/user/login/">Login</Link>
   )
}


const LoginBig = props => {
   return (
      <Link  type="button" to="/user/registration/">Login</Link>
   )
}

const LoginSmallScreem   = MatchMediaHOC(LoginSmall, '(max-width: 980px)')
const LoginBigScreem   = MatchMediaHOC(LoginBig, '(min-width: 980px)')

