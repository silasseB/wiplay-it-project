import React from 'react';

//import {DefaultWrongPage} from "components/partial_components"
import Axios from 'axios_instance';
import { connect } from 'react-redux';
import { compose } from 'redux';

import  * as action  from 'actions/actionCreators';

import { store } from 'index';
import Api from 'api';
//import Helper from 'containers/utils/helpers';


//const helper   = new Helper();
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
           //console.log(response.accessToken);
           var accessToken =  response.accessToken
           var formData = new FormData();
           console.log(accessToken)
          
           formData.append("access_token",accessToken);
      
           //var apiUrl =  api.facebookLoginApi(this)

        };


        onStoreUpdate = () =>{
         
        };


        componentDidUpdate(nextProps , prevState){
            console.log(nextProps, prevState)
       };


        componentDidMount() {
            const onStoreChange = () => {
                let  onStoreUpdate = store.getState();   
                var userAuth = onStoreUpdate.entyties.userAuth;
                console.log(userAuth, onStoreUpdate)

                if(userAuth && userAuth.auth && userAuth.auth.isLoggedIn){
                   //console.log(userAuth.auth)
                   this.Redirect();
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);
                    
        };


        componentWillUnmount() {
            this.unsubscribe();

        };


        componentWillReceiveProps(nextProps){
            console.log(nextProps)
            /*
            let  userAuth = store.getState().userAuth;
            let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));

            console.log(cachedEntyties, userAuth)

            let { currentUser }  = cachedEntyties;

            if (userAuth.auth.isLoggedIn && !currentUser) {
            let isOnStorage = localStorage.getItem('auth' )?true : false;

            if (isOnStorage) {
               let auth = JSON.parse(localStorage.getItem('auth'))
               store.dispatch(getCurrentUser(auth.tokenKey));
               currentUser = localStorage.getItem('currentUser')?true:false;

                if (currentUser) {
                    setTimeout( () => {
                     this.props.history.push('/');
                     this.setState({isAuthenticated:currentUser })
                  }, 100);
                    }
                }
            }    */   
        };

        responseTwitter = (response) => {
            console.log(response);
            //var accessToken =  response.accessToken
            //var apiUrl =  api.twitterLoginApi(this)
           //this.socialLogin(apiUrl, accessToken)
        }


        responseGoogle = (response)=> {
           console.log(response);
           //var accessToken =  response.accessToken
           //var apiUrl =  api.googleLoginApi(this)
           //this.socialLogin(apiUrl, accessToken)
        };

        toggleSignUpForm = (props)=>{
           console.log(props)
           console.log(props, this.props)
           this.props.toggleSignUp(props)
           this.forceUpdate()
        }

        togglePasswordResetForm = (props)=>{
           console.log(props, this.props)
           this.props.togglePasswordReset(props)
           this.forceUpdate()
        };
      
      
        getAuthUrl = (formValues)=>{
        	
       	    if (formValues.email && formValues.password &&
                !formValues.password2 && !formValues.first_name){

       		    return api.logginUser();
       	    }
        	
       	    else if (formValues.first_name && formValues.last_name){
       		    return api.createUser();
       	    }

       	    else if (formValues.password2 && formValues.password1){
       		    return api.passwordChangeApi();
       	    } 
        	
       	    else{
                return  api.passwordResetApi();
    	    }
        };

        onSubmit = (values, dispatch) => {
            const axiosApi = new Axios(false);
            let apiUrl =  this.getAuthUrl(values);
                
            const instance = axiosApi.axiosInstance();
            store.dispatch(action.authenticationPending()) 
            
         
            return  instance.post(apiUrl, values)
                .then(response => dispatch(action.authenticationSuccess(response.data)))
                .catch(error =>{
                
                if (error.response && error.response.data) {
                    dispatch(action.authenticationError(error.response.data));
                }
                else if (error.request) {
                    alert(apiUrl)
                    dispatch(action.handleError())
                }
            }); 
        }
      
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
        }
    

        render() {
            let props = this.getProps(); 
            console.log(props)

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
  


