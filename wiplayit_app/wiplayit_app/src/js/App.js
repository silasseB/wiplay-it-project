import React from 'react';

import {
  Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  
} from "react-router-dom";

import { withRouter } from "react-router";


import  RegistrationPage  from "./containers/authentication/registration";
import  SignUpPage from "./containers/authentication/signup";
import  LoginPage from "./containers/authentication/login";

import EditProfile from "./containers/profile/edit_profile";
import IndexBox from "./containers/index/index_page";
import PostListPage from "./containers/post/post_list"
import  PostPage    from "./containers/post/post_page"
import  QuestionPage    from "./containers/question/question_page"
import QuestionListPage from "./containers/question/question_list"
import UserProfileContainer from "./containers/profile/profile_page";
import  PasswordChangePage from "./containers/authentication/password_change_page";
import EmailResendPage    from "./containers/authentication/email_resend_page"
import PasswordResetPage   from "./containers/authentication/password_reset_page"
import {Modal}   from  "./containers/modal/modal-conf";
import { ModalManager}   from  "./containers/modal/modal_container";

import AccountConfirmationPage from "./containers/authentication/account_confirmation_page"
import UserListBox from "./containers/users/user_list_page"; 
import ProfileFollowersBox from "./containers/users/profile-followers-page"; 
import ProfileFollowingsBox from "./containers/users/profile-followings-page"; 
import QuestionFollowersBox from "./containers/users/question-followers-page"; 
import AnswerUpVotersBox  from "./containers/users/answer-upvoters-page"; 
import AnswerCommentUpVotersBox  from "./containers/users/answer-comment-upvoters-page"; 
import AnswerReplyUpVotersBox  from "./containers/users/answer-reply-upvoters-page"; 
import PostUpVotersBox  from "./containers/users/post-upvoters-page"; 
import PostCommentUpVotersBox  from "./containers/users/post-comment-upvoters-page"; 
import PostReplyUpVotersBox  from "./containers/users/post-comment-upvoters-page"; 


let GetModalRouter = (background)=>{
    let location = useLocation();
    let state = location && location.state;
    return <Route path="/compose/:context/:id/" children={<Modal {...state}/> }/>  
}




function App() {
  let location = useLocation();
  let background = location.state && location.state.background;
  
  let ModalRouter = GetModalRouter(background)

    /*if (!background) {
        
        setTimeout(()=> {
        ModalManager.close(); 
        }, 500);
    }*/
  
    return (
        <div>
        <Switch location={background || location}>
            <Route exact path="/" children={<IndexBox/>}/>
                   
            <Route  path="/profile/:id/:slug/" component={UserProfileContainer}/>
            <Route  path="/question/:slug/:id/" component={QuestionPage}/>
            <Route  path="/user/registration/" component={RegistrationPage} />
            <Route  path="/user/signup/" component={SignUpPage} />
            <Route  path="/user/login/" component={LoginPage} />
            <Route  path="/posts/" component={PostListPage} />
            <Route  path="/questions/" component={QuestionListPage} />
            <Route  path="/post/:slug/:id/" component={PostPage} />
            <Route  path="/edit/profile/:slug/:id/" component={EditProfile} />
            <Route  path="/followers/:id/:slug/" component={QuestionFollowersBox} />
            <Route  path="/answer/:id/upvoters/" component={AnswerUpVotersBox} />
            <Route  path="/answer/comment/:id/upvoters/" component={AnswerCommentUpVotersBox} />
            <Route  path="/answer/reply/:id/upvoters/" component={AnswerReplyUpVotersBox} />
            <Route  path="/post/:id/upvoters/" component={PostUpVotersBox} />
            <Route  path="/post/comment/:id/upvoters/" component={PostCommentUpVotersBox} />
            <Route  path="/post/reply/:id/upvoters/" component={PostReplyUpVotersBox} />
            <Route  path="/modal/router/" component={Modal} />
            <Route  path="/user/profile/:slug/:id/followers/" component={ProfileFollowersBox} />
            <Route  path="/user/profile/:slug/:id/followings/" component={ProfileFollowingsBox} />
            <Route  path="/users/" component={UserListBox}/>
            <Route  path="/registration/account/confirm/:key/" component={AccountConfirmationPage} />
            <Route  path="/user/account/password/reset/" component={PasswordResetPage} />
            <Route  path="/reset/:uid/:token/" component={PasswordChangePage} />
            <Route  path="/account/email/resend/" component={EmailResendPage} />
            <Route  path="/:slug/answer/" component={QuestionPage}/>
           
        </Switch>

         {ModalRouter}
     </div>
 
  );
}

export default withRouter(App);




