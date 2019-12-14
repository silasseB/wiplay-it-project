import React, { Component } from 'react';
import {  Link,Route } from "react-router-dom";

import {history} from "../../index" 

import {ModalManager} from "../../containers/modal/modal_container";

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";

import  * as action  from '../../actions/actionCreators';
import {LocalCache} from  "../../utils/storage";
import { ProfileComponent, UserAnswers } from "../../components/profile_components";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import {store} from "../../configs/store-config";

import  AjaxLoader from "../../components/ajax-loader";






class UserProfileContainer extends Component {

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
            let {entities }  = storeUpdate;
            let profileById  =  id? `userProfile${id}`:null;

            let userProfile  = profileById? entities.userProfile[profileById]:null;

            if (userProfile && userProfile.user) {
                userProfile = userProfile.user;
                console.log(userProfile)

                //this._dispatchUserProfileItems(userProfile);

                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
  
  

    componentWillUnmount() {
            this.unsubscribe();
    };
   

    componentDidMount() {
        this.onProfileUpdate();
        
        let { cacheEntities } = this.props;
        let { slug, id } = this.props.match.params;
        let  profileById = `userProfile${id}`;

        if (cacheEntities) {
            let { userProfile, currentUser} = cacheEntities;
            userProfile = userProfile && userProfile[profileById]

            if(userProfile){
                var curentTimeStamp = new Date();

                let timeStamp = userProfile.timeStamp;
                console.log(timeStamp)

                let msDiff   = curentTimeStamp.getTime() - timeStamp
                let secDiff  = msDiff / 1000
                let menDiff  = secDiff / 60
                let hourDiff = menDiff/60
                let dayDiff  = hourDiff/24

                console.log(parseInt(menDiff)  + ' ' + 'menutes ago')
        
                profileById = `userProfile${id}`;
                this.setState({profileById })
        
                console.log('userProfile found from cachedEntyties')
                store.dispatch(action.getUserProfilePending(profileById));

                store.dispatch(action.getUserProfileSuccess( profileById, userProfile));

                this._dispatchUserProfileItems(userProfile);
                this.forceUpdate()
                return
                
            }
        }

        this.setState({profileById })
        this.props.getUserProfile(id);

    };

    _dispatchUserProfileItems(userProfile){
        console.log(userProfile)
        let answers      = this.props.cacheEntities.answers;

        if (userProfile && userProfile.answers && userProfile.answers.length) {
            var byId         =`usersAnswers${userProfile.id}`;
            answers          = answers[byId]
            var usersAnswers = userProfile.answers;

            if (usersAnswers) {
                console.log(usersAnswers)
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
        history.push(params.pathToEditProfile)
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
        const userProfile = props.entities.userProfile[profileById];
      
        console.log(userProfile)  

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




export default withHigherOrderIndexBox(UserProfileContainer);









