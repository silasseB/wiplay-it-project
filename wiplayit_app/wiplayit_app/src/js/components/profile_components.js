import React from 'react';
import { Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';


import Api from '../api';
import  * as types  from '../actions/types';


import { UnfollowUserBtn, FollowUserBtn, OpenModalButton,
       EditUserDropDownbutton } from "../components/buttons"; 

import{ QuestionComponent } from "../components/question_components"

import{ PostComponent } from "../components/post_components"
import { GetModalLinkProps } from "../components/component-props";
import { OptionsModalLink} from "../components/modal-links"

import  { AnswersComponent } from "../components/answer_components";


const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
const OptBtnBigScreen = MatchMediaHOC(EditUserDropDownbutton, '(min-width: 800px)');
const api      = new Api();



export const ProfileComponent = props => {
    console.log(props)
    var profileById = props.profileById;
    var userProfile = props.entyties.userProfile.byId[profileById];
    userProfile = userProfile.user;
    let currentUser = props.currentUser;
     
    let  state = {
         usersIsFor : 'userProfileFollowers',
         userProfile 
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
            objName    : 'UserProfile',
            isPut      : true,
            obj        : userProfile, 
            byId        : profileById,
            currentUser,

      }

      editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);
      let MenuModalLink   = <OptionsModalLink {...editUserProfileProps}/>;
      
      let pathToUserFollowers =  `/profile/${userProfile.slug}/${userProfile.id}/followers/`;

      let btnsProps = {
         editUserProfileProps,
         btnStyles:optionsBtnStyles,
         btnText : <i className="material-icons ">more_horiz</i>,  
      };

      Object.assign(btnsProps, props);

      var followers_text =   userProfile.profile.followers > 1? 'Followers' : 'Follower'  


      let userProfileFollowers = <Link to={{ pathname : pathToUserFollowers ,state }}>
                                    { userProfile.profile.followers}   {followers_text}

                                </Link>;

        let unfollowOrFollowUserBtn =  userProfile.user_is_following? 
                                         <UnfollowUserBtn {...btnsProps} />
                                       :
                                         <FollowUserBtn {...btnsProps}/>;

        
      
      let optionsBtn =  <div>
                        <OptBtnSmallScreen {...btnsProps}/> 
                        <OptBtnBigScreen {...props}/>
                     </div>;

      const UserItemsComponent = props.userItemsComponent;   


      let  profile_picture = userProfile && userProfile.profile?
                         userProfile.profile.profile_picture:null;
                 

      return (
      
      <div>
         <div className="profile-contents">
            <div className="profile">
               <div className="profile-box">
                  <div className="profile-section-top">
                 
                     <div className="img-box">
                     { profile_picture? 
                       <img alt="" src={`${profile_picture}`} className="profile-image"/>

                      :
                        <img alt="" src={require("../images/user-avatar.png")}
                                     className="profile-image"/>
                     }
                     </div>
                        <p className="user-name">
                          {userProfile.first_name}  {userProfile.last_name} 
                       </p>
                  </div>
                
                  <div className="profi-credential-container"> 
                     <div className="profi-credential-box">
                        
                        <p className="user-credential">{userProfile.profile.credential}</p>
                     </div>
                   
                     <div className="relation-box">
                      {  userProfile.email === props.currentUser.email?
                        
                           <div className="num-followers-box inline">
                              {userProfileFollowers}
                           </div>

                        :
                        
                        <div className="f-box">
                         { unfollowOrFollowUserBtn }     
                        </div>

                        }
                        
                           
                        <div className="user-relation-box">
                           <div className="prof-option options-box">
                              {MenuModalLink}
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
      </div>


   )

}




export const UserList = props => {
    console.log(props)
    var usersById = props.usersById;
    const users   = props.entyties.users.byId[usersById];

    return (
      <div>
         { users.userList.length?
         <div>
           { users.userList.map(( user, index )  => {
               let userProps = {user  : user, objIndex:index};

               Object.assign(userProps, props);           
               return(
                  <div  key={index} className="user-list-box">
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
   let userProfile    = props.entyties.userProfile.byId[profileById].user;
   var byId           = `usersAnswers${userProfile.id}`
   var answers        = props.entyties.answers;
   
   var usersAnswers   = answers.byId[byId]

   
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
                            let answerProps = {answer}
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
   let userProfile = props.entyties.userProfile.byId[profileById].user;
   var byId     = `usersQuestions${userProfile.id}`
   var questions  = props.entyties.questions;
   questions      = questions.byId[byId]
   console.log(questions, byId, props)
    
   return (
      <div className="question-container">
         <div className="number-question-box">
            { questions.questionList.length? 
               <p className="items-count">{questions.questionList.length } Questions</p>
               :
               <p className="items-count">{questions.questionList.length } Question</p>
            }
         </div> 
     
         {  questions.questionList.map((question, index) => {
            let questionProps = {question, questionById : byId }
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
   let userProfile = props.entyties.userProfile.byId[profileById].user;
   var byId     = `usersPosts${userProfile.id}`
   var posts  = props.entyties.posts;
   posts      = posts.byId[byId]
   
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
            let postProps = { post, postById : byId}
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
    let {user, usersById} = props

    let pathToProfile =  `/profile/${user.id}/${user.slug}/`;
    let profile_picture = user.profile.profile_picture;
      
    console.log(profile_picture)

    let state        = { userProfile : user}

    let followBtnProps = {
         objName     : 'usersList',
         actionType  : types.UPDATE_USER_LIST,
         isPut       : true,
         obj         : user.profile, 
         objId       : user.id,
         apiUrl      : api.updateProfileApi(user.id),
         byId        : props.usersById,
      };
      var btnsProps = {followBtnProps}
      
   Object.assign(btnsProps, props)


   let unfollowOrFollowUserBtn =    user.user_is_following? 
                                         <UnfollowUserBtn {...btnsProps} />
                                       :
                                         <FollowUserBtn {...btnsProps}/>;
   return (
      <div className="user-container-sm">
         <div className="user-box-sm">
            <div className="user-box">
               <div className="img-container-s">
                  <div className="img-box-s user-img">
          <Link  to={{ pathname: pathToProfile,state,}}>  
          {user && profile_picture? 
            <img  src={`${profile_picture}`} alt="" className="user-photo"/> 

               
            :
             <img alt="" src={require("../images/user-avatar.png")} className="user-photo"/>  
            
            }       
          </Link>
        </div>
      </div> 

      <div className="user-name-box">

        <Link className="profile-name" to={{ pathname: pathToProfile,state,}}>

          {user.first_name }   {user.last_name }
          {user.followed }
        </Link>

        <div className="user-credentials">
         <p> {user.profile.followers } Followers</p>
          <p className="relatio about-user"></p>
        </div>

      </div>

    </div>
    
    <div className="follow-box" >
         { user.email !== props.currentUser.email?
            <div className="follow-btn-sm">
               { unfollowOrFollowUserBtn }
            </div>
         :
            ""
         } 

    </div>

  </div>
</div>


  )
   
}



export const UserFollowings = props => {
   var profileById = props.profileById;
   let userProfile = props.entyties.userProfile.byId[profileById].user;
   var usersById   = `usersFollowings${userProfile.id}`;
   var users       = props.entyties.users.byId[usersById];
    console.log(users,usersById, props.entyties)
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
   let userProfile = props.entyties.userProfile.byId[profileById].user;
   var usersById   = `usersFollowers${userProfile.id}`
   var users       = props.entyties.users.byId[usersById];

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
    var userProfile = props.entyties.userProfile.byId[profileById];
    var user        = userProfile.user;

    console.log(userProfile)

    var usersAnswers = {
      component      : UserAnswers,
      byId           : `usersAnswers${user.id}`,
      data           :  userProfile.answers,
      items          : 'isUsersAnswers',

    }
   
    var usersQuestions = {
      component        : UserQuestions,
      byId             : `usersQuestions${user.id}`,
      data             :  userProfile.questions, 
      items            : 'isUsersQuestions',
     }

    var usersPosts = {
      component      : UserPosts,
      byId           : `usersPosts${user.id}`,
      data           :  userProfile.posts,
      items          : 'isUsersPosts',
    }
   
    var usersFollowers = {
      component          : UserFollowers,
      byId               : `usersFollowers${user.id}`,
      data               :  userProfile.followers,
      items              : 'isUsersFollowers'
    }


    var usersFollowings = {
      component           :  UserFollowings,
      byId                :  `usersFollowings${user.id}`,
      data                :   userProfile.followings,
      items               : 'isUsersFollowings'
    }
   
    return (
        <div className="user-activities">

            <button type="button" onClick={() => props.showUserItems(usersAnswers)} 
                             className="btn-sm activities user-answers" >
                Answers { userProfile.answers.length } 
            </button>

            <button type="button" onClick={() => props.showUserItems(usersQuestions)} 
                        className="btn-sm activities user-questions" >
               Questions { userProfile.questions.length } 
            </button>

            <button type="button" onClick={() => props.showUserItems(usersPosts)} 
                               className="btn-sm activities user-posts">
               { userProfile.posts.length }  Posts   
            </button> 

            <button type="button" onClick={() => props.showUserItems(usersFollowings)} 
                            className="btn-sm activities user-following ">
                { userProfile.followings.length } Followings
            </button>
         
            <button type="button" onClick={() => props.showUserItems(usersFollowers)} 
                            className="btn-sm activities user-followers " >
               { userProfile.followers.length }  Followers        
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








