import React from 'react';

import { ModalManager} from 'react-dynamic-modal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, getCurrentUser,getPost, getUserList,
         getUserProfile,getPostList,getQuestion,getReplyList,getReplyChildrenList,
         getQuestionList as _getQuestionList,getCommentList, getIndex }  from "dispatch/index"
import  * as action  from 'actions/actionCreators';


import { ModalOptionsMenu } from "components/buttons";
import { DropImage } from "containers/profile/edit_profile";
import AppEditor  from 'containers/editor'
import {store} from "index";


import Modals from "containers/modal-conf";
import Helper from 'containers/utils/helpers';




const helper   = new Helper();


export function withHigherOrderIndexBox(Component) {

    return class HigherOrderIndexBox extends Component {

        constructor(props) {
            super(props);

            this.state = {
               currentUser      : '',
               isAuthenticated  :  localStorage.getItem('auth' )?true : false,
               modalIsOpen      : false,
            };
        };


        isAuthenticated() {
      	    let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));
        
            if (cachedEntyties){
        	    let { auth  }  = cachedEntyties;
        	    if ( auth && auth.isLoggedIn){
        		    return true
               	}
            }

            return false;
        };

        //static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        // return  dispatch => action.handleError(error);
        //}

      
        //componentDidCatch(error, info) {
         // You can also log the error to an error reporting service
        // console.log(error, info);
        // }
        /*
        componentWillMount() {
           //localStorage.removeItem('questionList');        
        }*/

        componentWillUnmount() {
            this.unsubscribe();
        };

        onStoreUpdate = () =>{
 
            const onStoreChange = () => {
                let storeUpdate = store.getState();
                //if (!storeUpdate.question.visited && storeUpdate.question.newObject) {
                //   console.log('redirecting to question page')
                // this.redirecToQuestionPage(storeUpdate.question) 
                // }
               //Open the Modal whenever modal is true.

            this.openModal(storeUpdate.modal);
            /*

            if (this.state.modalIsOpen) {
                if (this.state.modalIsOpen) {
                    store.dispatch(action.hideModal())
                }
            }

            else if (this.props.history && this.props.history.action === "PUSH") {
                //console.log(storeUpdate)
            }*/
           }

            this.unsubscribe = store.subscribe(onStoreChange);

        }

        
      

        disableBack(e) {
            if (this.state.modalIsOpen) {
                e.returnValue = '';
            }

            e.preventDefault()
        }

        componentDidMount() {
           this.onStoreUpdate() //Subscribe on store change    
      
            if (!this.isAuthenticated()) {
                //User is not authenticated,so redirect to authentication page.
                this.props.history.push('/user/registration/')
            }

            if(!this.getCurrentUser()){
        	    store.dispatch(getCurrentUser());
            }
        };


        logout = () => {
            localStorage.removeItem('@@CachedEntyties');

            if (this.isAuthenticated()) {
                localStorage.removeItem('@@CachedEntyties')
                this.props.history.push('/user/registration')

            }
            else{
        	   localStorage.removeItem('@@CachedEntyties')
               this.props.history.push('/user/registration')

            }

            ModalManager.close();
        }

        getCurrentUser(){
      	    let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));

          	if (cachedEntyties && cachedEntyties.currentUser) {
      	        return cachedEntyties.currentUser.user
            }

            return null;  
        }



        openModal = (modal) => {
            //Open modal is open is true and close the if isOpen is false
            //And most importantly render the modal with its contents based on the 
            //action dispatched 

            const modals   = new Modals();
            if (modal.isOpen) {
                let modalProps = modal.modalProps?modal.modalProps:{};
                //Get Some important props and merge them with modalProps
                let props = this.getProps()  
                Object.assign(props, modalProps)

                console.log(modal)

                if (modal.modalType === 'editor') {
                    modalProps['modalContents'] =  <AppEditor {...props}/>;
                    console.log(modal, modalProps)
                    modals.editorModal(modal.modalProps);

                    setTimeout( () => {
                        this.setState({modalIsOpen : true})
                       //this.props.history.push({},'')
                    }, 10);
               
                }

                else if(modal.modalType === 'optionsMenu'){
                    modalProps['modalContents'] = <ModalOptionsMenu {...props}/>
                    modals.optionsMenuModal(modalProps)

                    setTimeout( () => {
                       this.setState({modalIsOpen : true})
                       //this.props.history.push({},'')
                    }, 10);
              
                }
                else if(modal.modalType === 'dropImage'){
                    modalProps['modalContents'] = <DropImage {...props}/>
                    modals.dropImageModal(modalProps)

                    setTimeout( () => {
                        this.setState({modalIsOpen : true})
                       //this.props.history.push({},'')
                    }, 10);
                }
        

            }else{
                this.setState({modalIsOpen: false})
                ModalManager.close();
            }
        }
     
        redirecToQuestionPage  = (questionObj) => {
            questionObj = questionObj.newObject;
            if (questionObj) {
                let path = `/question/${questionObj.slug}/` 
                let currentUser = this.state.currentUser;
            
                this.props.history.push(path, {questionObj, currentUser, isNeQuestion:true})
            }
        };
      
        unfollowOrDownVote(params) {
        
         if (params.objName === "question" || params.objName === "userProfile" 
                                    || params.objName === "usersList" ) {
            var followers     = params.obj.followers - 1;

            params['formData'] = helper.createFormData({ followers });
         }else{
            var upvotes       = params.obj.upvotes - 1; 
            params['formData'] = helper.createFormData({upvotes})
         }
        this.props.submit(params); //handle subimiting downVotes or Unfollwers 

      };

        followOrUpVote(params) {
      
            if (params.objName === "question" || params.objName === "userProfile"
                                              || params.objName === "usersList") {
                var followers     = params.obj.followers + 1;
                params['formData'] = helper.createFormData({ followers });
            }
            else{
                var upvotes       = params.obj.upvotes + 1; 
                params['formData'] = helper.createFormData({upvotes})
            }
            this.props.submit(params); //handle subimiting upvotes or follwers 
        };

        push(){
            this.props.history.pus(this.props, 'hello') 
        };
     
        getProps(){
            let props = {
                logout             : this.logout,
                followOrUpVote     : this.followOrUpVote.bind(this),
                unfollowOrDownVote : this.unfollowOrDownVote.bind(this),
                currentUser        : this.getCurrentUser(),
            };
         
            Object.assign(props, this.props );
            return props;  
        };
  

        render() {
            let props = this.getProps();
            //console.log(props)

            return (
                <div>
                   <Component {...props}/>
                </div> 

            );
        };

    };
};


//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
   
    return {
    	getIndex               : (props)     =>  dispatch(getIndex(props)), 
        getUserProfile       : (id)      => dispatch(getUserProfile(id)),
        getUserList          : (props)   => dispatch(getUserList(props)),
        getQuestionList      : (id)      => dispatch(_getQuestionList(id)),
        getPostList          : (id)      => dispatch(getPostList(id)),
        getQuestion          : (id)      => dispatch(getQuestion(id)),
        getPost              : (id)      => dispatch(getPost(id)),
        getCommentList       : (comment) => dispatch(getCommentList(comment)),
        getReplyList         : (props)   => dispatch(getReplyList(props)),
        getReplyChildrenList : (reply)   => dispatch(getReplyChildrenList(reply)),
        getCurrentUser       : (apiUrl)  => dispatch(getCurrentUser()),
        submit               : (props )  => dispatch(handleSubmit(props)), 
        showModal            : (props )  => dispatch(action.showModal(props)),
        hideModal            : (props )  => dispatch(action.hideModal(props)),  
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
       modal         : state.modal,
       entyties      : state.entyties,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps), withHigherOrderIndexBox )


export default  composedHoc;




