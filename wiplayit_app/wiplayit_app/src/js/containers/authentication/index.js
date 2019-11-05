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
                form                 : null,
                formName             : null, 
                submitting           : false,
                onSignUpForm         : false,
                onPasswordResetForm  : false,
                onPasswordChangeForm : false, 

            };

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
                //console.log(userAuth)
                
                if(userAuth && userAuth.auth && userAuth.auth.isLoggedIn && userAuth.auth.tokenKey){
                   console.log(userAuth.auth)
                   this.Redirect();
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);
                    
        };


        componentWillUnmount() {
            this.unsubscribe();

        };

        handleFormChange(e){
            e.preventDefault()
            let form = this.state.form;
            
            if (form) {
                form[e.target.name] = e.target.value;
                this.setState({form});
            }
        };

        formConstructor = (name) => {
            
            if (name) {

                switch(name){

                    case 'loginForm':

                        let loginForm = {'email':'', 'password':''}
                        this.setState({'form' : loginForm, 'formName':name})
                        return;

                    case 'signUpForm':

                        let signUpForm = {
                            'first_name' : '',
                            'last_name'  : '',
                            'email'      : '',
                            'password'   : '',

                        };

                        this.setState({ 'form': signUpForm, 'formName':name });
                        return;

                    case 'passwordResetForm':
                    case 'emailResendForm':

                        let emailForm = { 'email'      : '', };
                        this.setState({ 'form' : emailForm,  'formName':name})
                        return; 

                    case 'passwordChangeForm':

                        let passwordChangeForm = { 'password1' : '', 'password2' : '' }
                        this.setState({ 'form' : passwordChangeForm,  'formName':name })
                        return;

                    default:
                        return null;
                };
            }
        };


        
        toggleSignUpForm = (props)=>{
            this.setState({onSignUpForm:props.value})
        };

        togglePasswordResetForm = (props) => {
            this.setState({onPasswordResetForm : props.value})
           
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
            this.setState( {submitting : true} )

            let formName = this.state.formName;
            let form = this.state.form;
            
            let apiUrl =  this.getAuthUrl(formName);
            store.dispatch(action.authenticationPending());
            return authenticate(apiUrl, form, store.dispatch);
           
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
  


