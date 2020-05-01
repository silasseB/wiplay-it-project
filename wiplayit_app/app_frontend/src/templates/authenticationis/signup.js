import React from 'react';

import { NonFieldErrors,
         EmailFieldErrors} from "components/authentication/errors"
import { CancelFormBtn,
         SubmitBtnBigScreen,
         AjaxLoader, } from  'components/authentication/utils';


export const  SignUpForm = props => {
    //console.log(props)

    let { submitting, form, onSignUpForm, formName, formIsValid, validateForm } = props;

    form = form && form.signUpForm? 
                           form.signUpForm:null;

    let error = form && form.error; 
    
    formIsValid = onSignUpForm? validateForm(form, formName):false;
    let submitButtonStyles = submitting || !formIsValid?{opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting ? {opacity:'0.60'}:{}; 

    
    return(
        <div>
          { form?
          <div>
          <p className="signup-form-title">Sign Up</p>

          <form onSubmit={props.onSubmit} className="sign-up-form">
            <NavBarSmallScreen {...props}/>

            { error &&
                <NonFieldErrors {...error}/>
            }       

            <fieldset  disabled={ submitting } 
                       style={ fieldSetStyles}
                       className="fieldset-signup" >

              <div className="sign-up-box">
            
                <div className="name-fields">
                            
                  <div className="username-fields">
                    <div className="name-field-box1">
                      <input
                        placeholder="First Name"
                        className="first-name-input"
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={props.handleFormChange}
                        required
                      />

                    </div>  
                    <div className="name-field-box2">
                      <input
                        placeholder="Last Name"
                        className="last-name-input"
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={props.handleFormChange}
                        required
                      />
                      
                    </div>

                  </div>
               </div>

               <div  className="email-fields signup-fields">
                    { onLoginForm && error &&
                        <EmailFieldErrors {...error}/>
                    }

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

               <div className="password-fields signup-fields">
                  <div className="password-box">
                      <input
                        placeholder="Password"
                        className="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={props.handleFormChange}
                        required
                      />

                  </div>
               </div>
            </div>
              <SubmitBtnBigScreen {...props}/>
              <CancelFormBtn {...props}/>          
            </fieldset>
          </form>
          { onSignUpForm?
     
            <SpinLoader {...props}/> 
            :
            ""
              
          }
      </div>

      :
      ""
    }
    </div>
          
   )
};




