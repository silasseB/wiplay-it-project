import React from 'react';

//import {DefaultWrongPage} from "components/partial_components"
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SubmissionError } from 'redux-form'; 
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
            isAuthenticated : false,
            };

            this.onSubmit            = this.onSubmit.bind(this);
            this.responseFacebook    = this.responseFacebook.bind(this);
            this.responseTwitter     = this.responseTwitter.bind(this);
            this.responseGoogle      = this.responseGoogle.bind(this);     
        }


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
            console.log(accessToken)
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


        
        toggleSignUpForm = (props)=>{
           console.log(props)
           console.log(props, this.props)
           this.props.toggleSignUp(props)
           this.forceUpdate()
        }

        togglePasswordResetForm = (props) => {
           console.log(props, this.props)
           this.props.togglePasswordReset(props)
           this.forceUpdate()
        };


      
      
        getAuthUrl = (formName)=>{

            switch(formName){

                case 'login':
                    return api.logginUser();

                case 'signUp':
                    return api.createUser();

                case 'passwordChange':
                    return api.passwordChangeApi();

                case 'emailForm':
                    return api.passwordResetApi();

                default:
                    return  '';

            };
       	    
        };


        onSubmit = (values, dispatch, props) => {
            console.log(props)

            const axiosApi = new Axios(false);
            let apiUrl =  this.getAuthUrl(props.form);

            return authenticate(apiUrl, values, dispatch);
           
        };

      
        getProps() {
            let  props = {
                onSubmit : this.onSubmit, 
                responseFacebook        : this.responseFacebook,
                responseGoogle          : this.responseGoogle,
                responseTwitter         : this.responseTwitter,
                togglePasswordResetForm : this.togglePasswordResetForm, 
                toggleSignUpForm        : this.toggleSignUpForm,
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
  


