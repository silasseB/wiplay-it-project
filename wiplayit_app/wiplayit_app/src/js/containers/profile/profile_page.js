import React, { Component } from 'react';
import {  Link,Route } from "react-router-dom";

import { ModalManager } from 'react-dynamic-modal';
import {CustomModal} from "../../containers/modal-conf";

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";

import  * as action  from '../../actions/actionCreators';
import {LocalCache} from  "../../utils/storage";
import { ProfileComponent, UserAnswers } from "../../components/profile_components";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import {store} from "../../configs/store-config";

import  AjaxLoader from "../../components/ajax-loader";






class ProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userItemsComponent : UserAnswers,
            isProfileBox       : true,
            pageName           : "Profile", 
            profileById        : '',
        } 

        this.redirectToEdit =  this.redirectToEdit.bind(this);
    };

    

    onProfileUpdate = () =>{
 
        const onStoreChange = () => {

            let { slug, id } = this.props.match.params;
            let storeUpdate  = store.getState();
            let {entyties }  = storeUpdate;
            let profileById  =  id? `userProfile${id}`:null;

            let userProfile  = profileById? entyties.userProfile.byId[profileById]:null;

            if (userProfile && userProfile.user) {
                userProfile = userProfile.user;

                if (userProfile.answers) {

                    //let userProfileAnswerParams =  this._userProfileAnswerParams(userProfile)
                    //this.showUserItems(userProfileAnswerParams)

                    this._dispatchUserProfileItems(userProfile);
                    LocalCache('userProfile', userProfile);
                }
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
  
  

    componentWillUnmount() {
            this.unsubscribe();
    };
   

    componentDidMount() {
        this.onProfileUpdate();
        
        let { cachedEntyties } = this.props;
        let { slug, id } = this.props.match.params;

        if (id) {
            
            var profileById = `userProfile${id}`;
            this.setState({profileById});
            
            let  {userProfile, currentUser, auth} = cachedEntyties;

                                    
            if (!userProfile) {
                this.props.getUserProfile(id);
                
            }else{
               console.log('userProfile found from cachedEntyties')
               store.dispatch(action.getUserProfilePending(id));
               store.dispatch(action.getUserProfileSuccess(userProfile));
               this._dispatchUserProfileItems(userProfile);
            }
        }
    };

    _dispatchUserProfileItems(userProfile){
        let answers      = this.props.entyties.answers;

        if (userProfile && userProfile.answers && userProfile.answers.length) {
            var byId         =`usersAnswers${userProfile.id}`;
            answers          = answers.byId[byId]
            var usersAnswers = userProfile.answers;

            if (!answers) {
                store.dispatch(action.getAnswerListPending(byId));
                store.dispatch(action.getAnswerListSuccess(byId, usersAnswers));
           }
        }

    }

    _userProfileAnswerParams=(userProfile)=>{
        if (userProfile) {

            return  {
                component      :  UserAnswers,
                byId           : `usersAnswers${userProfile.id}`,
                data           :  userProfile.answers,
                items          : 'isUsersAnswers',
            }  
        }
    }

   
    showUserItems(params) {
        let {items, component, byId, data } = params;
        this.setState({userItemsComponent : component})

        switch(items){
            case 'isUsersAnswers':

                store.dispatch(action.getAnswerListPending(byId));
                store.dispatch(action.getAnswerListSuccess(byId, data));
                return;


            case 'isUsersQuestions':

                store.dispatch(action.getQuestionListPending(byId));
                store.dispatch(action.getQuestionListSuccess(byId, data));
                return;
            
            case 'isUsersPosts':

                store.dispatch(action.getPostListPending(byId));
                store.dispatch(action.getPostListSuccess(byId, data));
                return;
         
            case 'isUsersFollowings':
                console.log(data, items)
                store.dispatch(action.getUserListPending(byId));
                store.dispatch(action.getUserListSuccess(byId, data));
                return;

            case 'isUsersFollowers':
                store.dispatch(action.getUserListPending(byId));
                store.dispatch(action.getUserListSuccess(byId, data));  
                return;  

            default:
                console.log(data, items)
                return;  
        };
    };


    redirectToEdit(params){

        ModalManager.close();
        console.log(this.props)
        this.props.history.push(params.pathToEditProfile, params.state)
    };    

    getProps(){

        let props = {
            pageName           : this.state.pageName,
            userItemsComponent : this.state.userItemsComponent,
            showUserItems      : this.showUserItems.bind(this),
            isProfileBox       : this.state.isProfileBox, 
            redirectToEdit     : this.redirectToEdit,
            profileById        : this.state.profileById,
        };

        return Object.assign(props, this.props);
    };
  

  
    render() {
        let   props = this.getProps();
        var   profileById = props.profileById;
        const userProfile = props.entyties.userProfile.byId[profileById];
      
          

        return (
           <div id="profile-page">
           
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />

               { userProfile?
                    <div>
                        {userProfile.isLoading?
                            <div className="page-spin-loder-box">
                                 <AjaxLoader/>
                            </div>

                            :
                            <div>
                               <ProfileComponent {...props}/> 
                            </div>
                        }
                    </div>

                    :
                    ""
                }
            </div>
        );
    };
};




export default withHigherOrderIndexBox(ProfilePage);








export const ModalLink = (props) =>{
    return(
        <div>
        <Link to={`${props.match.url}edit`}>Edit Profile</Link>

        <Route
          path={`${props.match.url}edit`}
          render={() => {
            return (
              <Modal
                onClick={() => {
                  props.history.push(props.match.url);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: '100%'
                  }}
                >
                  Edit Profile Modal!
                </div>
              </Modal>
            );
          }}
        />
      </div>
        )
}





