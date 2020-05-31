import React from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {history} from 'App';

import { NonFieldErrors,
         PasswordErrors,
         SmsCodeErrors } from 'templates/authentication/errors'

import { CancelFormBtn,
         RegistrationSubmitBtn,
         LoginSmallScreem,
         PasswordChangeSmall,
         PasswordChangeBig,
         LoginBigScreem,
         SpinLoader } from  'templates/authentication/utils'





export const PassWordChangeForm = props => {
    let {submitting,
         form,
         formName,
         onSignUpForm,
         onPasswordChangeForm,
         formIsValid,
         validateForm,
         formDescription,
         successMessage} = props;

    let disabledStyle = submitting || onSignUpForm? 
                                  {opacity:'0.60'}:
                                  {};
    
    form = form && form.passwordChangeForm? 
                           form.passwordChangeForm:null;
    let error = form && form.error; 

    formIsValid = onPasswordChangeForm? validateForm(form, formName):false;

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    
    return(
        <div className="password-change-contents">
            {form?

            <div className="password-change-box">
                <ul className="form-title-box">
                    <li className="">Password Change</li>
                </ul>

                <form className="password-change-form" onSubmit={props.onSubmit} >
                    <ul className="password-form-description">
                        <li>{formDescription}</li>
                    </ul>
                    {error &&
                        <PasswordErrors {...error}/>
                    }
               

                    <fieldset style={ fieldSetStyles}
                        disabled={ submitting || onSignUpForm}>
                        
                        <div  className="" >
                            <div className="change-password-box auth-input-field">
                                <input
                                    className="password"
                                    placeholder="New Password"
                                    type="password"
                                    name="new_password1"
                                    value={form.new_password1}
                                    onChange={props.handleFormChange}
                                    required
                                />
                            </div>

                            <div className="change-password-box auth-input-field">
                                <input
                                    className="password"
                                    placeholder="Repeat New Password"
                                    type="password"
                                    name="new_password2"
                                    value={form.new_password2}
                                    onChange={props.handleFormChange}
                                    required
                                />
                            </div>
                            <div className="submit-btn-box">
                                <RegistrationSubmitBtn {...props}/>
                            </div>
                            <div className="password-change-link-box">
                                <PasswordChangeSmall {...props}/>
                                <PasswordChangeBig {...props}/>
                            </div> 
                        </div>
                    </fieldset>
                </form>
            }

            <SpinLoader {...props}/> 
        </div>
        :
        ""
    }
    </div>
  )
}


export default PassWordChangeForm;

/*
export const FormErrors =(form)=> {
    let formErrors = form && form.passwordChangeForm || null;
    formErrors = formErrors && formErrors.error; 
    if (!formErrors) return null;

    return(
        <div>
            <NonFieldErrors {...formErrors}/>
            <PasswordErrors {...formErrors}/>
            <SmsCodeErrors {...formErrors}/>
        </div>
    )
}; 
*/

export const SuccessPasswordChange =(props)=>{

    return(
        <div className="password-change-success">
            <div className="password-change-success-box">
                <p className="password-change-success message-success">
                    You successfully changed  your password with a new new one.
                </p>
            </div>
            <div className="confirmation-login-btn-box">
                <LoginSmallScreem/>
                <LoginBigScreem/>
            </div>
        </div>
    )
};

