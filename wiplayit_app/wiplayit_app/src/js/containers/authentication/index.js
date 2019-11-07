import React from 'react';

//import {DefaultWrongPage} from "components/partial_components"
import { connect } from 'react-redux';
import { compose } from 'redux';
; 
import  * as action  from '../../actions/actionCreators';

import {store} from "../../configs/store-config";
import Axios from '../../axios_instance';
import Api from '../../api';
import Helper from '../../containers/utils/helpers';
import {authenticate} from '../../dispatch/index';
import { getCookie } from '../../csrf_token.js';


const helper   = new Helper();
const api = new Api();





export function withAuthentication(Component) {

    return class Authentication extends React.Component {

        constructor(props) {

            super(props);
            this.state = {
                isAuthenticated      : false,
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

            };

            this.validateForm             = this.formIsValid.bind(this);          
            this.formConstructor          = this.formConstructor.bind(this);  
            this.onSubmit                 = this.onSubmit.bind(this);
            this.handleFormChange         = this.handleFormChange.bind(this); 
            this. confirmUser             = this.confirmUser.bind(this);
            this.responseFacebook         = this.responseFacebook.bind(this);
            this.responseTwitter          = this.responseTwitter.bind(this);
            this.responseGoogle           = this.responseGoogle.bind(this);  
            this.toggleSignUpForm         = this.toggleSignUpForm.bind(this);
            this.togglePasswordResetForm  = this.togglePasswordResetForm.bind(this);   
        };


        isAuthenticated() {
            let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));
            console.log(cachedEntyties)

            if (cachedEntyties){
                let { auth }  = cachedEntyties;

                if (auth && auth.isLoggedIn){
                    this.props.history.push('/')

                    this.props.forceUpdate()
                    return true
                }
            }

            return false;
        }

        Redirect(){
            let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));

            if (cachedEntyties){

                let { auth }  = cachedEntyties;
                //store.dispatch(getCurrentUser(auth.tokenKey));

                let {currentUser} = cachedEntyties;

                if(!currentUser){
                   // store.dispatch(getCurrentUser(auth.tokenKey));
                   console.log(auth)

                }

                if (auth && auth.isLoggedIn){
                    this.props.history.push('/')
                }
            }
        };

        responseFacebook(response) {
            
            let apiUrl =  api.facebookLoginApi();
            let accessToken =  response.accessToken
            let formData = helper.createFormData({"access_token": accessToken});
           
            if (accessToken) {
                return authenticate(apiUrl, formData, store.dispatch);
            }

            return ;


        };


        responseTwitter = (response) => {
            console.log(response);
            //var accessToken =  response.accessToken
            //var apiUrl =  api.twitterLoginApi(this)
           //this.socialLogin(apiUrl, accessToken)
        }


        responseGoogle = (response)=> {
            console.log(response);
            var accessToken =  response.accessToken
            var apiUrl =  api.googleLoginApi();
            let formData = helper.createFormData({"access_token": accessToken});

            if (accessToken) {
                return authenticate(apiUrl, formData, store.dispatch);
            }

            return ;
           
        };


        componentDidUpdate(nextProps , prevState){
           
        };


        componentDidMount() {
            const onStoreChange = () => {
                let  onStoreUpdate = store.getState();   
                var userAuth = onStoreUpdate.entyties.userAuth;

                if (userAuth) {
                    
                    let { auth } = userAuth;

                    if (userAuth.error || auth.isLoggedIn || auth.tokenKey) {
                        console.log(userAuth.error)
                        this.setState({ submitting : false })
                    }

                    if(auth && auth.isLoggedIn && auth.tokenKey){
                        this.Redirect(); 
                    }
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);
                    
        };


        componentWillUnmount() {
            this.unsubscribe();

        };

        handleFormChange(e){
            e.preventDefault()
            let  { form, formName } = this.state;
          
            
            if (form) {

                let currentForm = form[formName];
                currentForm[e.target.name] = e.target.value;
                this.setState({form});
            }
        };

        _InvalidateForm(){

        }



        formIsValid(form, formName=null){
                        
            if (form) {

                let formKeys = Object.keys(form);
                let formIsValid = true;
               
                for (var key in formKeys) {
                    key = formKeys[key]

                    if(/^ *$/.test(form[key])){
                        formIsValid = false 
                        console.log(/^ *$/.test(form[key]), form[key])
                        break
                    }
                }

                console.log(`the ${formName} is valid: ` + formIsValid)
                return formIsValid;

            }else{
                return false
            }

        };


        _SetForm(form, formName){
           
            let currentForm = this.state.form;
            
            if (currentForm) {

                if (!currentForm[formName]) {

                    currentForm[formName] = {...form}
                    console.log(form, currentForm)
                }

                form = currentForm;

            }else{
                form = Object.defineProperty({}, formName, { value : form });
            }
           
            this.setState({form, formName});

        };

        getFormFields(){
            return {
                loginForm  : {'email':'', 'password':''},

                signUpForm : {
                                'first_name' : '',
                                'last_name'  : '',
                                'email'      : '',
                                'password'   : '', },

                emailForm          : { 'email'  : '', }, 

                passwordChangeForm : { 'password1' : '', 'password2' : '' }
            }  
        }

        formConstructor = (name) => {
            
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

                        form = getFormFields().emailForm;
                        this.setState({ onEmailResendForm : true });

                        return this._SetForm(form, formName);

                    case 'passwordChangeForm':

                        form = getFormFields().passwordChangeForm;

                        this.setState({ onPasswordChangeForm : true});
                        
                        return this._SetForm(form, formName);

                    default:
                        return null;
                };

            }
        };

        getCurrentDefaultForm(){
           return this.state.defaultActiveForm;
        }


        
        toggleSignUpForm = (params)=>{
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

        togglePasswordResetForm = (params) => {
            
            const defaultActiveForm = 'loginForm';
            let passwordResetFormName = "passwordResetForm";
            let { value } = params;

            if (!value) {
                this.setState({onPasswordResetForm : false})
                this.formConstructor(defaultActiveForm) 
            }

            if ( value) {
                this.formConstructor(passwordResetFormName)
            }
            

           
        };


        confirmUser = ( key, callback )=>{
            
            let withToken = false;
            const axiosApi = new Axios(withToken);
            const  apiUrl  = api.accountConfirmApi(key);
            let instance   = axiosApi.axiosInstance();

            instance.get(apiUrl)
            .then(response => { 
                
                let {detail} = response.data;
                callback({ confirmed : true, successMassage : detail });
            })
            .catch(error => {
                console.log(error)
                callback({ confirmed: false});
            });
        } ;


      
      
        getAuthUrl = (formName)=>{
            console.log(formName)
            switch(formName){

                case 'loginForm':
                    return api.logginUser();

                case 'signUpForm':
                    return api.createUser();

                case 'passwordChangeForm':
                    return api.passwordChangeApi();

                case 'passwordResetForm':
                    return api.passwordResetApi();

                case 'emailResendForm':
                    return api.confirmationEmailResendApi();

                default:
                    return  '';

            };
       	    
        };


        onSubmit = (e) => {
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
  
                store.dispatch(action.authenticationPending());
                let formData = helper.createFormData({...form});
                return authenticate(apiUrl, formData, store.dispatch);

            }else{
                
                this._InvalidateForm()
            }
           
        };

      
        getProps() {
            let  props = {
                ...this.state,
                onSubmit                : this.onSubmit,
                formConstructor         : this.formConstructor,
                handleFormChange        : this.handleFormChange,
                responseFacebook        : this.responseFacebook,
                responseGoogle          : this.responseGoogle,
                responseTwitter         : this.responseTwitter,
                togglePasswordResetForm : this.togglePasswordResetForm, 
                toggleSignUpForm        : this.toggleSignUpForm,
                confirmUser             : this.confirmUser,
                validateForm            : this.validateForm, 
            };
         
            return Object.assign(props, this.props);
        };
    

        render() {
            let props = this.getProps(); 
           
            return (
               <div>
                    <div>
                     <Component {...props}/>
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
     
   }

};




const mapStateToProps = (state, ownProps) => {
   return {
      userAuth : state.entyties.userAuth,
      
   }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps),withAuthentication )


export default  composedHoc;
  


