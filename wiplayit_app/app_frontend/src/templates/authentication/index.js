import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import  AjaxLoader from "templates/ajax-loader";
import {history} from "App";
import  LoginForm   from 'templates/authentication/login'; 
import  SignUpForm  from 'templates/authentication/signup'; 
import  EmailForm  from 'templates/authentication/email-form'; 



 const RegistrationComponent = (props)=>{

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


export default RegistrationComponent;


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
            <EmailForm {...props}/> 
          </div>
          :
          <div className="login-container" >
            <LoginForm {...props}/>
         </div>
                      
        }

         <p className="separator"></p>
            <div className="signup-container">
               { props.onSignUpForm?
                  <SignUpForm {...props}/>
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

