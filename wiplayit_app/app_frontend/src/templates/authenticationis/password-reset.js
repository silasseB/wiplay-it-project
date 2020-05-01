import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from "components/ajax-loader";
import {history} from "App";

import { CancelFormBtn,
         SubmitBtnBigScreen,
         AjaxLoader, } from  'components/utils'





export const EmailFormComponent = props => {
    console.log(props)

    let { submitting ,onSignUpForm,
          onPasswordResetForm, successMessage,
          onEmailResendForm, form, formIsValid, formName, validateForm } = props;

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

   
    return(
        <div>
            { form? 
               <div className="email-form-box">
                    <p className="password-reset-form-title">
          
                    </p>

            { successMessage && !submitting?
               <div className="success-message-box">
                    <p className="message-success">
                         {successMessage}
                    </p>

                    <div className="resend-email-box ">
                        <button type="button" onClick={()=> props.toggleEmailForm(toggleProps)}
                                 className="resend-email-btn" >
                           Resend
                        </button>
                        <CancelEmailForm {...props}/>
                    </div>
                </div>
            :

            <form className="email-form" onSubmit={props.onSubmit}>
                <NavBarSmallScreen {...props}/> 
                 <li className="password-form-description">{props.formDescription}</li>
                    { error &&
                        <NonFieldErrors {...error}/>
                    }

                             
                <fieldset style={ fieldSetStyles} 
                      disabled={ submitting || onSignUpForm} >

                    <div  className="email-fields">
                       

                        <p></p>
                        <div className="email-box">
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

                    <div className="registration-btn-box">
                        <SubmitBtnBigScreen {...props}/>
                        
                        <CancelEmailForm {...props}/>
                  
                    </div>

                </fieldset>    

            </form>

            }

            { onSignUpForm?
            
            ""
            :
            <SpinLoader {...props}/> 
              
          }  
        </div>

        :
        ""
        }
    </div>

   )
}

