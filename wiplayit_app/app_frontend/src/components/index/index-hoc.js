import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, 
        getCurrentUser,
        getPost,
        getUserList,
        getAboutInfo,
        getUserProfile,
        getPostList,
        getQuestion,
        getReplyList,
        getReplyChildrenList,
        getQuestionList,
        getCommentList,
        getIndex, 
        authenticate }  from 'dispatch/index'

import  * as action  from 'actions/actionCreators';
import { closeModals}   from  'components/modal/helpers';
import { ModalManager}   from  "components/modal/modal-container";

import {NavigationBarBottom} from 'templates/navBar';
import { AlertComponent } from 'templates/partial-components';
import * as checkType from 'helpers/check-types'; 

import {store} from 'store/index';
import {history} from "App";
import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import Helper from 'utils/helpers';



const api      = new Api();
const helper   = new Helper();


export function MainAppHoc(Component) {

    return class MainApp extends Component {
        isMounted = false;

        constructor(props) {
            super(props);

            this.state = {
                currentUser        : {},
                cacheEntities      : this._cacheEntities(), 
                isAuthenticated    : this.isAuthenticated(),
                isAdmin            : this.isAdmin(),
                displayMessage     : false,
                message            : null,
                modalIsOpen        : false,
            };
          
        };


        isAuthenticated() {
      	    let cacheEntities = this._cacheEntities();
            //console.log(cacheEntities)        
            if (cacheEntities){
        	    let { userAuth  }  = cacheEntities;
                                               
        	    if ( userAuth){
                    let {auth} = userAuth;
                    if (auth && auth.isLoggedIn && auth.tokenKey) {
             		    return true;
                    }
               	}
            }

            return false;
        };

        isAdmin(){
            let cacheEntities = this._cacheEntities();
            if (cacheEntities) {
                let {admin}        = cacheEntities;
                if (admin && admin.auth) {
                    let  auth  = admin.auth;
                    let {isLoggedIn, tokenKey} = auth && auth || {};

                    if (isLoggedIn && tokenKey) {
                        return true
                    }
                }
            }

            return false;
        }

        _SetCurrentUser =(currentUser=undefined)=>{
                    
            if (!currentUser) {
                let  cacheEntities  = this._cacheEntities();
                currentUser = cacheEntities.currentUser;
                currentUser = currentUser && currentUser.user;
            }
                       
            this.setState({currentUser})
            return currentUser;  
        };

        _cacheEntities = ()=>{
            return JSON.parse(localStorage.getItem('@@CacheEntities'))  || {};
        }



        //static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        // return  dispatch => action.handleError(error);
        //}

      
        //componentDidCatch(error, info) {
         // You can also log the error to an error reporting service
        // console.log(error, info);
        // }
        
        

        static getDerivedStateFromProps(props, state) {
            //console.log(state, props)
            return null
        }

        
        onStoreUpdate = (params, callback=function(){}) =>{
 
            const onStoreChange = () => {
                if (this.isMounted) {
                
                let storeUpdate = store.getState();
                var timeStamp = new Date();
                let { entities } = storeUpdate;
                let { currentUser,
                      modal,
                      index,
                      question,
                      userProfile,
                      userAuth,
                      errors } = entities;

                let editorModal    = modal['editor']; 
                let optionsModal   = modal['optionsMenu'];
                let dropImageModal = modal['dropImage'];
                let userListModal  = modal['userList'];

                //console.log(entities)
                Object.keys(userAuth).length && this.confirmLogout(userAuth);

                if (errors.error) {
                    if (editorModal && editorModal.modalIsOpen ||
                        dropImageModal && dropImageModal.modalIsOpen){
                        //Can avoid handling errors if any of these modal are open

                    }else{
                        this._HandleErrors(errors)
                    }
                }

                this.handleCreateSuccess(editorModal);
                this.handleUpdateSuccess(editorModal);
                this.handleUpdateSuccess(dropImageModal);
                
                if (currentUser && currentUser.user) {
                    this._SetCurrentUser(currentUser.user)
                }
                                
            }
        };

            this.unsubscribe = store.subscribe(onStoreChange);

        };

        _HandleErrors(errors){
            if (!errors) return;
            if (!errors.error) return;
            console.log(errors)
            this.displayErrorMessage(errors.error);
            delete errors.error;
        }

        handleCreateSuccess(modal){
            if (!modal) return;
            if (!Object.keys(modal).length) return;
                       
            if (modal.created === true) {
                delete modal.created;
                this.closeModal(modal)
                this.displaySuccessMessage(modal.successMessage);
                let data = modal.data
                               
                setTimeout(()=> {
                    let {answer,question,post} = data

                    post     && this.handleNewPost(modal);
                    question && this.handleNewQuestion(modal);
                    answer   && this.handleNewAnswer(modal);
                }, 100);
            }

        }

        handleUpdateSuccess(modal){
            if (!modal) return;
            if (!Object.keys(modal).length) return;
                       
            if (modal.updated === true) {
                delete modal.updated;
                this.closeModal(modal)
                this.displaySuccessMessage(modal.successMessage);
                let {data, objName, modalName} = modal;
                             
                objName   === 'UserProfile'  && this.handleUserProfileUpdate(data.user);
            }
            
        };

        handleUserProfileUpdate(userProfile) {
            userProfile && store.dispatch(action.getCurrentUserPending())
            userProfile && store.dispatch(action.getCurrentUserSuccess(userProfile));

        };

        closeModal(modal){

            let { objName, modalName} = modal;
            if (objName  === 'UserProfile' && modalName === 'editor') return;
            window.history.back(); 
            
        };

        handleNewQuestion =(params)=> {
            let data = params.data;
            let { question } = data
            let pathToQuestion = question  && `/question/${question.slug}/${question.id}/`; 
            let questionRedirectProps = {
                    path  : pathToQuestion,
                    state : {question, recentlyCreated : true},
                }
            question && this.redirectToRouter(questionRedirectProps);
        };

        handleNewPost =(params)=> {
            let data   = params.data;
            let {post} = data
            let pathToPost     = post && `/post/${post.title}/${post.id}`;
            let postRedirectProps = {
                    path  : pathToPost,
                    state : {post, recentlyCreated : true},
                };

            post && this.redirectToRouter(postRedirectProps);

        };

        handleNewAnswer =(params)=> {
            let data     = params.data;
            let question = params.obj;
            let {answer} = data;
            let pathToAnswer   = answer && `/answer/${answer.id}/`;

            let answerRedirectProps = {
                    path  : pathToAnswer,
                    state : {answer, question, recentlyCreated : true},
                } 
            
            answer && this.redirectToRouter(answerRedirectProps);


        };

        displaySuccessMessage =(message)=> {
            if (!message) return;

            if (!checkType.isString(message)){
                this.displayAlertMessage()
            }

            message = {textMessage:message, messageType:'success'}
            this.displayAlertMessage(message)
        };

        displayErrorMessage =(textMessage)=>{
            if (!checkType.isString(textMessage))return

            let message = {textMessage, messageType:'error'}
            this.displayAlertMessage(message)
        };

        displayAlertMessage = (message) => {
            if (!this.isMounted) return;

            this.setState({ displayMessage : true, message });
            setTimeout(()=> {
                this.setState({displayMessage : false}); 
            }, 5000);
        };

        redirectToRouter =(params)=>{
            let path  = params && params.path;
            let state = params && params.state;

            if (path) {
                history.push(path, state);
                //this.reloadPage();
            }
        };

        clearStore=()=>{
            //Remove app cache and  clean the store
            let storeUpdate = store.getState();
            let { entities } = storeUpdate;

            localStorage.removeItem('@@CacheEntities');
                
            Object.keys(entities).forEach(key => {
                let entitie = entities[key]
                   
                Object.keys(entitie).forEach(k => {
                    if (entities[key][k]) {
                        delete entities[key][k]
                    }
                })
            })

        };

        confirmLogout =(userAuth)=>{
           
            if (userAuth) {
                let {successMessage} = userAuth;
                let isLoggedOut =  successMessage === 'Successfully logged out.'

                if (isLoggedOut) {
                    let storeUpdate = store.getState();
                    let { entities } = storeUpdate;
                    let { modal } = entities;
                    let navigationModal  = modal['navigationMenu'];
                    if (navigationModal && navigationModal.modalIsOpen) {
                        window.history.back();
                        ModalManager.close('navigationMenu');
                    }

                    setTimeout(()=>{
                        this.clearStore()
                        history.push('/user/registration');

                    }, 1000)
                }
            }
            
        };

        logout= () => {
            let apiUrl   =  api.logoutUser();
            let useToken = true;
            this.props.authenticate({apiUrl, form:{}, useToken})
            
        };  

        componentWillUnmount() {
            this.unsubscribe();
            this.isMounted = false;
            
        };

        componentDidUpdate(prevProps, nextProps) {
        };

                
        componentDidMount() {
            this.onStoreUpdate() //Subscribe on store change 
             
            let { entities } = this.props;
            
            window.onpopstate = (event) => {
                closeModals();

                if (!this.isAuthenticated()) {
                }
            }

            window.addEventListener("beforeunload",(event)=>{
                let { modal } = entities;
                //event.returnValue = '';
            });

            if (!this.isAuthenticated()) {
                //User is not authenticated,so redirect to authentication page.
                history.push('/user/registration/')
                return;
            }

            this.isMounted = true;
            let currentUser = this._SetCurrentUser();
          
            if(!currentUser){
                store.dispatch(getCurrentUser());
            }

            if (currentUser && !currentUser.is_confirmed) {
                store.dispatch(getCurrentUser());
            }



        };

       
        push(params){
            let path = params && params.path;
            let state = params && params.state;

            if (path) {
                history.push(path, state);
                //this.reloadPage();
            }
        };

        reloadPage(){
            console.log(this.props,window.location, 'Im reloading this page')
            window.location.reload();
        };
     
        redirecToQuestionPage  = (questionObj) => {
            questionObj = questionObj.newObject;
            if (questionObj) {
                let path = `/question/${questionObj.slug}/` 
                let currentUser = this.state.currentUser;
            
                this.props.history.push(path, {questionObj, currentUser, isNeQuestion:true})
            }
        };

        editfollowersOrUpVoters = (params) =>{
            //console.log(params)
            let {currentUser} = params || this.state;
            if (!currentUser.is_confirmed) {
                let {obj}  = params && params;
                let name   = obj && obj.upvotes && 'upvote' || obj && 'follow';
                let error  = `Sorry, you must confirm your account to ${name} ` ;
                store.dispatch(action.handleError(error));
               return;   

            }

            params = this._getFormData(params);
            this.props.submit(params); 
        };

        _getFormData = (params) =>{
           
            let {objName, obj} = params;

            switch(objName){
                case 'Question':
                case 'UserProfile':
                case 'UsersList':
                    var followers     = obj.followers || obj.profile && obj.profile.followers;
                    params['formData'] = helper.createFormData({ followers });
                    return params;

                default:
                    var upvotes       = params.obj.upvotes; 
                    params['formData'] = helper.createFormData({upvotes});
                    return params; 
            }

        };
     
        getProps(){

            return {
                ...this.props,
                logout                  : this.logout,
                editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
                reloadPage              : this.reloadPage.bind(this),
                push                    : this.push.bind(this),
                redirectToRouter        : this.redirectToRouter.bind(this),
                ...this.state,
            };
        };

        onBeforeUnload =()=>{
            console.log('Component is unloading')
        };
  

        render() {
            if(!this.isMounted) return null;
            const feather = require('feather-icons')

            let props = this.getProps();
            let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                          { display : 'none' };

            let onModalStyles = props.modalIsOpen ? {opacity:'0.70',} :
                                                    {opacity:'2',};
                      
            return (
                <div  className="app-container">
                    <fieldset style={ onModalStyles } 
                              disabled={ props.modalIsOpen } >
                        
                        <Component {...props}/>                    

                    </fieldset>

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
        getAboutInfo         : ()           => dispatch(getAboutInfo()),
    	getIndex             : (props)      => dispatch(getIndex(props)), 
        getUserProfile       : (id, apiUrl) => dispatch(getUserProfile(id, apiUrl)),
        getUserList          : (props)      => dispatch(getUserList(props)),
        getQuestionList      : (id)         => dispatch(getQuestionList(id)),
        getPostList          : (id)         => dispatch(getPostList(id)),
        getQuestion          : (id)         => dispatch(getQuestion(id)),
        getPost              : (id)         => dispatch(getPost(id)),
        getCommentList       : (comment)    => dispatch(getCommentList(comment)),
        getReplyList         : (props)      => dispatch(getReplyList(props)),
        getReplyChildrenList : (reply)      => dispatch(getReplyChildrenList(reply)),
        getCurrentUser       : (apiUrl)     => dispatch(getCurrentUser()),
        submit               : (props )     => dispatch(handleSubmit(props)), 
        authenticate         : (props)      => dispatch(authenticate(props)),
        
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        entities      : state.entities,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps),  MainAppHoc)


export default  composedHoc;





