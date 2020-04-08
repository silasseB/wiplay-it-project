import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, getCurrentUser,getPost, getUserList,
         getUserProfile,getPostList,getQuestion,getReplyList,getReplyChildrenList,
         getQuestionList as _getQuestionList,getCommentList, getIndex, authenticate }  from "dispatch/index"
import  * as action  from 'actions/actionCreators';
import { ModalManager}   from  "containers/modal/modal_container";

import { AlertComponent } from "components/partial_components";
import { ModalOptionsMenu } from "components/buttons";
import { DropImage } from "containers/profile/edit_profile";
import AppEditor  from 'containers/editor'
import {store} from "store/index";
import {history} from "App";

import Api from 'utils/api';

import Helper from 'containers/utils/helpers';



const api      = new Api();
const helper   = new Helper();


export function withHigherOrderIndexBox(Component) {

    return class HigherOrderIndexBox extends Component {
        _isMounted = false;

        constructor(props) {
            super(props);

            this.state = {
                currentUser        : {},
                cacheEntities      : this._cacheEntities(), 
                isAuthenticated    : this.isAuthenticated(),
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
                    let { auth } = userAuth;

                    if (auth && auth.isLoggedIn && auth.tokenKey) {
             		    return true;
                    }
               	}
            }

            return false;
        };

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
        
        componentWillUnmount() {
            this.unsubscribe();
            this._isMounted = false;
            
        };

        static getDerivedStateFromProps(props, state) {
           //console.log(state, props)
           return null
        }

        
        onStoreUpdate = (params, callback=function(){}) =>{
 
            const onStoreChange = () => {
                if (this._isMounted) {
                
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

                if (editorModal && editorModal.modalIsOpen || optionsModal &&  optionsModal.modalIsOpen ||
                    dropImageModal && dropImageModal.modalIsOpen || userListModal && userListModal.modalIsOpen  ) {
                    //alert(e.modalIsOpen)
                    //document.body.style['overflow-y'] = 'hidden';
                    //document.body.style['overflow-x'] = 'hidden';
                }else{
                    //document.body.style['overflow-y'] = 'scroll';
                    //document.body.style['overflow-x'] = 'scroll';
                }
                //console.log(userAuth)
                console.log(errors)
                this.confirmLogout(userAuth.auth);

                if (errors.error && !errors.displayErrors) {
                    errors['displayErrors'] = true;
                    this.displayErrorMessage(errors.error);
                    delete errors.displayErrors;
                    delete errors.error;
                }
                

                if (editorModal && Object.keys(editorModal).length) {
                    //console.log(modal)
                    let {objName, data, isCreating, modalIsOpen} = editorModal;
                    this.setState({ modalIsOpen : modalIsOpen });

                    
                                                            
                    if (isCreating && objName === 'Question' || objName === 'Post' ) {
                        //console.log(modal)
                        //const scrollY = document.body.style.top;
                        //document.body.style.position = '';
                        //document.body.style.top = '';
                        //window.scrollTo(0, parseInt(scrollY || '0') * -1);
                        
                    }
                    

                    if ( data && !data.displayMessage){
                       let successMessage = modal && modal.successMessage;
                       data['displayMessage'] = true;
                       let message = {textMessage:successMessage, messageType:'success'}
                       this.displayAlertMessage(message)
                       delete modal.data
                       
                    }
                   
                }

                if (currentUser && currentUser.user) {
                    this._SetCurrentUser(currentUser.user)
                }

                                
            }
            };

            this.unsubscribe = store.subscribe(onStoreChange);

        };

        displayErrorMessage =(errorMessage)=>{
            let message = {textMessage:errorMessage, messageType:'error'}
            this.displayAlertMessage(message)
        }

        displayAlertMessage = (message) => {
                       
            this.setState({ displayMessage : true, message });
                setTimeout(()=> {
                    this.setState({displayMessage : false}); 
                }, 5000);
        }

        confirmLogout =(auth)=>{
            
            if (auth && !auth.isLoggedIn) {
                console.log('User is logging out')

               localStorage.removeItem('@@CacheEntities');       
               history.push('/user/registration');
            }
            
        };

        
      

        componentDidUpdate(prevProps, nextProps) {
            let { entities, history }  = prevProps;
            let { modal } = entities;

            let { action } = history;
            
            if (modal && action === "POP") {
                //console.log(action, modal)
                let{background} = modal;

                let optionsModal   = modal['optionsMenu'];
                let editorModal    = modal['editor'];
                let dropImageModal = modal['dropImage'];
                let userListModal  = modal['userList'];


                editorModal    && editorModal.modalIsOpen    && ModalManager.close('editor', background);
                optionsModal   && optionsModal.modalIsOpen   && ModalManager.close('optionsMenu', background);
                dropImageModal && dropImageModal.modalIsOpen && ModalManager.close('dropImage', background); 
                userListModal  && userListModal.modalIsOpen  && ModalManager.close('userList', background); 

            }else{
                //console.log(action, prevProps, this.props, modal)
            }
        };

        updateIndicator(status) {
            //status && console.log(' internet is ' + status);
            // Show a different icon based on offline/online
        }

        componentDidMount() {
            this._isMounted = true;
            this.onStoreUpdate() //Subscribe on store change 
            /* Update the online status icon based on connectivity
            window.addEventListener('online',  this.updateIndicator('online'));
            window.addEventListener('offline', this.updateIndicator('offline'));
            //this.updateIndicator();


            window.addEventListener("offline", function(e) {
                alert('offline')
                 console.log(' internet is offline');
            });

            // Add event listener online to detect network recovery.
            window.addEventListener("online", function(e) {
                alert('online')
               console.log(' internet is online');
            });*/

            //console.log(this.props.entities)  
            let { entities } = this.props;
            window.addEventListener("beforeunload",(event)=>{
                
                let { modal } = entities;

                let optionsModal   = modal && modal['optionsMenu'];
                let editorModal    = modal && modal['editor'];
                let dropImageModal = modal && modal['dropImage'];

                console.log('Im reloading',optionsModal,  editorModal, dropImageModal)

                editorModal    && editorModal.modalIsOpen    && ModalManager.close(
                                                                            'editor',
                                                                            editorModal.background
                                                                        );
                optionsModal   && optionsModal.modalIsOpen   && ModalManager.close(
                                                                        'optionsMenu',
                                                                        optionsModal.background
                                                                    );
                dropImageModal && dropImageModal.modalIsOpen && ModalManager.close(
                                                                            'dropImage',
                                                                            dropImageModal.background
                                                                        ); 
                //event.returnValue = '';
                
            });
 
            
            if (!this.isAuthenticated()) {
                console.log(!this.isAuthenticated())
               //User is not authenticated,so redirect to authentication page.
                //history.push('/user/registration/')
            }

            let currentUser = this._SetCurrentUser();
            if(!currentUser){
                console.log(currentUser) 
       	        store.dispatch(getCurrentUser());
            }



        };


        logout = () => {

            let apiUrl =  api.logoutUser();
            store.dispatch(action.authenticationPending());
            authenticate(apiUrl, null, store.dispatch)
            
        }

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
            console.log(params)
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
        }

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

            let props = {
                logout                  : this.logout,
                editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
                reloadPage              : this.reloadPage.bind(this),
                push                    : this.push.bind(this),
                ...this.state,
            };
         
            Object.assign(props, this.props );
            return props;  
        };

        onBeforeUnload =()=>{
            console.log('Component is unloading')
        }
  

        render() {
            let props = this.getProps();
            let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                          { display : 'none' };

            let onModalStyles = props.modalIsOpen ? {opacity:'0.70',} :
                                                    {opacity:'2',};
            //console.log(props)

            var isOnline = window.navigator.onLine;
            if (isOnline) {
               // console.log('online');
            } else {
               // console.log('offline');
            }
            
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
    	getIndex             : (props)      => dispatch(getIndex(props)), 
        getUserProfile       : (id, apiUrl) => dispatch(getUserProfile(id, apiUrl)),
        getUserList          : (props)      => dispatch(getUserList(props)),
        getQuestionList      : (id)         => dispatch(_getQuestionList(id)),
        getPostList          : (id)         => dispatch(getPostList(id)),
        getQuestion          : (id)         => dispatch(getQuestion(id)),
        getPost              : (id)         => dispatch(getPost(id)),
        getCommentList       : (comment)    => dispatch(getCommentList(comment)),
        getReplyList         : (props)      => dispatch(getReplyList(props)),
        getReplyChildrenList : (reply)      => dispatch(getReplyChildrenList(reply)),
        getCurrentUser       : (apiUrl)     => dispatch(getCurrentUser()),
        submit               : (props )     => dispatch(handleSubmit(props)), 
        
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        entities      : state.entities,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps), withHigherOrderIndexBox )


export default  composedHoc;





