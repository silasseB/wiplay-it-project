import React from 'react';
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

import logo from './logo.svg';
import './App.css';

import './index.css';
import "./containers/index/home.css";
import "./containers/navbar.css";
import "./containers/question/css/mobile-question-page.css";
import "./containers/question/css/desktop-question-page.css";

import "./containers/main-sm-screen.css";
import "./containers/profile/profile-edit.css"
import "./containers/profile/profile.css"

import './containers/authentication/css/registration-mobile.css';
import './containers/authentication/css/registration-desktop.css';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import  RegistrationPage  from "./containers/authentication/registration";
import  SignUpPage from "./containers/authentication/signup";
import  LoginPage from "./containers/authentication/login";

import ModalContainer from "./containers/modal";
import EditProfile from "./containers/profile/edit_profile";
import IndexBox from "./containers/index/index_page";
import PostListPage from "./containers/post/post_list"
import  PostPage    from "./containers/post/post_page"
import  QuestionPage    from "./containers/question/question_page"
import QuestionListPage from "./containers/question/question_list"
import ProfilePage from "./containers/profile/profile_page";
import  PasswordChangePage from "./containers/authentication/password_change_page";
import EmailResendPage    from "./containers/authentication/email_resend_page"
import PasswordResetPage   from "./containers/authentication/password_reset_page" 

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







function App() {
  return (
     <div>
 
            <Route exact path="/" component={IndexBox}/>
            <Route  path="/profile/:id/:slug/" component={ProfilePage}/>
            <Route  path="/question/:slug/:id/" component={QuestionPage}/>
            <Route  path="/user/registration/" component={RegistrationPage} />
            <Route  path="/user/signup/" component={SignUpPage} />
            <Route  path="/user/login/" component={LoginPage} />
            <Route  path="/editor/" component={ModalContainer} />
            <Route  path="/posts/" component={PostListPage} />
            <Route  path="/questions/" component={QuestionListPage} />
            <Route  path="/post/:slug/" component={PostPage} />
            <Route  path="/edit/profile/:slug/:id/" component={EditProfile} />
            <Route  path="/followers/:id/:slug/" component={QuestionFollowersBox} />
            <Route  path="/answer/:id/upvoters/" component={AnswerUpVotersBox} />
            <Route  path="/answer/comment/:id/upvoters/" component={AnswerCommentUpVotersBox} />
            <Route  path="/answer/reply/:id/upvoters/" component={AnswerReplyUpVotersBox} />
            <Route  path="/post/:id/upvoters/" component={PostUpVotersBox} />
            <Route  path="/post/comment/:id/upvoters/" component={PostCommentUpVotersBox} />
            <Route  path="/post/reply/:id/upvoters/" component={PostReplyUpVotersBox} />
            
            <Route  path="/profile/:slug/:id/followers/" component={ProfileFollowersBox} />
            <Route  path="/profile/:slug/:id/followings/" component={ProfileFollowingsBox} />
            <Route  path="/users/" component={UserListBox}/>
            <Route  path="/registration/account/confirm/:key/" component={AccountConfirmationPage} />
            <Route  path="/user/account/password/reset/" component={PasswordResetPage} />
            <Route  path="/reset/:uid/:token/" component={PasswordChangePage} />
            <Route  path="/account/email/resend/" component={EmailResendPage} />
            <Route  path="/:slug/answer/" component={QuestionPage}/>
     </div>
 
  );
}

export default withRouter(App);




