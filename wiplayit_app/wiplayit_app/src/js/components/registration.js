import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from "../components/ajax-loader";




export const  LoginFormComponent = props => {
    console.log(props)
    let { submitting, onSignUpForm, formIsValid, formName, error, form, validateForm} = props;

    form = form && form.loginForm? 
                           form.loginForm:null;

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
             
              <fieldset style={ fieldSetStyles}
                        disabled={ submitting || onSignUpForm }
                        className="fieldset-login">
                    {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }        
                               
               <div className="login-box">
                    {error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
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
                      autoFocus 
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
                      autoFocus
                      required
                      
                    />

                  </div>
    
                  <div className="registration-btn-box">  
                     <button type="submit" className="btn-sm  btn-submit"
                             style={ submitButtonStyles }
                             disabled={ submitting || onSignUpForm || !formIsValid} >

                       Submit

                     </button>
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



export default LoginFormComponent;







export const  SignUpFormComponent = props => {
    console.log(props)

    let { submitting, form, onSignUpForm, formName, formIsValid,error, validateForm } = props;

    form = form && form.signUpForm? 
                           form.signUpForm:null;
    
    formIsValid = onSignUpForm? validateForm(form, formName):false;
    let submitButtonStyles = submitting || !formIsValid?{opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting ? {opacity:'0.60'}:{}; 

    
    return(
        <div>
          { form?
          <div>
          <p className="signup-form-title">Sign Up</p>

          <form onSubmit={props.onSubmit} className="sign-up-form">
                {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
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
                        autoFocus 
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
                        autoFocus 
                        required
                      />
                      
                    </div>

                  </div>
               </div>

               <div  className="email-fields signup-fields">
                    {error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
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
                      autoFocus 
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
                        autoFocus 
                        required
                      />

                  </div>
               </div>
            </div>
            <button type="submit" className="btn-submit btn-sm"
                       style={submitButtonStyles} 
                       disabled={submitting || !formIsValid}>
                  Submit
              </button>
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






export const PassWordChangeForm = props => {
    let { submitting, form, formName,
          onSignUpForm,onPasswordChangeForm, error,
           formIsValid , validateForm, successMessage } = props;

    let disabledStyle = submitting || onSignUpForm? 
                                  {opacity:'0.60'}:
                                  {};
    
    form = form && form.passwordChangeForm? 
                           form.passwordChangeForm:null;

    formIsValid = onPasswordChangeForm? validateForm(form, formName):false;

    console.log(form, props)

    let submitButtonStyles = submitting || onSignUpForm || !formIsValid?
                                                     {opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting || onSignUpForm ? {opacity:'0.60'}:{};
    
    return(
    <div>
        {form?

        <div className="">
         <p className="password-change-form-title">Password Change</p>

           { successMessage?
               <div className="password-change-success-box">
                  <p className="password-change-success message-success">{ successMessage}</p>
                  <p>Chick bellow to login with your password</p>
                  
                   <LoginSmallScreem/>
                   <LoginBigScreem/>
                 
               </div>

            :

            <form className="password-change-form" onSubmit={props.onSubmit} >

               { props.formDescription.map(( description, index) =>
                  <li key={index} className="password-form-description">{description}</li>
               )}

               <fieldset style={ fieldSetStyles}
                disabled={ submitting || onSignUpForm}>
                   {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }        

                  <div  className="" >
                     <div className="change-password-box">
                        <input
                           className="password"
                           placeholder="New Password"
                           type="password"
                           name="new_password1"
                           value={form.new_password1}
                           onChange={props.handleFormChange}
                           autoFocus 
                           required
                        />
                     </div>

                     <div className="change-password-box">

                        <input
                           className="password"
                           placeholder="Repeat New Password"
                           type="password"
                           name="new_password2"
                           value={form.new_password2}
                           onChange={props.handleFormChange}
                           autoFocus 
                           required
                        />
                     </div>

                     <div className="submit-box">  
                        <button type="submit" 
                                style={ submitButtonStyles }
                                disabled={ submitting || onSignUpForm || !formIsValid} 
                                className="btn-sm  btn-submit" >

                              Submit
                        </button>
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




export const EmailFormComponent = props => {
    console.log(props)

    let { submitting ,onSignUpForm,
          onPasswordResetForm, successMessage,
          onEmailResendForm, form,error,
          formIsValid, formName, validateForm } = props;

    form = form && form[formName]? 
                           form[formName]:null;

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
                    {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
                                )}
                            </div>
                            :
                            ""
                    }         
                <fieldset style={ fieldSetStyles} 
                      disabled={ submitting || onSignUpForm} >

                    <div  className="email-fields">
                       {error && error.email && error.email.length?
                            <div>
                                { error.email.map(( error, index) =>
                                   <li key={index} className="email-error">{error}</li>
                                )}
                            </div>
                            :
                            ""
                        }

                        <p></p>
                        <div className="email-box">
                            <input
                               placeholder="Email"
                               className="email"
                               type="email"
                               name="email"
                               value={form.email}
                               onChange={props.handleFormChange}
                               autoFocus 
                               required
                       
                            />

                        </div>
                    </div>

                    <div className="registration-btn-box">
                        <button type="submit" 
                            style={submitButtonStyles} 
                            disabled={submitting || onSignUpForm || !formIsValid }
                            className="btn-submit btn-sm">
                            Submit
                        </button>
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







export const RegistrationComponent = props => {
  
   return(
  
       <React.Fragment>
        <RegistrationBigScreen {...props}/>
        <RegistrationSmallScreen {...props}/>
       </React.Fragment> 
  );
}


const RegistrationSmall = props => (
    <React.Fragment>

        <div className="registration-welcome-box">
            <h1 className="welcome-message">
              Welcome to latiro, a  place for football lovers,
              Join in and share your opinion with other fellow football fans 
           </h1>
         </div>

       <SocialLogin {...props}/>

      <p className="or-option">Or</p>
      <div className="sign-or-login">
         <div className="registration-link-box">
           <Link className="login-user-link" to="/user/login/">Login </Link>  
           <Link className="create-account-link" to="/user/signup/">Create Account </Link>    
         </div> 

        <TermsAndContionTextComponent/>
      </div>
    </React.Fragment>
);




const RegistrationBig = props => {
   let toggleProps = {value : true,};
   console.log(props)
   
   return(
      <div className="registration-box">
         <div className="registration-welcome-box">
            <h1 className="welcome-message">
              Welcome to latiro, a  place for football lovers,
              Join in and share your opinion with other fellow football fans 
           </h1>
      </div>

      <SocialLogin {...props}/>

      <p className="or-option">Or</p>
      <div className="registration-flex-box ">
        {props.onPasswordResetForm?
          <div className="password-reset-container">
            <EmailFormComponent {...props}/> 
          </div>
          :
          <div className="login-container" >
            <LoginFormComponent {...props}/>
         </div>
                      
        }

         <p className="separator"></p>
            <div className="signup-container">
               { props.onSignUpForm?
                  <SignUpFormComponent {...props}/>
               :
               <div className="second-box-contents signup-container-contents" 
                          style={props.createUserBtnStyles} >
                   <div className="create-account-box"> 
                    <button type="button" onClick={() => props.toggleSignUpForm(toggleProps) } 
                     id="create-account"  className="btn-sm create-account-btn">
                      Create account 
                    </button>

                  </div>

                  <TermsAndContionTextComponent/>

               </div>
             }
                                 

           </div>
        </div>
     </div> 
  )

}


const TermsAndContionTextComponent = props => {
   return(
      <div className="terms-and-policy-box">
            <p className="terms-and-policy">
               By signing up you indicate that you read and agree 
               to Lotiros <Link className="" to="/latiro/terms/conditions/">Terms and conditions</Link>
                and <Link className="" to="/latiro/privace/policy/">Privace policy</Link>
            </p>
              
       </div>
   )
}


export const AccountConfirmationComponent = props => {
  console.log(props)
  return(
   
   <div  className="accont-confirmation-container" >
      <p className="confirmation-title">
           {props.pageTitle}
      </p>

      <div className="confirmation-message-box">
         <p className="confirmation-message message-success">
            {props.successMessage}. You can click bellow to login
         </p> 

         <LoginSmallScreem/>
         <LoginBigScreem/>
      </div>
    
   </div>
   
  )
}


const LoginSmall = props => {
   return (
      <Link type="button" to="/user/login">Login</Link>
   )
}


const LoginBig = props => {
   return (
      <Link  type="button" to="/user/registration">Login</Link>
   )
}

const LoginSmallScreem   = MatchMediaHOC(LoginSmall, '(max-width: 500px)')
const LoginBigScreem   = MatchMediaHOC(LoginBig, '(min-width: 900px)')



 const SocialLogin = props =>  {
  

 return(
  <React.Fragment>
    
      <div className="social-login">
        <div className="google-login-box">
           <GoogleLogin
               clientId = "499495811255-0v3hjt4lena190or9euvdla2qi5f8qrk.apps.googleusercontent.com"
               fields="first_name,last_name,email,picture"
               onSuccess={props.responseGoogle}
               onFailure={props.responseGoogle}
               render={renderProps => (

                  <button  className='btn-openid google-login'
                    onClick={renderProps.onClick} 
                         disabled={renderProps.disabled}>
                         <span className="google-login-icon fa fa-google"></span>   
                        Login with Google 
                 </button>
               )}
         
            />
        </div>

           
   
        <div className="facebook-login-box">
          <FacebookLogin
            appId = "2363163133805760"
            callback={props.responseFacebook}
            render={renderProps => (
                <button className='facebook-login' onClick={renderProps.onClick}>
                <span className="facebook-login-icon fa fa-facebook"></span> 
                  Login with Facebook
                </button>
            )} 
          />

        </div>
      </div>
    </React.Fragment>
  ); 

 }



export const  NavBar   = props => {
    
    return (
        <div className="navigation-bar fixed-top">

            <div className="navbar-box1">
               
            </div>

            <div className="navbar-box2 navbar-title-box">
                <p className="" >{props.navbarTitle}</p>
            </div>
              
            <div className="navbar-box3">
               {props.nabarLink}
               
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
   <Link className="password-change" to="/user/account/password/reset/"> 
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

const  CancelPasswordResetBtn  = props => {
    let toggleProps = {value:false, formName:props.formName};

    return (
        <button type="button" onClick={()=>props.toggleEmailForm(toggleProps)} 
            className="form-cancel-btn btn-sm " >
            Cancel
        </button>
    );
};

const RegistrationSpinLoader = MatchMediaHOC(SpinLoader , '(min-width: 900px)');


const CancelFormBtn   = MatchMediaHOC(CancelBtn , '(min-width: 800px)');
const CancelEmailForm = MatchMediaHOC(CancelPasswordResetBtn , '(min-width: 900px)');

const PasswordChangeSmall = MatchMediaHOC(PasswordChangeLink , '(max-width: 500px)');
const PasswordChangeBig   = MatchMediaHOC(PasswordChangeButton , '(min-width: 800px)');

const RegistrationSmallScreen = MatchMediaHOC(RegistrationSmall, '(max-width: 500px)')
const RegistrationBigScreen   = MatchMediaHOC(RegistrationBig, '(min-width: 900px)')
