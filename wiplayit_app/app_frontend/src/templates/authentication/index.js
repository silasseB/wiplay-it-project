import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {history} from "App";
import  LoginForm from "templates/authentication/login";
import  SignUpForm  from "templates/authentication/signup";
import  EmailForm  from "templates/authentication/email-form";

import { SpinLoader,
         AuthenticatedComponent } from  'templates/authentication/utils'


const RegistrationComponent = (props)=>{
    let {isAuthenticated, navbarTitle} = props;
    navbarTitle = isAuthenticated && "You're logged in"  || navbarTitle;

    let _props = {...props, navbarTitle}

    return(
        <div className="registration-page">
           <NavBar {..._props}/>
            <div className="registration-container">
                { isAuthenticated &&
                    <AuthenticatedComponent {..._props}/>
                        ||
                    <MainRegistrationComponent {..._props}/>  
                }
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
        <WelcomeTextComponent {...props}/>
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
   let {onPasswordResetForm, onSignUpForm} = props
   console.log(props)
   
    return(
        <div className="registration-box">
            <WelcomeTextComponent {...props}/>
            <SocialLogin {...props}/>
            <p className="or-option">Or</p>
            <div className="registration-flex-box ">
                { onPasswordResetForm?
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
                    { onSignUpForm?
                        <SignUpForm {...props}/>
                        :
                        <div className="second-box-contents signup-container-contents" 
                             style={props.createUserBtnStyles} >
                            <div className="create-account-box"> 
                                <button type="button" 
                                        onClick={() => props.toggleSignUpForm(toggleProps) } 
                                        id="create-account" 
                                        className="btn-sm create-account-btn">
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
               to wiplayit <Link className="" to="/privacy/">Terms and Conditions </Link>
                and <Link className="" to="/privacy/"> Privacy</Link>
            </p>
              
       </div>
   )
}

const WelcomeTextComponent = props => {
    return(
        <ul className="registration-welcome-box">
            <h1 className="welcome-message">
              Welcome to Wiplayit, a  place for football lovers,
              Join in and share your opinion with other fellow football lovers. 
              <Link className="" to="/about/"> More.</Link> 
           </h1>
         </ul>

        )
}



 const SocialLogin = props =>  {
  let {isSocialAuth} = props

 return(
        <div className="social-login-container">
            {isSocialAuth && 
                <SpinLoader {...props}/>
            }
    
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
            appId = "2482459181845798"
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
    </div>
  ); 

 }



export const  NavBar   = props => {
   
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


export const RegistrationSmallScreen = MatchMediaHOC(RegistrationSmall, '(max-width: 980px)')
export const RegistrationBigScreen   = MatchMediaHOC(RegistrationBig, '(min-width: 980px)')
