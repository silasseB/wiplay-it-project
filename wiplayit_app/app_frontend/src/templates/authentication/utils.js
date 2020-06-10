import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from 'templates/ajax-loader';
import {history} from "App";





export const AuthenticatedComponent = props => {
      
    return (
        <div className="authenticated-box">
            <div className="authenticated-contents">
               <ul className="authenticated-title">
                   <li className="" >You already logged in</li>
                </ul>
                <div className="authenticated-redirect-link-box">
                    <Link type="button" className="authenticated-redirect-link btn" to="/"> 
                        Home
                    </Link>
                </div>
            </div>
        </div>    
    );
};


export const NavBar = props => {
      
    return (
        <div className="navigation-bar fixed-top">
            <div className="navbar-box">
               <ul className="navbar-title-box">
                   <li className="" >{props.navbarTitle}</li>
                </ul>
            </div>
        </div>    
    );
};




export const  SpinLoader  = props => {
    return (
        <div className="registration-spin-loader-box">
            {props.submitting?
               <AjaxLoader/> 
               :
               "" 
            }
        </div>
    );
};


const  ConfirmationResendBtn  = props => {
    let toggleProps = { value : true, formName : 'emailResendForm' };
    return(
        <button type="button" onClick={()=> props.toggleEmailForm(toggleProps)} 
                  className="resend-confirmation-btn btn" >
            Resend Confirmation Email
        </button>
    );
};


const  ConfirmationResendLink  = props => (
        <button type="button" 
                className="resend-confirmation-btn btn" 
                onClick={()=> history.push("/account/email/resend/")}> 
            Resend Confirmation Email
        </button>
);


const  CancelConfirmationBtn  = props => {
    let toggleProps = {value:false, formName:props.formName};

    return (
        <button type="button" onClick={()=>props.toggleEmailForm(toggleProps)} 
            className="form-cancel-btn btn " >
            Cancel
        </button>
    );
};

export const  PasswordChangeButton  = props => {

    let toggleProps = { value : true, formName : 'passwordResetForm' };
    return(
        <button type="button" onClick={()=> props.toggleEmailForm(toggleProps)} 
                  className="password-change-btn" >
            Forgot Password ?
        </button>
    );
};

const  PasswordChangeLink  = props => (
        <Link className="password-change-link" to="/password/reset/"> 
            Forgot Password ?
        </Link>
);


const  CancelBtn  = props => {
    let toggleProps = {value : false, formName:props.formName};
    

    return(
        <button type="button" onClick={()=>props.toggleSignUpForm(toggleProps)} 
                  className="form-cancel-btn btn-sm " >
           Cancel
        </button>
    )
};

export const  CancelEmailFormBtn  = props => {
    let toggleProps = {value:false, formName:props.formName};

    return (
        <button type="button" onClick={()=>props.toggleEmailForm(toggleProps)} 
            className="form-cancel-btn text-highlight btn-sm " >
            Cancel
        </button>
    );
};



export const  RegistrationSubmitBtn  = props => {
    let submitButtonStyles = props.submitting? {opacity:'0.60'}: {};
   
    return(
        <button type="submit" 
                style={submitButtonStyles} 
                disabled={props.submitting}
                className="registration-submit-btn btn-sm">
            Submit
        </button>
    )
};


const LoginSmall = props => {
    return (
        <Link className="btn confirmation-login-link"
            type="button"
            to="/user/login/">
            Login
        </Link>
    )
}


const LoginBig = props => {
    return (
        <Link className="btn confirmation-login-link" 
            type="button"
            to="/user/registration/">
            Login
        </Link>
    )
}

export const LoginSmallScreem   = MatchMediaHOC(LoginSmall, '(max-width: 980px)')
export const LoginBigScreem   = MatchMediaHOC(LoginBig, '(min-width: 980px)')

export const  SubmitBtnSmallScreen = MatchMediaHOC(RegistrationSubmitBtn, '(max-width: 980px)') 
export const  SubmitBtnBigScreen = MatchMediaHOC(RegistrationSubmitBtn, '(min-width: 980px)') 

export const RegistrationSpinLoader = MatchMediaHOC(SpinLoader , '(min-width: 980px)');

export const CancelEmailFormSmall = MatchMediaHOC(CancelEmailFormBtn, '(max-width : 980px)');
export const CancelFormBtn   = MatchMediaHOC(CancelBtn , '(min-width: 980px)');
export const CancelEmailForm = MatchMediaHOC(CancelEmailFormBtn , '(min-width: 980px)');

export const ConfirmationResendSmall = MatchMediaHOC(ConfirmationResendLink, '(max-width: 980px)');
export const ConfirmationResendBig   = MatchMediaHOC(ConfirmationResendBtn,  '(min-width: 980px)');


export const PasswordChangeSmall = MatchMediaHOC(PasswordChangeLink , '(max-width: 980px)');
export const PasswordChangeBig   = MatchMediaHOC(PasswordChangeButton , '(min-width: 980px)');


