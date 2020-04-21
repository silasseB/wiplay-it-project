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
import UserProfileContainer from "containers/profile/profile_page";
import  PasswordChangePage from "containers/authentication/password_change_page";
import EmailResendPage    from "containers/authentication/email_resend_page"
import PasswordResetPage   from "containers/authentication/password_reset_page"
import { ModalManager, Modal}   from  "containers/modal/modal_container";

import AccountConfirmationPage from "containers/authentication/account_confirmation_page"
/*import UserListBox from "containers/users/user_list_page"; 
import ProfileFollowersBox from "containers/users/profile-followers-page"; 
import ProfileFollowingsBox from "containers/users/profile-followings-page"; 
import QuestionFollowersBox from "containers/users/question-followers-page"; 
import AnswerUpVotersBox  from "containers/users/answer-upvoters-page"; 
import AnswerCommentUpVotersBox  from "containers/users/answer-comment-upvoters-page"; 
import AnswerReplyUpVotersBox  from "containers/users/answer-reply-upvoters-page"; 
import PostUpVotersBox  from "containers/users/post-upvoters-page"; 
import PostCommentUpVotersBox  from "containers/users/post-comment-upvoters-page"; 
import PostReplyUpVotersBox  from "containers/users/post-comment-upvoters-page"; */
import {store} from "store/index";


export const history = createBrowserHistory();

let storeUpdate = store.getState().entities;

let GetModalRouter = (location)=>{
    let background =  location && location.state && location.state.background;
    //console.log(location)
    let state = location && location.state;
    return <Route path="/compose/:context/:id/" children={<Modal {...state}/> }/>  
}




function App() {
    let location = useLocation && useLocation();
    let background =  location && location.state && location.state.background;
  
    let ModalRouter = GetModalRouter(location)
          

     
    return (
            <div>
                <Switch location={background || location}>
                    <Route exact path="/" component={IndexBox}/>
                    <Route  path="/profile/:id/:slug/" component={UserProfileContainer}/>
                    <Route  path="/question/:slug/:id/" component={QuestionPage}/>
                    <Route  path="/user/registration/" component={RegistrationPage} />
                    <Route  path="/user/signup/" component={SignUpPage} />
                    <Route  path="/user/login/" component={LoginPage} />
                    <Route  path="/posts/" component={PostListPage} />
                    <Route  path="/questions/" component={QuestionListPage} />
                    <Route  path="/post/:slug/:id/" component={PostPage} />
                    <Route  path="/edit/profile/:slug/:id/" component={EditProfile} />
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

export default App;




