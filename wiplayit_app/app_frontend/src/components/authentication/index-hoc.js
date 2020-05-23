import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import Axios from 'utils/axios_instance';
import Api from 'utils/api';
import Helper from 'utils/helpers';
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
                confirmed            : false,
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
                email                : null,
                cacheEntities        : JSON.parse(localStorage.getItem('@@CacheEntities')),
            
            };

            //React binding

            this.validateForm             = this.formIsValid.bind(this);          
            this.formConstructor          = this.formConstructor.bind(this);  
            this.onSubmit                 = this.onSubmit.bind(this);
            this.handleFormChange         = this.handleFormChange.bind(this); 
            this.confirmUser              = this.confirmUser.bind(this);
            this.responseFacebook         = this.responseFacebook.bind(this);
            this.responseTwitter          = this.responseTwitter.bind(this);
            this.responseGoogle           = this.responseGoogle.bind(this);  
            this.toggleSignUpForm         = this.toggleSignUpForm.bind(this);
            this.toggleEmailForm          = this.toggleEmailForm.bind(this);  
            this._Redirect                = this._Redirect.bind(this); 
        };


        isAuthenticated =()=> {
            let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));
            console.log(cacheEntities)

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

        _Redirect =()=> {
            let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));

            if (cacheEntities){

               let { userAuth  }  = cacheEntities;
                
                if ( userAuth){
                    let { auth } = userAuth;
                    if (auth && auth.isLoggedIn){
                        setTimeout(()=> {
                            this.props.history.push('/'); 
                        }, 500);
                    }
                    
                }
            }
        };

        responseFacebook =(response)=> {
            console.log(response)
            let apiUrl =  api.facebookLoginApi();
            let accessToken =  response.accessToken
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)

            return ;
        };


        responseTwitter =(response)=> {
            console.log(response);
            let accessToken =  response.accessToken
            let apiUrl =  api.twitterLoginApi(this)
            accessToken && this._SendSocialAuthentication(accessToken, apiUrl)
            
            return ;
        };


        responseGoogle =(response)=> {
            console.log(response);
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
                this.setState({isAuthenticated:true});
            }

            window.onpopstate = (event) => {
                console.log("Poping action" ,this.props)
                
            }  
        };

        onAuthStoreUpdate =()=> {
            const onStoreChange = () => {
                let  storeUpdate = store.getState(); 
                let { entities } =  storeUpdate;
                let { userAuth, errors } = entities;
                let { form, formName } = this.state;
                console.log(userAuth)

                let { auth, error, successMessage }  = userAuth;

                if (errors) {
                    this._HandleErrors(errors);
                }

                if (form && error) {
                    form[formName]['error'] = error;
                    this.setState({form, submitting : false})
                }

                if(successMessage){
                    this.setState({ submitting : false, successMessage}) 
                }

                if (auth) {
                    console.log(auth)  
                    let { isLoggedIn, tokenKey, email, isConfirmed} = auth;
                         
                    this.setState({ submitting : false,  error, email}) 

                    if(!isConfirmed && isLoggedIn && tokenKey){
                        this._Redirect()
                    }
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);
        };


        _HandleErrors(errors){
            if (!errors) return;
            if (!errors.error) return;
            let message = {textMessage:errors.error, messageType:'error'}

            this.displayAlertMessage(message);
            delete errors.error;
        }

        displayAlertMessage = (message) => {
                                 
            this.setState({ displayMessage : true, message });
            setTimeout(()=> {
                this.setState({displayMessage : false}); 
            }, 10000);
        };


        handleFormChange=(e)=>{
            e.preventDefault()
            let  { form, formName } = this.state;
            if (form) {
                form[formName][e.target.name] = e.target.value;
                this.setState({form});
            }
        };

        _InvalidateForm(){

        };



        formIsValid =(form, formName=null)=> {
                        
            if (form) {

                let formKeys = Object.keys(form);
                let formIsValid = true;
               
                for (var key in form) {
                    let formValue = form[key]
                    //console.log(form,formValue)
                    //console.log(/^ *$/.test(formValue))

                    if(/^ *$/.test(formValue)){
                        formIsValid = false;
                        return formIsValid;
                         
                    }
                    
                }
                //console.log(formIsValid) 
                return formIsValid
                             

            }else{
                return false
            }

        };


        _SetForm =(form, formName)=> {

            let currentForm = this.state.form;
            if (currentForm) {
                if (!currentForm[formName]) {
                    currentForm[formName] = {...form}
                }

                form = currentForm;

            }else{
                form = Object.defineProperty({}, formName, { value : form });
            }
           
            this.setState({form, formName});

        };

        getFormFields =()=> {
            return {
                loginForm  : {
                    'email':'',
                    'password':''
                },

                signUpForm : {
                    'first_name' : '',
                    'last_name'  : '',
                    'email'      : '',
                    'password'   : '',
                },

                emailForm  : {
                    'email'  : '',
                }, 

                passwordChangeForm : {
                    'new_password1' : '',
                    'new_password2' : '',

                }
            }  
        }

        formConstructor =(name)=> {
            if (name) {
                let formName = name;
                let defaultActiveForm = formName;
                let form = null;

                switch(formName){

                    case 'loginForm':
                        form = this.getFormFields().loginForm;
                        this.setState({ onLoginForm : true, defaultActiveForm})

                        return this._SetForm(form, formName)

                    case 'signUpForm':

                        form = this.getFormFields().signUpForm;
                        this.setState({onSignUpForm : true})

                        return this._SetForm(form, formName);

                    case 'passwordResetForm':

                        form = this.getFormFields().emailForm;
                        this.setState({ onPasswordResetForm : true, defaultActiveForm });

                        return this._SetForm(form, formName); 

                    case 'emailResendForm':

                        form = this.getFormFields().emailForm;
                        this.setState({ onEmailResendForm : true });

                        return this._SetForm(form, formName);

                    case 'passwordChangeForm':
                        let { uid, token } = this.props.match.params;


                        form = this.getFormFields().passwordChangeForm;
                        form = Object.assign({uid, token}, form);
                        console.log(form)

                        this.setState({ onPasswordChangeForm : true});
                        
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
            //if(!this.isMounted) return;

            console.log(params)
            const defaultActiveForm = 'loginForm';
            let { value, successMessage, formName } = params;

            if (!successMessage) {
                console.log(formName)
                this.setState({successMessage : false})
                this.formConstructor(formName)
            }

            if (!value && formName !== 'emailResendForm') {
                console.log(formName)
                this.setState({onPasswordResetForm : false})
                this.formConstructor(defaultActiveForm) 
                
            }else{
                this.setState({onEmailResendForm : false})
            }

            if ( value) {
                console.log(formName)
                this.formConstructor(formName)
            }
        };


        confirmUser =(key, callback)=> {
            //if(!this.isMounted) return;

            let useToken = false;
            const Api    = _GetApi(useToken);
            if (!Api) {
                return;
            }

            const  apiUrl  = api.accountConfirmApi(key);

            Api.get(apiUrl)
            .then(response => { 
                console.log(response)
                let {data}  = response;
               
                let auth      = {};
                let response_data = {};
                let user      = data.user;

                let isLoggedIn = data.key && true || data.token && true || false;
                let tokenKey   = data.token || data.key  || null;

                let successMessage = data.detail || null;

                if (isLoggedIn) {
                   auth = {isLoggedIn, tokenKey, isConfirmed : true}
                   response_data = {auth}

                }else if(successMessage){
                    response_data = {successMessage}
                }  

                callback({...response_data });
                this.setState({...auth})

                store.dispatch(action.authenticationSuccess(response_data));

                if (user) {
                    store.dispatch(action.getCurrentUserPending());
                    store.dispatch(action.getCurrentUserSuccess(user))
                }

            })
            .catch(error => {
                console.log(error) 
                if (error && error.response) {

                   error = error.response.data
                   let errorMessage = error.detail;
                   error = "Unable to confirn your account" 
                   callback({ isConfirmed : false, errorMessage});
                   
                   this.setState({ isConfirmed : false, errorMessage })

                   store.dispatch(action.authenticationError(error));

                }else if(error && error.request){
                    error = "Something wrong happened, please try again" 
                    store.dispatch(action.authenticationError(error))

                }else{
                    store.dispatch(action.handleError())
                }
            });
        
        };


      
      
        getAuthUrl =(formName)=> {
            if (!formName) return;
        
            switch(formName){

                case 'loginForm':
                    return api.logginUser();

                case 'signUpForm':
                    return api.createUser();
                
                case 'passwordResetForm':
                    return api.passwordResetApi();

                case 'passwordChangeForm':
                    return api.passwordResetConfirmApi();

                case 'emailResendForm':
                    return api.confirmationEmailResendApi();

                default:
                    return  '';

            };
       	    
        };


        onSubmit =(e)=> {
            
            e.preventDefault();
            let formName    = this.state.formName;
            let form        = this.state.form[formName];
            let formIsValid = this.formIsValid(form, formName);
            let apiUrl      = this.getAuthUrl(formName);
        
            if ( form && formIsValid) {
                if (form.email) {
                    let emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                    let emailIsValid = emailRegExp.test(form.email)

                    if (!emailIsValid) {
                        return 
                    }

                }
                
                form = helper.createFormData({...form});
                this.setState({submitting : true})
                return this.props.authenticate({apiUrl, form,});

            }else{
                
                this._InvalidateForm()
            }
           
        };

      
        getProps =()=> {
            return {
                ...this.props,
                ...this.state,
                onSubmit                : this.onSubmit,
                formConstructor         : this.formConstructor,
                handleFormChange        : this.handleFormChange,
                responseFacebook        : this.responseFacebook,
                responseGoogle          : this.responseGoogle,
                responseTwitter         : this.responseTwitter,
                toggleEmailForm         : this.toggleEmailForm, 
                toggleSignUpForm        : this.toggleSignUpForm,
                confirmUser             : this.confirmUser,
                validateForm            : this.validateForm, 

            };
        };
    

        render() {
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


//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
     
    return {
        togglePasswordReset  : (self , props)    => dispatch(action.togglePasswordResetForm(self, props)),
        toggleSignUp         : (self , props)    => dispatch(action.toggleSignUpForm(self , props)),
        authenticate         : (props)           => dispatch(authenticate(props)),
     
   }

};




const mapStateToProps = (state, ownProps) => {
   return {
      entities : state.entities,
      
   }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps), AuthenticationHoc)


export default  composedHoc;
  


