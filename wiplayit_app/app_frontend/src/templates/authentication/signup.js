import React from 'react';
import {  Link } from "react-router-dom";
import  AjaxLoader from "templates/ajax-loader";





const  SignUpForm= props => {
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
                { error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
                                )}
                            </div>
                            :
                            ""
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
                    { error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
                                )}
                            </div>
                            :
                            ""
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
}

export default SignUpForm;



