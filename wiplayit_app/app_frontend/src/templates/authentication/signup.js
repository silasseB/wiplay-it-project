import React from 'react';
import { MatchMediaHOC } from 'react-match-media';
import {  Link } from "react-router-dom";
import { CountryDropdown,
       RegionDropdown, 
       CountryRegionData } from 'react-country-region-selector';

import { NonFieldErrors,
         CountryFieldErrors,
         EmailFieldErrors} from "templates/authentication/errors"
import { CancelSignupFormBtn,
         RegistrationSubmitBtn,
         SpinLoader} from  'templates/authentication/utils';


export const  SignUpForm = props => {
    //console.log(props)

    let { 
          submitting,
          form,
          onSignUpForm,
          formName,
          formIsValid, 
          validateForm, 
          isSocialAuth} = props;

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
            <ul className="form-title-box">
                <li className="">Create Account</li>
            </ul> 

          <form onSubmit={props.onSubmit} className="sign-up-form">
              <fieldset  disabled={ submitting } 
                       style={ fieldSetStyles}
                       className="fieldset-signup" >

              <div className="sign-up-box">
            
                <div className="name-fields">
                            
                  <div className="username-fields">
                    <div className="name-field-box1 auth-input-field">
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
                    <div className="name-field-box2 auth-input-field">
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
                    {!isSocialAuth && onSignUpForm && error &&
                        <EmailFieldErrors {...error}/>
                    }
                    
                    {!isSocialAuth && error &&
                      <NonFieldErrors {...error}/>
                    }    

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

               <div className="password-fields signup-fields">
                  <div className="password-box auth-input-field">
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

            <div className="registration-btns-box">
                <div className="submit-btn-box">
                    <RegistrationSubmitBtn {...props}/>
                </div>
                <div className="cancel-signup-btn-box">
                  <CancelSignupFormBtn {...props}/> 
                </div>    
            </div>  
            <div className="country-select-box">
                { error &&
                  <CountryFieldErrors {...error}/>
                }
                <div className="country-select-btn">
                    <CountryDropdown
                        value={form.country}
                        labelType="full"
                        valueType="short"
                        priorityOptions={["ZA"]}
                        onChange={(val) => props.selectCountry(val)}
                        style={{
                            backgroundColor: '#D5D7D5',
                            color: 'black',
                            fontSize: 14,
                            width: '200px',
                            height:'30px',
                            border:'none',
                        }}
                                 
                    />
                </div>
            </div>
            <LoginLink/>

            </fieldset>

            {!isSocialAuth && onSignUpForm &&
                <SpinLoader {...props}/> 
            }
        </form>
          
      </div>

      :
      ""
    }
    </div>
          
   )
};


export default SignUpForm;



const _LoginLink = ()=>{
    return(
        <ul className="signup-login-link-box">
            <li>
               Already have account ?
               <Link className="signup-login-link" to="/user/login/"> Login</Link>
            </li>
        </ul>
         
    )

};

export const LoginLink = MatchMediaHOC(_LoginLink , '(max-width: 980px)');


