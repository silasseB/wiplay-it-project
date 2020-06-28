import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import Axios from 'utils/axios_instance';
import Api from 'utils/api';
import Helper from 'utils/helpers';
import {getFormFields,
        authSubmit,
        getAuthUrl,
        formIsValid,
        changeForm,
        setForm,} from 'components/authentication/utils';

import {authenticate, _GetApi} from 'dispatch/index';
import { getCookie } from 'utils/csrf_token.js';
import * as checkType from 'helpers/check-types'; 
import { AlertComponent } from 'templates/partial-components';
import{history} from 'App';


const helper   = new Helper();
const api = new Api();

export function AuthenticationHoc(Component) {

    return class Authentication extends React.Component {
        isMounted = false;
        constructor(props) {
            super(props);
            this.state = {
                displayMessage       : false,
                message              : null,
                isMounted            : false,
                isSocialAuth         : false,
                isAuthenticated      : false,
                isConfirmation       : false,
                defaultActiveForm    : null,
                form                 : null,
                formName             : null, 
                onLoginForm          : false,
                submitting           : false,
                onSignUpForm         : false,
                onPasswordResetForm  : false,
                onPasswordChangeForm : false, 
                formIsValid          : false,
                formErrors           : null,
                successMessage       : null,
                cacheEntities        : JSON.parse(localStorage.getItem('@@CacheEntities')),
            
            };

            //React binding
            this.formConstructor          = this.formConstructor.bind(this);  
            this.onSubmit                 = this.onSubmit.bind(this);
            this.handleFormChange         = this.handleFormChange.bind(this); 
            this.selectCountry            = this.selectCountry.bind(this);
            this.responseFacebook         = this.responseFacebook.bind(this);
            this.responseTwitter          = this.responseTwitter.bind(this);
            this.responseGoogle           = this.responseGoogle.bind(this);  
            this.toggleSignUpForm         = this.toggleSignUpForm.bind(this);
            this.toggleEmailForm          = this.toggleEmailForm.bind(this);  
            this._Redirect                = this._Redirect.bind(this); 
        };


        isAuthenticated =()=> {
            let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));
            if (cacheEntities){

                let {userAuth}  = cacheEntities;
                if (userAuth){

                    let {auth} = userAuth;
                    if (auth && auth.isLoggedIn){
                        return true
                    }
                }
            }

            return false;
        };
       

        responseFacebook =(response)=> {
            console.log(response)
            let apiUrl =  api.facebookLoginApi();
            let accessToken =  response.accessToken
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)

            return ;
        };


        responseTwitter =(response)=> {
            let accessToken =  response.accessToken
            let apiUrl =  api.twitterLoginApi(this)
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
            
            return ;
        };


        responseGoogle =(response)=> {
            let accessToken =  response.accessToken
            let apiUrl =  api.googleLoginApi();
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
            return ;
        };

        _SendSocialAuthentication =(accessToken, apiUrl)=>{
            let isSocialAuth = true
            let form   = helper.createFormData({"access_token": accessToken});
            this.setState({isSocialAuth, submitting:true})
            return this.props.authenticate({ apiUrl, form, isSocialAuth });

        };

        componentWillUnmount =()=> {
            this.isMounted = false;
            this.unsubscribe();
        };


        componentDidUpdate =(nextProps , prevState)=>{
           
        };

        componentDidMount =()=> {
            this.isMounted = true;
            this.onAuthStoreUpdate()
            this.setState({isMounted:true})

            if (this.isAuthenticated()) {
                //this.setState({isAuthenticated:true});
            }

            window.onpopstate = (event) => {
                console.log("Poping action" ,this.props)
                
            }  
        };

        onAuthStoreUpdate =()=> {
            if (!this.isMounted) return;

            const onStoreChange = () => {
                let  storeUpdate = store.getState(); 
                let {entities} =  storeUpdate;
                let {userAuth, errors} = entities;
                let {form, formName} = this.state;
                let {loginAuth, isLoading} = userAuth;
                this.setState({submitting : isLoading}); 
             
                if (errors && errors.error) {
                    this._HandleErrors(errors);
                }

                if (form && userAuth.error) {
                    form[formName]['error'] = userAuth.error;
                    this.setState({form})
                    delete userAuth.error
                }

                this.handleLogin(userAuth)
                this.handlePasswordReset(userAuth);
            };

            this.unsubscribe = store.subscribe(onStoreChange);
        };
        
        handlePasswordReset =(userAuth)=>{
            if (!userAuth.passwordRestAuth) return;

            let {passwordRestAuth} = userAuth;
            if (!passwordRestAuth.successMessage) return;

            let {successMessage} = passwordRestAuth;
            let {isPhoneNumber,
                 formName,
                 onPasswordResetSmsCodeForm} = this.state;

            this.displaySuccessMessage(passwordRestAuth)
            this.setState({passwordRestAuth})

            if (isPhoneNumber && formName == 'passwordResetForm') {
                if (!onPasswordResetSmsCodeForm) {
                   return history.push('/password/change/', {passwordRestAuth});
                }else{
                    let toggleProps = {
                            value:false,
                            defaultFormName:'passwordResetSmsCodeForm',
                    };
                    
                    return this.toggleEmailForm(toggleProps)
                }
            }
            
            this.setState({successMessage})
        };

        handleLogin(userAuth){
            if (!userAuth.loginAuth)return;
            
            let loginAuth = userAuth.loginAuth
            let {isLoggedIn, isConfirmation} = loginAuth;
            this.setState({isConfirmation});
                                                
            if(isLoggedIn && !isConfirmation){
                this._Redirect();
            }
        };

        _Redirect =()=> {
            let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));

            if (cacheEntities){

               let { userAuth  }  = cacheEntities;
                
                if ( userAuth){
                    let { loginAuth } = userAuth;
                    if (loginAuth && loginAuth.isLoggedIn){
                        setTimeout(()=> {
                            this.props.history.push('/'); 
                        }, 500);
                    }
                    
                }
            }
        };

        _HandleErrors(errors){
            if (!errors) return;
            if (!errors.error) return;
            let message = {
                textMessage : errors.error,
                messageType : 'error'
            }

            this.displayAlertMessage(message);
            delete errors.error;
        }

        displaySuccessMessage =(params)=>{
            let message = {
                textMessage : params.successMessage,
                messageType : 'success'
            }

            this.displayAlertMessage(message);
            delete params.successMessage;
        };

        displayAlertMessage = (message) => {
            if (!this.isMounted) return;

            this.setState({displayMessage : true, message});
            setTimeout(()=> {
                this.setState({displayMessage : false}); 
            }, 10000);
        };


        handleFormChange=(e)=>{
            if (!this.isMounted) return;

            e.preventDefault()
            changeForm(this, event);
        };

        selectCountry =(val)=> {
            if (!this.isMounted) return;

            let {formName, form} = this.state;
            form[formName]['country'] = val
            this.setState({form });
        }


        _SetForm =(form, formName)=> {
            if (!this.isMounted) return;

            let currentForm = this.state.form;
            form = setForm(form, currentForm, formName);
            this.setState({form, formName, successMessage:false});
            this.setFormOpts(formName);
            
        };

        setFormOpts(formName){
            if (formName) {
                switch(formName){

                    case 'loginForm':
                        return this.setState({ onLoginForm : true})
                  
                    case 'signUpForm':
                        return this.setState({onSignUpForm : true})

                    case 'passwordResetForm':
                        return this.setState({onPasswordResetForm : true});

                    case 'emailResendForm':
                        return this.setState({ onEmailResendForm : true });
                        
                    case 'passwordResetSmsCodeForm':
                        return this.setState({onPasswordResetSmsCodeForm:true});
                        
                    case 'passwordChangeConfirmForm':
                        return this.setState({onPasswordChangeConfirmForm : true});
                        
                    default:
                        return null;
                };

            }

        };

        hideToggledForm =()=>{
            let {onPasswordResetForm,
                 onEmailResendForm,
                 onSignUpForm} = this.state;

            onPasswordResetForm && this.setState({onPasswordResetForm : false})
            onEmailResendForm   && this.setState({onEmailResendForm : false})

        };

    
        formConstructor =(name, opts={})=> {
            if (!this.isMounted) return;
            
            if (name) {
                let formName = name;
                let currentForm = this.state.form
                if (currentForm) {
                    //return
                }

                let defaultActiveForm = formName;
                let form = null;

                switch(formName){

                    case 'loginForm':
                        form = getFormFields().loginForm;
                        return this._SetForm(form, formName)

                    case 'signUpForm':

                        form = getFormFields().signUpForm;
                        return this._SetForm(form, formName);

                    case 'passwordResetForm':
                        form = getFormFields().emailForm;
                        return this._SetForm(form, formName); 

                    case 'emailResendForm':
                        form = getFormFields().emailForm;
                        return this._SetForm(form, formName);

                    case 'passwordResetSmsCodeForm':
                        form = getFormFields().smsCodeForm;
                        return this._SetForm(form, formName)

                    case 'passwordChangeConfirmForm':
                        form = getFormFields().passwordChangeForm;
                        form = Object.assign(opts, form);
                        return this._SetForm(form, formName);

                    default:
                        return null;
                };

            }
        };

        getCurrentDefaultForm=()=>{
           return this.state.defaultActiveForm;
        }


        
        toggleSignUpForm =(params)=>{
            //if(!this.isMounted) return;

            const currentFormName = this.getCurrentDefaultForm();
            let signUpFormName = "signUpForm";
            let { value } = params;

            if (!value) {
                this.setState({onSignUpForm : false})
                this.formConstructor(currentFormName) 
            }

            if ( value) {
                this.formConstructor(signUpFormName)
            }
            


        };

        toggleEmailForm = (params) => {
            let {value,
                 successMessage,
                 defaultFormName,
                 formName } = params;

            if (value) {
                this.formConstructor(formName)

            }else{
                this.hideToggledForm();
                this.formConstructor(defaultFormName)
            }
        };
    

        onSubmit =(e)=> {
            e.preventDefault();
            authSubmit(this);
        };
          
        getProps =()=> {
            return {
                ...this.props,
                ...this.state,
                selectCountry    : this.selectCountry,
                onSubmit         : this.onSubmit,
                formConstructor  : this.formConstructor,
                handleFormChange : this.handleFormChange,
                responseFacebook : this.responseFacebook,
                responseGoogle   : this.responseGoogle,
                responseTwitter  : this.responseTwitter,
                toggleEmailForm  : this.toggleEmailForm, 
                toggleSignUpForm : this.toggleSignUpForm,
                validateForm     : formIsValid, 
                alertBoxStyles   : alertBoxStyles(),
            };
        };
    

        render=()=> {
            if (!this.isMounted) return null;
            let props = this.getProps(); 
            let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                          { display : 'none' };
           
            return (
               <div>
                    <div>
                     <Component {...props}/>
                   </div>  
                   <div style={alertMessageStyles}>
                       <AlertComponent {...props}/>
                    </div>
                </div>
            );
        };
    };
};

let alertBoxStyles =()=>{
    if (window.matchMedia("(min-width: 900px)").matches) {
        return{
            width  : '60%',
            margin : '0 20%' 
        };
    }
};

//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
     
    return {
        authenticate        : (props)=> dispatch(authenticate(props)),
    }
};




const mapStateToProps = (state, ownProps) => {
   return {
      entities : state.entities,
      
   }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps), AuthenticationHoc)


export default  composedHoc;
  


