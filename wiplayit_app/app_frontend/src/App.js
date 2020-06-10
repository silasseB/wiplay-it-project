import React from 'react';
import {Switch, Route,} from "react-router-dom";
import { createBrowserHistory } from 'history';

import AdminPage from 'components/admin/admin-page';
import AboutAdminPage from 'components/admin/about-admin';
import  RegistrationPage  from "components/authentication/index";
import  SignUpPage from "components/authentication/signup";
import  LoginPage from "components/authentication/login";
import PasswordChangeSmsCodePage from 'components/authentication/password-sms-code-confirm'

import EditProfileRouter from "components/author/edit-profile";
import IndexBox from "components/index/index-page";
import PostListPage from "components/post/post-list"
import  PostPage    from "components/post/post-page"
import  QuestionPage    from "components/question/question-page"
import QuestionListPage from "components/question/question-list"
import  AnswerContainer  from "components/answer/answer-page";

import UserProfileContainer from "components/author/profile-page";
import PasswordChangePage from "components/authentication/password-change";
import EmailResendPage    from "components/authentication/email-resend"
import PasswordResetPage   from "components/authentication/password-reset"
import AccountEmailConfirmationPage, 
       {AccountSmsCodeConfirmationPage} from "components/authentication/account-confirmation"
import {TestEditor, ExampleCountry}  from 'components/test-editor';
import FeedBackContainer  from 'components/feed-back';
import AboutContainer  from 'components/about';
import PrivacyContainer  from 'components/privacy';
import HelpContainer  from 'components/help';
import SettingsContainer  from 'components/settings';
import NotificationsContainer from 'components/notifications';
import ReportContainer from 'components/report';
import NotFoundPage from 'components/page-not-found';



import {store} from "store/index";


export const history = createBrowserHistory();


function App() {
        
    return (
        <div>
        <Switch>
            <Route exact path="/" component={IndexBox}/>
            <Route path="/profile/:id/:slug/" component={UserProfileContainer}/>
            <Route path="/question/:slug/:id/" component={QuestionPage}/>
            <Route path="/user/registration/" component={RegistrationPage}/>
            <Route path="/user/signup/" component={SignUpPage}/>
            <Route path="/user/login/" component={LoginPage}/>
            <Route path="/posts/" component={PostListPage}/>
            <Route path="/answer/:id/" component={AnswerContainer}/>
            <Route path="/questions/" component={QuestionListPage}/>
            <Route path="/post/:slug/:id/" component={PostPage}/>
            <Route path="/edit/profile/:slug/:id/" component={EditProfileRouter}/>
            <Route path="/registration/account/confirm/:key/" component={AccountEmailConfirmationPage}/>
            <Route path="/password/reset/" component={PasswordResetPage}/>
            <Route path="/reset/:uid/:token/" component={PasswordChangePage}/>
            <Route path="/email/verification/resend/" component={EmailResendPage}/>
            <Route path="/password/change/" component={PasswordChangeSmsCodePage}/>
            <Route path="/:slug/answer/" component={QuestionPage}/>
            <Route path="/editor/" component={TestEditor}/>
            <Route path="/feedback/" component={FeedBackContainer}/>
            <Route path="/about/" component={AboutContainer}/>
            <Route path="/privacy/" component={PrivacyContainer}/>
            <Route path="/help/" component={HelpContainer}/>
            <Route path="/settings/" component={SettingsContainer}/>  
            <Route path="/notifications/" component={NotificationsContainer}/>    
            <Route path="/report/" component={ReportContainer}/>
            <Route exact path="/app/admin/"  component={AdminPage}/>
            <Route path="/app/admin/about/" component={AboutAdminPage}/>
            <Route path="/country/" component={ExampleCountry}/>
            <Route path="*" component={NotFoundPage}/>                    
        </Switch>
        </div>
    );
}

export default App;




