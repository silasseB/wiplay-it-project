import React, { Component } from 'react';

import { ModalManager } from 'react-dynamic-modal';

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";

import  * as action  from '../../actions/actionCreators';

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

    componentDidUpdate(nextProps, prevProps){ 
        var profileById = this.state.profileById;
        const userProfile = nextProps.entyties.userProfile.byId[profileById];

      
        if (userProfile) {
            console.log(userProfile)
            var answers      = nextProps.entyties.answers;
            console.log(answers)

            if (userProfile && userProfile.user) {
                var byId         =`usersAnswers${userProfile.user.id}`;
                answers          = answers.byId[byId]
                var usersAnswers = userProfile.answers;

                if (!answers) {
                   store.dispatch(action.getAnswerListPending(byId));
                   store.dispatch(action.getAnswerListSuccess(byId, usersAnswers));
                }
            }
        }
    };
  
  

    componentDidMount() {
        
        
        let { slug, id } = this.props.match.params;

        if (id) {
            
            var profileById = `userProfile${id}`;
            this.setState({profileById});
         
            const userProfile = this.props.entyties.userProfile.byId[profileById];
            console.log(userProfile)

            if (!userProfile) {
                this.props.getUserProfile(id);
            }
        }
    };

   
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

                            <ProfileComponent {...props}/> 
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








