import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import  AjaxLoader from "templates/ajax-loader";



const  LoginForm = props => {
    //console.log(props)
    let { submitting, onSignUpForm,onLoginForm, formIsValid, formName, form, validateForm} = props;


    form = form && form.loginForm? 
                           form.loginForm:null;

    let error = form && form.error; 
    formIsValid  = !onSignUpForm? validateForm(form, formName):false;

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{}; 
    

    return(
        <div>
        { form?

        <div>
        

            <p className="login-form-title label">Login</p>

            <form onSubmit={props.onSubmit} className="login-form">
               <NavBarSmallScreen {...props}/>
             
                <fieldset style={ fieldSetStyles}
                        disabled={ submitting || onSignUpForm }
                        className="fieldset-login">
                    {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }        
                               
               <div className="login-box">
                    {onLoginForm && error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }
                  <div className="login-fields">
                    <input
                      className="login-email-field"
                      placeholder="Email Address"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={props.handleFormChange} 
                      required
                      
                    />
                    
                  </div>
                  <div className="login-fields">
                    <input
                      className="login-password-field"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={props.handleFormChange} 
                      required
                      
                    />

                  </div>
    
                  <div className="registration-btn-box">  
                    <SubmitBtnBigScreen {...props}/>
                    <PasswordChangeSmall {...props}/>
                    <PasswordChangeBig {...props}/>
                  </div>
                </div>
   
             </fieldset>
            </form>

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
};



export default LoginForm;



