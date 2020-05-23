import React from 'react';

import { NonFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"

import { RegistrationSubmitBtn,
         CancelEmailForm,
         SpinLoader, 
         NavBarSmallScreen } from  'templates/authentication/utils'



const EmailForm = props => {
    let {submitting,
        onSignUpForm,
        onPasswordResetForm,
        successMessage,
        onEmailResendForm,
        form, 
        formIsValid,
        formName, 
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

    
    return(
        <div>
            { form? 
                <div className="email-form-box">
                    <ul className="form-title-box">
                        <li className="">{formTitle}</li>
                    </ul>
                    
                    { successMessage && !submitting?
                        <div className="success-message-box">
                            <p className="message-success">
                                {successMessage}
                            </p>

                            <div className="resend-email-box ">
                                <button type="button" 
                                        onClick={()=> props.toggleEmailForm(toggleProps)}
                                        className="resend-email-btn" >
                                     Resend
                                </button>
                                <CancelEmailForm {...props}/>
                            </div>
                        </div>

                        :

                    <form className="email-form" onSubmit={props.onSubmit}>
                        <ul className="password-form-description">
                            <li>
                               {props.formDescription}
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
                               placeholder="Email"
                               className="email"
                               type="email"
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
                        </div>                  
                    </div>

                </fieldset>   
                {!isSocialAuth && !onSignUpForm &&
                  <SpinLoader {...props}/> 
                }   

            </form>

            }
            
        </div>

        :
        ""
        }
    </div>

   )
}

export default EmailForm;
