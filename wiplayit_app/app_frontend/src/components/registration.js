import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from "components/ajax-loader";
import {history} from "App";




export const  LoginFormComponent = props => {
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



export default LoginFormComponent;







export const  SignUpFormComponent = props => {
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






export const PassWordChangeForm = props => {
    let { submitting, form, formName,
          onSignUpForm,onPasswordChangeForm,
           formIsValid , validateForm, successMessage } = props;

    let disabledStyle = submitting || onSignUpForm? 
                                  {opacity:'0.60'}:
                                  {};
    
    form = form && form.passwordChangeForm? 
                           form.passwordChangeForm:null;
    let error = form && form.error; 

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
                <NavBarSmallScreen {...props}/>

                <li className="password-form-description">{props.Description}</li>
               

               <fieldset style={ fieldSetStyles}
                disabled={ submitting || onSignUpForm}>
                   {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
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
                           required
                        />
                     </div>

                     <div className="submit-box">  
                        <SubmitBtnBigScreen {...props}/>
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
                    {error && error.non_field_errors && error.non_field_errors.length?
                            <div>
                                { error.non_field_errors.map(( error, index) =>
                                   <li key={index} className="form-errors">{error}</li>
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


export const RegistrationComponent = (props)=>{

    return(
        <div> 
            <div>
                <NavBar {...props}/>
            </div>

            <div className="registration-page">
                      
                <div className="registration-container">
                    <MainRegistrationComponent {...props}/>         

                </div>
            
            </div>

        </div>
    );
}





export const MainRegistrationComponent = props => {
  
   return(
  
       <React.Fragment>
        <RegistrationBigScreen {...props}/>
        <RegistrationSmallScreen {...props}/>
       </React.Fragment> 
  );
}


const RegistrationSmall = props => (
    <div className="">

        <div className="registration-welcome-box">
            <h1 className="welcome-message">
              Welcome to Wiplayit, a  place for football lovers,
              Join in and share your opinion with other fellow football lovers 
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
    </div>
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
               to Lotiros <Link className="" to="/privacy/">Terms and conditions</Link>
                and <Link className="" to="/privacy/">Privace policy</Link>
            </p>
              
       </div>
   )
}


export const AccountConfirmationComponent = props => {
  console.log(props)
  let message = 'Your account has been successefully confirmed.'
  let error   = "Something wrong happened, please try again"
  let {successMessage, isConfirmed, errorMessage} = props;
  
  return(
   
    <div  className="account-confirmation-container" >
        <div className="confirmation-title-box">
            <p className="confirmation-title">
                {props.pageTitle}
            </p>
        </div>
       
        { props.onEmailResendForm &&
            <div className="confirmation-resend-container">
                <EmailFormComponent {...props}/> 
            </div>

            ||

            <div className="confirmation-message-box">
                { isConfirmed &&
                    <div>
                        <div className="confirmation-success-box">
                            <p className="confirmation-message message-success">
                                {successMessage || message}  You can login now and start posting
                            </p> 
                        </div>

                        <div className="confirmation-login-box">
                            <LoginSmallScreem/>
                            <LoginBigScreem/>
                        </div>
                    </div>

                    ||

                    <div>
                        <div className="confirmation-error-box">
                            <p className="confirmation-message message-success">
                                {errorMessage || error}
                            </p>
                        </div>

                        <div className="resend-confirmation-btn-box">
                            <ConfirmationResendSmall {...props}/>
                            <ConfirmationResendBig {...props}/>
                        </div>
                    </div>
                }
            </div>
        }
      
    </div>
   
  )
}


const LoginSmall = props => {
   return (
      <Link type="button" to="/user/login/">Login</Link>
   )
}


const LoginBig = props => {
   return (
      <Link  type="button" to="/user/registration/">Login</Link>
   )
}

const LoginSmallScreem   = MatchMediaHOC(LoginSmall, '(max-width: 980px)')
const LoginBigScreem   = MatchMediaHOC(LoginBig, '(min-width: 980px)')



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
                className="btn-submit btn-sm">
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

export const RegistrationSmallScreen = MatchMediaHOC(RegistrationSmall, '(max-width: 980px)')
export const RegistrationBigScreen   = MatchMediaHOC(RegistrationBig, '(min-width: 980px)')
