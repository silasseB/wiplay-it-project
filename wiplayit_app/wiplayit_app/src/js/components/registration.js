import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { Field, reduxForm } from 'redux-form'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from "../components/ajax-loader";




const  LoginFormComponent = props => {
   console.log(props)
   let disabledStyle = props.submitting || props.isOnSignUpForm?
                                  {opacity:'0.60'}:
                                  {};
    
   return(

      <div>
            <p className="login-form-title label">Login</p>

            <form onSubmit={props.handleSubmit} className="login-form">
             
              <fieldset style={disabledStyle}
                        disabled={props.isOnSignUpForm    || props.submitting }
                        className="fieldset-login">
                               
               <div className="login-box">
                  <div className="login-fields">
                    <Field
                      className="login-email-field"
                      placeholder="Email Address"
                      type="email"
                      name="email"
                      component="input"
                    />
                    
                  </div>
                  <div className="login-fields">
                    <Field
                      className="login-password-field"
                      placeholder="Password"
                      type="password"
                      name="password"
                      component="input"
                    />

                  </div>
    
                  <div className="registration-btn-box">  
                     <button type="submit" className="btn-sm  btn-submit"
                             style={disabledStyle}
                             disabled={props.submitting || props.isOnSignUpForm} >

                       Submit

                     </button>
                    <PasswordChangeSmall {...props}/>
                    <PasswordChangeBig {...props}/>
                  </div>
                </div>
   
             </fieldset>
          </form>

          <RegistrationSpinLoader {...props}/> 
      </div>
      )
    }

const ReduxLoginForm = reduxForm({form : 'login',updateUnregisteredFields:true})(LoginFormComponent)


export default ReduxLoginForm;







export const  SignUpFormComponent = props => {
   console.log(props)

   let disabledStyle = props.submitting ?
                                  {opacity:'0.60'}:
                                  {}; 
   
   
     return(
        <div>
          <p className="signup-form-title">Sign Up</p>

          <form onSubmit={props.handleSubmit} className="sign-up-form">

            <fieldset  disabled={props.submitting} 
                       style={disabledStyle}
                       className="fieldset-signup" >

              <div className="sign-up-box">
            
                <div className="name-fields">
                            
                  <div className="username-fields">
                    <div className="name-field-box1">
                      <Field
                        placeholder="First Name"
                        className="first-name-input"
                        type="text"
                        name="first_name"
                        component="input"
                      />

                    </div>  
                    <div className="name-field-box2">
                      <Field
                        placeholder="Last Name"
                        className="last-name-input"
                        type="text"
                        name="last_name"
                        component="input"
                      />
                      
                    </div>

                  </div>
               </div>

               <div  className="email-fields signup-fields">
                  <div className="email-box">
                    <Field
                      placeholder="Email"
                      className="email"
                      type="email"
                      name="email"
                      component="input"
                    />

                  </div>
               </div>

               <div className="password-fields signup-fields">
                  <div className="password-box">
                      <Field
                        placeholder="Password"
                        className="password"
                        type="password"
                        name="password"
                        component="input"
                      />

                  </div>
               </div>
            </div>
            <button type="submit" className="btn-submit btn-sm"
                       style={disabledStyle} 
                       disabled={props.submitting}>
                  Submit
              </button>
              <CancelFormBtn {...props}/>          
            </fieldset>
          </form>

         <RegistrationSpinLoader {...props}/> 
      </div>
          
   )
}



export const ReduxSignUpForm = reduxForm({form: 'signUp',updateUnregisteredFields:true})(SignUpFormComponent)



export const PassWordChangeForm = props => {
   let disabledStyle = props.submitting?
                                  {opacity:'0.60'}:
                                  {};
   return(

      <div className="">
         <p className="password-change-form-title">Password Change</p>

           { props.successMassage !== ''?
               <div className="password-change-success-box">
                  <p className="password-change-success message-success">{props.successMassage}</p>
                  
                   <LoginSmallScreem/>
                   <LoginBigScreem/>
                 
               </div>

            :

            <form className="password-change-form" onSubmit={props.handleSubmit} >

               { props.formDescription.map(( description, index) =>
                  <li key={index} className="password-form-description">{description}</li>
               )}

               <fieldset style={disabledStyle}
                disabled={props.submitting}>

                  <div  className="" >
                     <div className="change-password-box">
                        <Field
                           className="password"
                           placeholder="New Password"
                           type="password"
                           name="password1"
                           component="input"
                        />
                     </div>

                     <div className="change-password-box">

                        <Field
                           className="password"
                           placeholder="Repeat New Password"
                           type="password"
                           name="password2"
                           component="input"
                        />
                     </div>

                     <div className="submit-box">  
                        <button type="submit" 
                                style={disabledStyle}
                                disabled={props.submitting} 
                                className="btn-sm  btn-submit" >

                              Submit
                        </button>
                     </div>
      
                  </div>
               </fieldset>
            </form>
         }

         <RegistrationSpinLoader {...props}/> 
      </div>
  )
}

export const ReduxPassWordChangeForm = reduxForm({form: 'passwordChange',})(PassWordChangeForm)


export const EmailForm = props => {
  let disabledStyle = props.submitting || props.isOnSignUpForm?
                                  {opacity:'0.60'}:
                                  {};
   
   return(
      <div className="email-form-box">
        <p className="password-reset-form-title">
          
        </p>

         { props.successMassage?
            <div className="success-message-box">
               <p className="message-success">
                 
               </p>

               <div className="resend-email-box ">
                  <button type="button" className="resend-email-btn" >Resend</button>
                  <CancelEmailForm {...props}/>
               </div>
            </div>
         :

         <form className="email-form" onSubmit={props.handleSubmit}>
          
            <fieldset style={disabledStyle} 
                      disabled={props.submitting || props.isOnSignUpForm} >

               <div  className="email-fields">
                  <div className="email-box">
                     <Field
                        placeholder="Email"
                        className="email"
                        type="email"
                        name="email"
                        component="input"
                       
                     />

                  </div>
               </div>

               <div className="registration-btn-box">
                  <button type="submit" 
                       style={disabledStyle} 
                       disabled={props.submitting || props.isOnSignUpForm}
                       className="btn-submit btn-sm">

                        Submit
                  </button>
                  <CancelEmailForm {...props}/>
                  
               </div>

               

            </fieldset>    

         </form>

         }

         <RegistrationSpinLoader {...props}/>  
      </div>

   )
}


export const ReduxEmailForm = reduxForm({form: 'emailForm',})(EmailForm)




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
        {props.isOnPasswordResetForm?
          <div className="password-reset-container">
            <ReduxEmailForm {...props}/> 
          </div>
          :
          <div className="login-container" >
            <ReduxLoginForm {...props}/>
         </div>
                      
        }

         <p className="separator"></p>
            <div className="signup-container">
               { props.isOnSignUpForm?
                  <ReduxSignUpForm {...props}/>
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
          )

  
}



export const  SpinLoader  = props => {
   return (
      <div className="registration-spin-loader-box">
         { props.submitting?
         <AjaxLoader/> 
        :
        "" 
     }
   </div>
   )
}

const  PasswordChangeButton  = props => {

    let toggleProps = {value:true, style:{display:'none'}};
   return(
      <button type="button" onClick={()=> props.togglePasswordResetForm(toggleProps)} 
                  className="password-change-btn" >
         Forgot Password ?
      </button>
   );
}

const  PasswordChangeLink  = props => (
   <Link className="password-change" to="/user/account/password/reset/"> 
   Forgot Password ?
   </Link>
);


const  CancelBtn  = props => {
   let toggleProps = {
         value : false, 
         onSignupLoginFormStyles : {opacity:'2.60'},
         createUserBtnStyles     : {display:'block'}
      };

   return(
      <button type="button" onClick={()=>props.toggleSignUpForm(toggleProps)} 
                  className="form-cancel-btn btn-sm " >
         Cancel
      </button>
   )
};

const  CancelPasswordResetBtn  = props => {
   let toggleProps = {value:false, style:{display:'block'} }
   return (
      <button type="button" onClick={()=>props.togglePasswordResetForm(toggleProps)} 
                  className="form-cancel-btn btn-sm " >
         Cancel
      </button>
   );
}

const RegistrationSpinLoader = MatchMediaHOC(SpinLoader , '(min-width: 800px)');

const CancelFormBtn   = MatchMediaHOC(CancelBtn , '(min-width: 800px)');
const CancelEmailForm = MatchMediaHOC(CancelPasswordResetBtn , '(min-width: 800px)');

const PasswordChangeSmall = MatchMediaHOC(PasswordChangeLink , '(max-width: 500px)');
const PasswordChangeBig   = MatchMediaHOC(PasswordChangeButton , '(min-width: 800px)');

const RegistrationSmallScreen = MatchMediaHOC(RegistrationSmall, '(max-width: 500px)')
const RegistrationBigScreen   = MatchMediaHOC(RegistrationBig, '(min-width: 900px)')
