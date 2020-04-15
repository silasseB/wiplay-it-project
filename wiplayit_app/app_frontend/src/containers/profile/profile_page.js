import React, { Component } from 'react';
import {  Link,Route } from "react-router-dom";

import {history} from "App" 

import {ModalManager} from "containers/modal/modal_container";
import { getUserList }  from "dispatch/index"

import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";

import  * as action  from 'actions/actionCreators';
import { ProfileComponent, UserAnswers } from "components/profile_components";
import withHigherOrderIndexBox from "containers/index/higher_order_index";
import { UnconfirmedUserWarning } from "components/partial_components";

import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';
import  AjaxLoader from "components/ajax-loader";






class UserProfileContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userItemsComponent : UserAnswers,
            isProfileBox       : true,
            pageName           : "Profile", 
            profileById        : '',
            usersById          : 'filteredUsers',
            isMouseInside      : false,
            userItemsStyles    : {},  
        } 

    };

    

    onProfileUpdate = () =>{
        console.log(this.props)    
        const onStoreChange = () => {

            let { slug, id } = this.props.match.params;
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let profileById  =  id? `userProfile${id}`:null;
            let answers      = entities.answers;

            let userProfile  = profileById? entities.userProfile[profileById]:null;

            if (userProfile && userProfile.user) {

                userProfile = userProfile.user;
                let answersById  = `usersAnswers${userProfile.id}`;
                answers          = answers[answersById];
                //console.log(userProfile)

                if (!answers) {
                    //console.log(userProfile, answers)

                    this._dispatchUserProfileItems(userProfile);
                }

                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
  
  

    componentWillUnmount() {
            this.unsubscribe();
    };
    componentDidUpdate(prevProps, nextProps){
        console.log(nextProps, this.props)
        //this.props.reloadPage()
        let { slug, id }  = this.props.match.params;
        let profileById   = `userProfile${id}`;
        let {state} = this;
        let byId    =  state.profileById; 

        if (byId && byId !== profileById) {
            console.log(byId, profileById )

            this.setState({profileById });
            this.updateWithCacheData({profileById, id});
            this.updateUsersStore();
        }


    }

    componentDidMount() {
        this.onProfileUpdate();
        
        let { entities }    = this.props;
        let { slug, id }   = this.props.match.params;
        let {users, userProfile}  = entities; 

        let  profileById  = `userProfile${id}`;
               
        userProfile = userProfile && userProfile[profileById];
        this.setState({profileById })

        !userProfile  &&  this.updateWithCacheData({profileById, id});
        !users['filteredUsers']        &&  this.updateUsersStore();
                     
    };

    updateUsersStore(params){
        let { cacheEntities } = this.props;
        let usersById     = 'filteredUsers';
        let { users }     = cacheEntities && cacheEntities;
        users             = users && users[usersById];

        if (users && users.userList) {
            store.dispatch(action.getUserListPending(usersById))
            store.dispatch(action.getUserListSuccess(usersById, users.userList))
            return

        }

        store.dispatch(getUserList({usersById}))
        return
    }

    updateWithCacheData(params){
        let { cacheEntities }        = this.props;
        let { profileById, id }      = params;
        let { usersById }            = this.state;
        let { userProfile, users }   = cacheEntities

        userProfile = userProfile && userProfile[profileById];
        

        //console.log(users, userProfile)

        if (userProfile && userProfile.user) {

            let timeStamp      = userProfile.timeStamp;
            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = parseInt(getTimeState.menutes());

            //console.log(parseInt(menDiff)  + ' ' + 'menutes ago')
            //console.log(menDiff <= 3)

            if ( menDiff <= 3) {
                //userProfile = userProfile && userProfile.user;

                console.log('userProfile found from cachedEntyties')
                                
                store.dispatch(action.getUserProfilePending(profileById));
                store.dispatch(action.getUserProfileSuccess( profileById, userProfile.user));
                this._dispatchUserProfileItems(userProfile.user);

                return 
            }
        }

        console.log('Fetching userProfile from the server')
        id && this.props.getUserProfile(id);

        return
    };

    _dispatchUserProfileItems(userProfile){
        //console.log(userProfile)
        let answers      = this.props.cacheEntities.answers;


        if (userProfile && userProfile.answers && userProfile.answers.length) {
            var byId         =`usersAnswers${userProfile.id}`;
            
            var usersAnswers      = userProfile.answers;
            let  answersBtnStyles = this._userActivitesStyle();
            let userItemsStyles   = {answersBtnStyles};
            this.setState({userItemsStyles})

            if (usersAnswers) {

                ///console.log(usersAnswers, answers)
                store.dispatch(action.getAnswerListPending(byId));
                store.dispatch(action.getAnswerListSuccess(byId, usersAnswers));
            }
        }

    }

    _userProfileAnswerParams = (userProfile)=>{
        if (userProfile) {

            return  {
                component      :  UserAnswers,
                byId           : `usersAnswers${userProfile.id}`,
                data           :  userProfile.answers,
                items          : 'isUsersAnswers',
            }  
        }
    }

    _userActivitesStyle = ()=>{
        return {
            borderBottom : '2px solid #A33F0B',
            opacity      : '0.60',
        }
    }

   
    showUserItems(params) {
        //console.log(params)
        let {items, component, byId, data } = params;
        this.setState({userItemsComponent : component});

        let userItemsStyles; 

        switch(items){
            case 'isUsersAnswers':
                let  answersBtnStyles = this._userActivitesStyle();
                userItemsStyles       = {answersBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch(action.getAnswerListPending(byId));
                store.dispatch(action.getAnswerListSuccess(byId, data));
                return;


            case 'isUsersQuestions':
                let  questionsBtnStyles = this._userActivitesStyle();
                userItemsStyles         = {questionsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch(action.getQuestionListPending(byId));
                store.dispatch(action.getQuestionListSuccess(byId, data));
                return;
            
            case 'isUsersPosts':
                let  postsBtnStyles = this._userActivitesStyle();
                userItemsStyles     = {postsBtnStyles};
                this.setState({userItemsStyles})

                store.dispatch(action.getPostListPending(byId));
                store.dispatch(action.getPostListSuccess(byId, data));
                return;
         
            case 'isUsersFollowings':
                let  followingsBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followingsBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch(action.getUserListPending(byId));
                store.dispatch(action.getUserListSuccess(byId, data));
                return;

            case 'isUsersFollowers':
                let  followersBtnStyles = this._userActivitesStyle();
                userItemsStyles          = {followersBtnStyles};
                this.setState({userItemsStyles})
                store.dispatch(action.getUserListPending(byId));
                store.dispatch(action.getUserListSuccess(byId, data));  
                return;  

            default:
                //console.log(data, items)
                return;  
        };
    };

    mouseEnter = () =>{
        //alert('Mouse is entering')
        this.setState({isMouseInside: true})
    } 


    mouseLeave = ()=>{
        //alert('Mouse is leaving')
        this.setState({isMouseInside : false})
    } 


       

    getProps(){

        let props = {
            showUserItems      : this.showUserItems.bind(this),
            mouseEnter         : this.mouseEnter,
            mouseLeave         : this.mouseLeave,
            ...this.state, 
        };

        return {...this.props, ...props};
    };
  

  
    render() {
        let   props = this.getProps();
        var   profileById = props.profileById;
        const userProfile = props.entities.userProfile[profileById];
        //console.log(userProfile, profileById)
      
        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />

                { userProfile?
                    <div  className="app-box-container">
                        <UnconfirmedUserWarning {...props}/> 
                        {userProfile.isLoading?
                            <div className="page-spin-loader-box">
                                 <AjaxLoader/>
                            </div>

                            :
                            <div className="profile-page" id="profile-page">
                               <ProfileComponent {...props}/> 
                              
                            </div>
                        }
                    </div>

                    :
                    null

                }
            </div>
        );
    };
};




export default withHigherOrderIndexBox(UserProfileContainer);









