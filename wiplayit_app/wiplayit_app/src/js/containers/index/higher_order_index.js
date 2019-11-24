import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, getCurrentUser,getPost, getUserList,
         getUserProfile,getPostList,getQuestion,getReplyList,getReplyChildrenList,
         getQuestionList as _getQuestionList,getCommentList, getIndex }  from "../../dispatch/index"
import  * as action  from '../../actions/actionCreators';


import { ModalOptionsMenu } from "../../components/buttons";
import { DropImage } from "../../containers/profile/edit_profile";
import AppEditor  from '../../containers/editor'
import {store} from "../../configs/store-config";
import {history} from "../../index";
import {LocalCache} from  "../../utils/storage";

import Helper from '../../containers/utils/helpers';




const helper   = new Helper();


export function withHigherOrderIndexBox(Component) {

    return class HigherOrderIndexBox extends Component {
        _isMounted = false;

        constructor(props) {
            super(props);

            this.state = {
                currentUser        : {},
                cachedEntyties     : this.cachedEntyties(), 
                isAuthenticated    : this.isAuthenticated(),
                modalIsOpen        : false,
            };
            this.onStoreUpdate     = this.onStoreUpdate.bind(this);
             
        };


        isAuthenticated() {
      	    let cachedEntyties = this.cachedEntyties();
        
            if (cachedEntyties){
        	    let { auth  }  = cachedEntyties;
        	    if ( auth && auth.isLoggedIn && auth.tokenKey){
        		    return true
               	}
            }

            return false;
        };

        getCurrentUser =(currentUser=undefined)=>{
            let  cachedEntyties  = this.cachedEntyties();
        
            if (!currentUser && cachedEntyties) {
                currentUser  = cachedEntyties.currentUser
            }
            
            if (currentUser) {
                this.setState({currentUser})
            }
            return currentUser;  
        };

        cachedEntyties = ()=>{
            return JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
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
            this._isMounted = false;
            this.unsubscribe();
        };

        static getDerivedStateFromProps(props, state) {
           console.log(state)
           return null
        }

        
        onStoreUpdate = (params, callback=function(){}) =>{
 
            const onStoreChange = () => {
                
                let storeUpdate = store.getState();
                var timeStamp = new Date();
                let { entyties } = storeUpdate;
                let { currentUser, index, question, userProfile } = entyties

                let questionById = params && params.questionById
                question      =  entyties.question.byId[questionById];

                console.log(entyties, index)

                if (currentUser && currentUser.user) {

                    LocalCache('currentUser', currentUser.user)
                    this.getCurrentUser(currentUser.user)
                 
                }

                if (this._isMounted) {
                    this.forceUpdate()
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);

        };

        
      

        disableBack(e) {
            if (this.state.modalIsOpen) {
                e.returnValue = '';
            }

            e.preventDefault()
        }

        componentDidMount() {
            this._isMounted = true;
            this.onStoreUpdate() //Subscribe on store change    
      
            if (!this.isAuthenticated()) {
                //User is not authenticated,so redirect to authentication page.
                history.push('/user/registration/')
            }

            if(!this.getCurrentUser()){
        	    store.dispatch(getCurrentUser());
            }
        };


        logout = () => {
            localStorage.removeItem('@@CachedEntyties');

            if (this.isAuthenticated()) {
                localStorage.removeItem('@@CachedEntyties')
                history.push('/user/registration')

            }
            else{
        	   localStorage.removeItem('@@CachedEntyties')
               history.push('/user/registration')

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
      
        

        editfollowersOrUpVoters = (params) =>{
            params = this._getFormData(params);
            this.props.submit(params); 
        }

        _getFormData = (params) =>{
            let objName = params.objName;

            switch(objName){
                case 'Question':
                case 'UserProfile':
                case 'UsersList':
                    var followers     = params.obj.followers;
                    params['formData'] = helper.createFormData({ followers });
                    return params;

                default:
                    var upvotes       = params.obj.upvotes; 
                    params['formData'] = helper.createFormData({upvotes});
                    return params; 
            }

        }
     
        getProps(){

            let props = {
                logout                  : this.logout,
                editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
                ...this.state,
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
        showModal            : (props )     => dispatch(action.showModal(props)),
        hideModal            : (props )     => dispatch(action.hideModal(props)),  
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        entyties      : state.entyties,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps), withHigherOrderIndexBox )


export default  composedHoc;




