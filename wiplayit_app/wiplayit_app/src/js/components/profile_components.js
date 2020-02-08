import React from 'react';
import { Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import {history} from "../index" 


import Api from '../api';
import  * as types  from '../actions/types';


import { UnfollowUserBtn, FollowUserBtn, OptionsDropDownBtn} from "../components/buttons"; 

import{ QuestionComponent } from "../components/question_components"

import { PostComponent } from "../components/post_components"
import { GetModalLinkProps } from "../components/component-props";
import { AnswersComponent  } from "../components/answer_components";
import { 
    OptionsModalLink,
    EditorLink, 
    ChangeImageBtn,
    UsersModalLink } from "../components/modal-links";


const OptBtnSmallScreen   = MatchMediaHOC(OptionsModalLink, '(max-width: 980px)');
const OptBtnBigScreen     = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');
const EditorLinkBigScreen = MatchMediaHOC(EditorLink, '(min-width: 980px)') 
const api      = new Api();

   

 


export const ProfileComponent = props => {
    
    var profileById = props.profileById;
    var userProfile = props.entities.userProfile[profileById];
    userProfile     = userProfile && userProfile.user;

    //console.log(props, userProfile)
    let currentUser = props.currentUser;
     
    let profile = userProfile.profile;

    let apiUrl   = userProfile && api.getQuestionFollowersListApi(userProfile.id);
    let linkName = profile.followers > 1 && `${profile.followers} Followers` || `${profile.followers} Follower`;

    let userProfileFollowersProps = {
            apiUrl,
            byId      : `userProfileFollowers${userProfile.id}`,
            obj       : userProfile,
            currentUser,
            linkName  : linkName,
           
        };
    

    let optionsBtnStyles = {
              fontSize   : '8px',
              background : 'white',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }

            

    let editUserProfileProps = {
            objName     : 'UserProfile',
            isPut       : true,
            obj         : userProfile, 
            byId        : profileById,
            linkName    : 'Edit',
            currentUser,

    }

    editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);

    let EditorModalBtnBigScreen   = <EditorLinkBigScreen {...editUserProfileProps}/>;
    let MenuModalBtn              = <OptBtnSmallScreen {...editUserProfileProps}/>;
    let MenuDropdownBtn           = <OptBtnBigScreen {...editUserProfileProps}/>;

    const EditorModalBtnSmall = ()=>{
        
            return(
                <button className="btn-sm edit-user-profile"
                        onClick={()=>{
                            history.push(pathToEditProfile, {...editUserProfileProps}); 
                        }
                }>
                    Edit
                </button>
            )
    
    }

    let EditorModalBtnSmallScreen = MatchMediaHOC(EditorModalBtnSmall, '(max-width: 980px)')

    let UserProfileFollowersLink = profile.followers !== 0 &&  <UsersModalLink {...userProfileFollowersProps}/>; 

    let pathToUserFollowers =  userProfile && `/user/profile/${userProfile.slug}/${userProfile.id}/followers/`;
    const pathToEditProfile = `/edit/profile/${userProfile.slug}/${userProfile.id}/`;

    let btnsProps = {
        editUserProfileProps,
        btnStyles : optionsBtnStyles,
        btnText   : <i className="material-icons ">more_horiz</i>,  
    };

    Object.assign(btnsProps, props);

    var followers_text =  userProfile && userProfile.profile && userProfile.profile.followers > 1?
                                                                      'Followers' : 'Follower';  

    let UnfollowOrFollowUserBtn =  <FollowUserBtn {...btnsProps}/>;
   

    let ChangeImageBtnBigScreen = MatchMediaHOC(ChangeImageBtn, '(min-width: 980px)')

      
    const UserItemsComponent = props.userItemsComponent;   


    let  profile_picture = userProfile && userProfile.profile?
                           userProfile.profile.profile_picture : null;
                 
    console.log(props)
    
    return (
        <div className="profile-contents">
            <div className="profile">
                <div className="profile-box">
                    <div className="profile-section-top">
                        <div className="profile-img-container">
                            <div onMouseEnter={props.mouseEnter}
                                 onMouseLeave={props.mouseLeave} 
                                 className="profile-img-box">

                                { profile_picture? 
                                    <img alt="" src={`${profile_picture}`} className="profile-image"/>
                                    :
                                    <img alt="" src={require("../images/user-avatar.png")} className="profile-image"/>
                                }
                                
                            </div>
                            {props.isMouseInside && userProfile.user_can_edit?
                                <div
                                    onMouseEnter={props.mouseEnter}
                                    onMouseLeave={props.mouseLeave}
                                    className="edit-img-btn-box"
                                    >
                                    <ChangeImageBtnBigScreen {...editUserProfileProps}/>
                                </div>
                                :
                                null
                            }
                        </div>    

                                            
                        <div className="profile-credential-box">
                            <ul className="profile-name-box">
                                <li className="profile-name">
                                    { userProfile.first_name }  { userProfile.last_name } 
                                </li>

                                <li className="user-credential">
                                    {userProfile.profile.credential}
                                </li>
                               
                            </ul>

                            <div className="relation-box">
                                <div className="user-profile-followers-box">
                                    <div className="follow-user-profile-btn-box">
                                        { UnfollowOrFollowUserBtn }     
                                    </div>
                                    
                                </div>

                                <div className="user-profile-options-box">
                                    { MenuModalBtn }
                                    { MenuDropdownBtn }
                                </div>
                            </div>
                            
                        </div>

                    </div>
                                  

                </div>

                <div className="follow-teams"> 
                    <p></p>  
                </div>

            </div>
     
          
            <div className="credentials-container" >
                <div className="credentials-box">
                    <div className="credentials-menu">
                        <div className="about-box">
                            <p className="about">About</p>
                        </div>
                        
                        { userProfile && userProfile.user_can_edit?
                            <div className="edit-credential-btn-box">

                                {EditorModalBtnBigScreen }
                                <EditorModalBtnSmallScreen/>
                            </div>
                            :
                            ""
                        }
              
                    </div>

                    <div className="about-user-box">
                        <span  className="location-icon material-icons  ">location_on</span>
                        <p className="user-location">
                             Live {userProfile.profile.country },   {userProfile.profile.live } 
                        </p>
                    </div>
                  
                    <div className="about-user-box">
                        <p className="user-fav-quote">
                             Bio {userProfile.profile.favorite_quote }
                        </p>
                    </div> 
                </div>
        
                <div className="user-activities-box">
                    <UserActivitiesBtns {...props} />

                    <div className="answers-flex-box" id="activities-box">
                        <UserItemsComponent {...props}/>                    
                    </div>
                    
                </div> 
      
               <div className="teams-box">
               </div>
       
            </div>
        </div>
    );

};




export const UserList = props => {
    //console.log(props)
    let {entities,users, usersById } = props
    users   = entities && entities.users[usersById] || users[usersById];

    return (
      <div>
         { users && users.userList && users.userList.length?
         <div>
           {  users.userList.map(( user, index )  => {
               let userProps = {user  : user, objIndex:index};

               Object.assign(userProps, props);           
               return(
                    <div style={props.userListBoxStyles}
                         key={index}
                         className="user-list-container"
                         id="user-list-container">

                        <UsersComponent{...userProps}/>

                    </div>
                )
            }
      
          )}
        </div>
      :
      
      <div  className="default-user-box">
        <p>{props.error}</p>
      </div>   
      }

   </div>

  )
}






export const UserfollowersNum = props => {
   return (
      <Link to="" className="num-followers">
         {props.userProfile.profile.followers} Followers
      </Link>
   )
}







export const UserAnswers = props =>{
   var profileById    = props.profileById;
   let userProfile    = props.entities.userProfile[profileById];
   userProfile        = userProfile.user;
   var answerListById = `usersAnswers${userProfile.id}`
   var answers        = props.entities.answers;
   
   var usersAnswers   = answers[answerListById]
   //console.log(props, answers)
   
   return (
        <div>
            { usersAnswers && usersAnswers.answerList?

                <div className="answer-container">
                    <div className="number-answers-box">
                        {usersAnswers.answerList.length === 1? 
                            <p className="items-count">{ usersAnswers.answerList.length }  Answer</p>

                            :

                            <p className="items-count">{ usersAnswers.answerList.length } Answers</p>
                        }
                    </div> 

                    <div>
                        { usersAnswers.answerList.map((answer, index) => {
                            let answerProps = {answer, answerListById }
                            Object.assign(answerProps, props)

                            return(
                                <div key={answer.id} className="answer-contents profile-activites "> 
                                    <div className="question">
                                        <b className="answer-question">
                                            {answer.question.add_question}
                                        </b> 
                                    </div>

                                    <AnswersComponent {...answerProps}  />
                                </div>
                            )
                        }
                        )}
                    </div>

                </div>

                :
                <p>No Answers </p>
            }
        </div>
    )
};




export const UserQuestions = props => {
    var profileById = props.profileById;
    let userProfile = props.entities.userProfile[profileById];
    userProfile    = userProfile.user;

    let  questionListById     = `usersQuestions${userProfile.id}`
    let questions  = props.entities.questions;
    questions      = questions[questionListById]
    let questionList = questions && questions.questionList;  
    //console.log(questions,  props)
    
    return (
        <div className="question-container">
         <div className="number-question-box">
            {questionList && questionList.length? 
               <p className="items-count">{questionList.length } Questions</p>
               :
               <p className="items-count">{questionList.length } Question</p>
            }
         </div> 
     
         {  questionList && questionList.map((question, index) => {
            let questionProps = {question, questionListById }
            Object.assign(questionProps, props)
            return (
               <div key={question.id} className="profile-activites"> 
                  <QuestionComponent {...questionProps}/>
               </div>
            )

            }
           )}

        </div>
   )
};


export const UserPosts = props => {
   var profileById = props.profileById;
   let userProfile = props.entities.userProfile[profileById];
   userProfile    = userProfile.user;

   var postListById     = `usersPosts${userProfile.id}`;
   var posts  = props.entities.posts;
   posts      = posts[postListById]
   
   return(
     <div className="post-container">
         <div className="number-post-box">
            {posts.postList.length > 1? 
               <p className="items-count">{posts.postList.length } Posts</p>
               :
               <p className="items-count">{posts.postList.length } Post</p>
            }
         </div> 
      
         { posts.postList.map((post, index) => {
            let postProps = { post, postListById}
            Object.assign(postProps, props)
            return(
               <div key={index} className="profile-activites"> 
                  <PostComponent {...postProps}  />
               </div>
            )
         }

      )}
   </div>
 
   );
};

export const UsersComponent = props => {

    let {user, usersById, currentUser} = props

    let pathToProfile =  `/profile/${user.id}/${user.slug}/`;
    let profile_picture = user.profile.profile_picture;
    let profile = user.profile;
        
    let state    = { userProfile : user}
    
    let editUserProfileProps = {
            objName    : 'UsersList',
            isPut      : true,
            obj        : user, 
            byId       : usersById,
            currentUser,
            
    }

    editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);
    var btnsProps   = {...props, editUserProfileProps};
      
    let UnfollowBtn = MatchMediaHOC(UnfollowUserBtn, '(min-width: 980px)');
    let FollowBtn   = MatchMediaHOC(FollowUserBtn, '(min-width: 980px)');


    let unfollowOrFollowUserBtn =    <FollowBtn {...btnsProps}/>;
    

    return (
        <BrowserRouter>
        <div className="user-list-box">
            <div className="user-list-contents">
                <div className="user-list-img-box">
                    <div className="user-list-img">
                        <Link  to={{ pathname: pathToProfile,state,}}>  
                            { user && profile_picture? 
                                <img  src={`${profile_picture}`} alt="" className="user-list-photo"/> 
                                :
                                <img alt="" src={require("../images/user-avatar.png")} className="user-list-photo"/>  
            
                            }        
                        </Link>
                    </div>
                </div> 

                <div className="user-list-credentials-box">
                    <div className="user-list-credentials-contents">
                        <Link className="user-list-name" to={{ pathname: pathToProfile,state,}}>
                            { user.first_name }   {user.last_name }
                        </Link>

                        <div className="">
                            <p className="user-list-credentials">{ user.profile.credential }</p>
                        </div>
                    </div>

                </div>

                <div className="user-list-follow-box" >
                    <div className="follow-user-list-box">
                        <FollowBtn {...btnsProps}/>
                    </div>
                </div>

            </div>
        </div>
        </BrowserRouter>
    );
   
};



export const UserFollowings = props => {
   var profileById = props.profileById;
   let userProfile = props.entities.userProfile[profileById];
   userProfile    = userProfile.user;

   var usersById   = `usersFollowings${userProfile.id}`;
   var users       = props.entities.users[usersById];
   //console.log(users,usersById, props.entyties)
   let userListProps = { usersById };

   Object.assign( userListProps, props);

   return (
      <div>
         { users?
            <div>
               { users.userList.length === 0?
                 <p>No Followings Yet</p>
                 : 
                 <div>
                     <div className="number-answers-box">
                        { users.userList.length > 1? 
                           <p className="items-count">{ users.userList.length }  Followings</p>
                           :
                           <p className="items-count">{ users.userList.length } Following</p>
                        }
                     </div> 
                     <UserList {...userListProps }/>
                  </div>
               }
            </div>
            :
            ""   
         }  
      </div>
   
   );
};



export const UserFollowers = props => {
   var profileById = props.profileById;
   let userProfile = props.entities.userProfile[profileById];
   userProfile    = userProfile.user;

   var usersById   = `usersFollowers${userProfile.id}`
   var users       = props.entities.users[usersById];

   let userListProps = { usersById };
  
   Object.assign( userListProps, props);

   return (
      <div>
         { users?
            <div>
               { users.userList.length === 0?
                  <p>No Followers Yet</p>
                    :
                  <div>
                     <div className="number-answers-box">
                        { users.userList.length > 1? 
                           <p className="items-count">{ users.userList.length }  Followings</p>
                             :
                           <p className="items-count">{ users.userList.length } Following</p>
                        }
                     </div> 
                     <UserList {...userListProps}/>
                  </div>
               }
            </div>
            :
            ""
         }
      </div>
   );
};


export const UserActivitiesBtns = props => {
    var profileById = props.profileById;
    var userProfile = props.entities.userProfile[profileById];
    var userProfile = userProfile.user;

    //console.log(userProfile)

    var usersAnswers = {
      component      : UserAnswers,
      byId           : `usersAnswers${userProfile.id}`,
      data           :  userProfile.answers,
      items          : 'isUsersAnswers',

    }
   
    var usersQuestions = {
      component        : UserQuestions,
      byId             : `usersQuestions${userProfile.id}`,
      data             :  userProfile.questions, 
      items            : 'isUsersQuestions',
     }

    var usersPosts = {
      component      : UserPosts,
      byId           : `usersPosts${userProfile.id}`,
      data           :  userProfile.posts,
      items          : 'isUsersPosts',
    }
   
    var usersFollowers = {
      component          : UserFollowers,
      byId               : `usersFollowers${userProfile.id}`,
      data               :  userProfile.followers,
      items              : 'isUsersFollowers'
    }


    var usersFollowings = {
      component           :  UserFollowings,
      byId                :  `usersFollowings${userProfile.id}`,
      data                :   userProfile.followings,
      items               : 'isUsersFollowings'
    }

    let totalAnswers   = userProfile && userProfile.answers && userProfile.answers.length || 0;
    let totalQuestions = userProfile && userProfile.questions && userProfile.questions.length || 0;
    let totalPosts     = userProfile && userProfile.posts && userProfile.posts.length || 0;
    let totalFollowers = userProfile && userProfile.followers && userProfile.followers.length || 0;
    let totalFollowings = userProfile && userProfile.followings && userProfile.followings.length || 0;

    
    
    return (
        <div className="user-activities">

            <button type="button" onClick={() => props.showUserItems(usersAnswers)} 
                             className="btn-sm activities user-answers" >
                { totalAnswers } {totalAnswers <= 1? "Answer":"Answers"}
            </button>

            <button type="button" onClick={() => props.showUserItems(usersQuestions)} 
                        className="btn-sm activities user-questions" >
                { totalQuestions } {totalQuestions <= 1? "Question":"Questions"}
            </button>

            <button type="button" onClick={() => props.showUserItems(usersPosts)} 
                               className="btn-sm activities user-posts">
               { totalPosts } {totalPosts <= 1? "Post":"Posts"}
            </button> 

            <button type="button" onClick={() => props.showUserItems(usersFollowings)} 
                            className="btn-sm activities user-following ">
                { totalFollowings } {totalFollowings <= 1? "Following":"Followings"}
            </button>
         
            <button type="button" onClick={() => props.showUserItems(usersFollowers)} 
                            className="btn-sm activities user-followers " >
               { totalFollowers } {totalFollowers <= 1? "Follower":"Followers"}        
            </button>

        </div>
    );
};






export const UserComponentSmall = props => {
   let pathToProfile =  `/profile/${props.user.id}/${props.user.slug}/`;
   let state = {currentUser:props.currentUser, userProfile:props.user}
   //console.log(props)
   return (

      <ul className="user-items" >
               <li className="img-container-sm">
                  <Link  to={ {pathname: pathToProfile,state}}>

                     { props.user.profile.profile_picture === null?
                        <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/>
             
                        :  
                        <img alt="" src={props.user.profile.profile_picture}
                                   className="profile-photo"/> 
                     }
                  </Link>

               </li>
               
               <li className="user-name-link">
                  <Link className="profile-user-name" to={ {pathname: pathToProfile,state}}>
                     { props.user.first_name}     { props.user.last_name }
                  </Link>
               </li>


            </ul>
      )
} 








