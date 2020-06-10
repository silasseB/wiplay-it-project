import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import  EmailForm  from 'templates/authentication/email-form'; 
import { ConfirmationResendSmall,
         LoginSmallScreem,
         SpinLoader,
         LoginBigScreem,
         ConfirmationResendBig } from  'templates/authentication/utils'



const AccountConfirmation = props => {
   
    return(
        <div  className="account-confirmation-container" >
            { props.onEmailResendForm &&
                <div className="confirmation-resend-container">
                    <EmailForm {...props}/> 
                </div>
                ||
                <Confirmation {...props}/>
            }
        </div>
    );
};

export default AccountConfirmation;

const Confirmation =(props)=> {
    let {isConfirmation, submitting, pageTitle} = props;

    return(
        <div>
            <ul className="form-title-box">
                <li className="">{pageTitle}</li>
            </ul> 

            <div className="confirmation-message-box">
                <SpinLoader {...props}/> 
                {!submitting && 
                    <div>
                        {isConfirmation &&
                            <ConfirmationSuccess {...props}/>
                        
                            ||
                            <ConfirmationError {...props}/>
                        }
                    </div>
                }
            </div>
        </div>
    );
};


const ConfirmationSuccess =(props)=> {
    let message = 'Your account has been successefully confirmed.'
    let {successMessage} = props;

    return(
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
    );
};

const ConfirmationError =(props)=> {
    let error   = "Something wrong happened, please try again"
    let {errorMessage} = props;

    return(
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
    );
};