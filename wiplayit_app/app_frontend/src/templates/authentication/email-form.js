import React from 'react';

import { NonFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"

import { RegistrationSubmitBtn,
         CancelEmailForm,
         CancelEmailFormSmall,
         SpinLoader, 
         NavBarSmallScreen } from  'templates/authentication/utils'



const EmailForm = props => {

    let {submitting,
        onSignUpForm,
        onPasswordResetForm,
        onEmailResendForm,
        passwordRestAuth,
        form, 
        successMessage,
        formIsValid,
        formName, 
        formDescription,
        validateForm,
        isSocialAuth } = props;

    form = form && form[formName]? 
                           form[formName]:null;
    let error = form && form.error; 

    formIsValid =  onPasswordResetForm || onEmailResendForm?
                             validateForm(form, formName):false;

    let email = successMessage?props.email:null;

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    let toggleProps = {successMessage:false, value:true, formName}
    let formTitle   = onEmailResendForm && 'Confirmation Resend' ||
                      onPasswordResetForm && 'Password Reset';


    formDescription = `Enter your e-mail address or ` +
                                           `phone number.`;
           
    return(
        <div>
            { form && 
                <div className="email-form-box">
                
                    <ul className="form-title-box">
                        <li className="">{formTitle}</li>
                    </ul>
                    {successMessage &&
                        <EmailPasswordResetSuccess {...props}/>
                        ||


                    <form className="email-form" onSubmit={props.onSubmit}>
                        <ul className="password-form-description">
                            <li>
                               {formDescription}
                            </li>
                        </ul>

                        {!isSocialAuth && error &&
                            <NonFieldErrors {...error}/>
                        }

                        {!isSocialAuth && error &&
                          <EmailFieldErrors {...error}/>
                        }

                        <fieldset style={ fieldSetStyles} 
                            disabled={ submitting || onSignUpForm} >

                            <div  className="email-fields">
                                <p></p>
                                <div className="email-box auth-input-field">
                                    <input
                                        placeholder="Email or Phone Number"
                                        className="email"
                                        type="text"
                                        name="email"
                                        value={form.email}
                                        onChange={props.handleFormChange}
                                        required
                       
                                    />
                                </div>
                            </div>

                            <div className="registration-btns-box">
                                <div className="submit-btn-box">
                                    <RegistrationSubmitBtn {...props}/>
                                </div>
                                <div className="cancel-email-form-btn-box">
                                    <CancelEmailForm {...props}/> 
                                    {props.children}
                                </div>                  
                            </div>
                        </fieldset>   
                        {!isSocialAuth && !onSignUpForm &&
                            <SpinLoader {...props}/> 
                        }   
                    </form>
                }
                </div>
            }
        </div>
    )
};

export default EmailForm;


export const EmailPasswordResetSuccess =(props)=>{
    let {formName, cacheEntities, passwordRestAuth} = props;
    let {userAuth} = cacheEntities

    if (!passwordRestAuth) {
        passwordRestAuth =  userAuth.passwordRestAuth;
    }

    let {identifier} = passwordRestAuth || {};
    let toggleProps = {value : true, formName : 'passwordResetForm'};

    return(
        <div className="success-message-box">
            <ul className="message-success">
                <li>
                    Instructions to change your password has been sent to
                    <span className="unconfirmed-user-email">
                      {' '}{identifier} 
                    </span> address. Please open you email to change your password.
                </li>
            </ul>

            <div className="resend-email-box">
                <p className="resend-email-text">
                    Didn't receive any email ?
                </p>
                <button type="button" 
                        onClick={()=> props.toggleEmailForm(toggleProps)}
                        className="resend-email-btn" >
                    Resend
                </button>
            </div>
        </div>
    )
} 


export const SmsCodeForm = props => {
    let {submitting,
        onSignUpForm,
        onPasswordResetForm,
        successMessage,
        onEmailResendForm,
        form, 
        formIsValid,
        formName, 
        formTitle,
        validateForm,
        isSocialAuth } = props;

    form = form && form[formName]? 
                           form[formName]:null;
    let error = form && form.error; 

    formIsValid =  onPasswordResetForm || onEmailResendForm?
                             validateForm(form, formName):false;

    let email = successMessage?props.email:null;

    let submitButtonStyles = submitting || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};
    let toggleProps    = {value : true, formName : 'passwordResetForm'};
         
    return(
        <div>
            { onPasswordResetForm || onEmailResendForm &&
                <div className="password-reset-bo">
                    <EmailForm {...props}>
                        <CancelEmailFormSmall {...props}/>
                    </EmailForm> 
                </div>
                ||
                <div>

                {form && 
                    <div className="sms-code-form-box">
                        <ul className="form-title-box">
                            <li className="">{formTitle}</li>
                        </ul>
                                                                
                        <form className="sms-code-form" onSubmit={props.onSubmit}>
                            {props.children}
                           

                        {error &&
                            <NonFieldErrors {...error}/>
                        }
                     

                        <fieldset style={ fieldSetStyles} 
                                  disabled={ submitting || onSignUpForm} >
                            <div  className="email-fields">
                                <p></p>
                                <div className="email-box auth-input-field">
                                    <input
                                        placeholder="Enter code"
                                        className="email"
                                        type="number"
                                        name="sms_code"
                                        value={form.sms_code}
                                        onChange={props.handleFormChange}
                                        required
                                    />

                                </div>
                            </div>

                            <div className="">
                                <div className="submit-btn-box">
                                    <RegistrationSubmitBtn {...props}/>
                                </div>
                                <div className="resend-email-box">
                                    <p className="resend-email-text">
                                        You didn't receive any sms ?
                                    </p>

                                    <button type="button" 
                                            onClick={()=>props.toggleEmailForm(toggleProps)} 
                                            className="resend-email-btn btn-sm " >
                                        Resend
                                    </button>
                                </div>                  
                            </div>
                        </fieldset>   
                        {!isSocialAuth && !onSignUpForm &&
                            <SpinLoader {...props}/> 
                        }   
                        </form>
                    </div>
                }
                </div>

            }
        </div>
    )
};




