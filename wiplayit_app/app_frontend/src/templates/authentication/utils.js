import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from 'templates/ajax-loader';
import {history} from "App";






export const  NavBar   = props => {
    
    console.log(props)
    
    return (
        <div className="navigation-bar fixed-top">
            <div className="navbar-box">
               <div className="navbar-title-box">
                   <p className="" >{props.navbarTitle}</p>
                </div>
            </div>
        </div>    
    );
};



export const  NavBarSmall   = props => {
    let { submitting, formIsValid, formName, form, validateForm} = props;
    formIsValid  = validateForm(form, formName) || false;

    let submitButtonStyles = submitting || !formIsValid? {opacity:'0.60'}: {};
        
    
    return (
        <div className="navigation-bar fixed-top">
         <div className="navbar-box">
            <div className="navbar-sm-title-box">
                <p className="" >{props.navbarTitle}</p>
            </div>
              
            <div className="navbar-submit-box">
                <button type="submit" 
                    style={submitButtonStyles} 
                    disabled={submitting}
                    className="navbar-submit btn-submit btn-sm">
                    Submit
                </button>
               
            </div>
          </div>
        </div>    
    );
};




export const  SpinLoader  = props => {
  
    return (
        <div className="registration-spin-loader-box">
            { props.submitting?
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
                  className="resend-confirmation-btn" >
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

const  PasswordChangeButton  = props => {

    let toggleProps = { value : true, formName : 'passwordResetForm' };
    return(
        <button type="button" onClick={()=> props.toggleEmailForm(toggleProps)} 
                  className="password-change-btn" >
            Forgot Password ?
        </button>
    );
};

const  PasswordChangeLink  = props => (
    <div className="password-change-link-box">
        <Link className="password-change-link" to="/user/account/password/reset/"> 
            Forgot Password ?
        </Link>
    </div>
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

const  CancelEmailFormBtn  = props => {
    let toggleProps = {value:false, formName:props.formName};
    console.log(toggleProps)

    return (
        <button type="button" onClick={()=>props.toggleEmailForm(toggleProps)} 
            className="form-cancel-btn btn-sm " >
            Cancel
        </button>
    );
};



const  SubmitBtn  = props => {
    let submitButtonStyles = props.submitting? {opacity:'0.60'}: {};
   
    return(
        <button type="submit" 
                style={submitButtonStyles} 
                disabled={props.submitting}
                className="auth-submit-btn btn-sm">
            Submit
        </button>
    )
};


export const  SubmitBtnSmallScreen = MatchMediaHOC(SubmitBtn, '(max-width: 980px)') 
export const  SubmitBtnBigScreen = MatchMediaHOC(SubmitBtn, '(min-width: 980px)') 
export const NavBarSmallScreen = MatchMediaHOC(NavBarSmall, '(max-width : 980px)')

export const RegistrationSpinLoader = MatchMediaHOC(SpinLoader , '(min-width: 980px)');


export const CancelFormBtn   = MatchMediaHOC(CancelBtn , '(min-width: 980px)');
export const CancelEmailForm = MatchMediaHOC(CancelEmailFormBtn , '(min-width: 980px)');

export const ConfirmationResendSmall = MatchMediaHOC(ConfirmationResendLink, '(max-width: 980px)');
export const ConfirmationResendBig   = MatchMediaHOC(ConfirmationResendBtn,  '(min-width: 980px)');


export const PasswordChangeSmall = MatchMediaHOC(PasswordChangeLink , '(max-width: 980px)');
export const PasswordChangeBig   = MatchMediaHOC(PasswordChangeButton , '(min-width: 980px)');


