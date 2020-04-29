import React from 'react';

import {
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  
} from "react-router-dom";

import { createBrowserHistory } from 'history';

import {showModal}  from './actions/actionCreators';
import  RegistrationPage  from "containers/authentication/registration";
import  SignUpPage from "containers/authentication/signup";
import  LoginPage from "containers/authentication/login";

import EditProfile from "containers/profile/edit_profile";
import IndexBox from "containers/index/index_page";
import PostListPage from "containers/post/post_list"
import  PostPage    from "containers/post/post_page"
import  QuestionPage    from "containers/question/question_page"
import QuestionListPage from "containers/question/question_list"
import  AnswerContainer  from "containers/answer/answer_page";

import UserProfileContainer from "containers/profile/profile_page";
import  PasswordChangePage from "containers/authentication/password_change_page";
import EmailResendPage    from "containers/authentication/email_resend_page"
import PasswordResetPage   from "containers/authentication/password_reset_page"
import AccountConfirmationPage from "containers/authentication/account_confirmation_page"
import {TestEditor}  from 'containers/test-editor';
import FeedBackContainer  from 'containers/feed-back';
import AboutContainer  from 'containers/about';
import PrivacyContainer  from 'containers/privacy';
import HelpContainer  from 'containers/help';
import SettingsContainer  from 'containers/settings';


import {store} from "store/index";


export const history = createBrowserHistory();


function App() {
        
    return (
        <div>
                <Switch>
                    <Route exact path="/" component={IndexBox}/>
                    <Route  path="/profile/:id/:slug/" component={UserProfileContainer}/>
                    <Route  path="/question/:slug/:id/" component={QuestionPage}/>
                    <Route  path="/user/registration/" component={RegistrationPage} />
                    <Route  path="/user/signup/" component={SignUpPage} />
                    <Route  path="/user/login/" component={LoginPage} />
                    <Route  path="/posts/" component={PostListPage} />
                    <Route  path="/answer/:id/" component={AnswerContainer} />
                    <Route  path="/questions/" component={QuestionListPage} />
                    <Route  path="/post/:slug/:id/" component={PostPage} />
                    <Route  path="/edit/profile/:slug/:id/" component={EditProfile} />
                    <Route  path="/registration/account/confirm/:key/" component={AccountConfirmationPage} />
                    <Route  path="/user/account/password/reset/" component={PasswordResetPage} />
                    <Route  path="/reset/:uid/:token/" component={PasswordChangePage} />
                    <Route  path="/account/email/resend/" component={EmailResendPage} />
                    <Route  path="/:slug/answer/" component={QuestionPage}/>
                    <Route  path="/editor/" component={TestEditor}/>
                    <Route  path="/feedback/" component={FeedBackContainer}/>
                    <Route  path="/about/" component={AboutContainer}/>
                    <Route  path="/privacy/" component={PrivacyContainer}/>
                    <Route  path="/help/" component={HelpContainer}/>
                    <Route  path="/settings/" component={SettingsContainer}/>                      
                </Switch>
        </div>
    );
}

export default App;




