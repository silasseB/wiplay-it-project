import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route,Switch  } from "react-router-dom";

import * as serviceWorker from 'serviceWorker';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux'
import { createStore,compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk'

import 'index.css';
import "containers/index/home.css";
import "containers/navbar.css";
import "containers/question/css/mobile-question-page.css";
import "containers/question/css/desktop-question-page.css";

import "containers/main-sm-screen.css";
import "containers/profile/profile-edit.css"
import "containers/profile/profile.css"

import 'containers/authentication/css/registration-mobile.css';
import 'containers/authentication/css/registration-desktop.css';


//import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import rootReducer from 'reducers/index';

import  RegistrationPage  from "containers/authentication/registration";
import  SignUpPage from "containers/authentication/signup";
import  LoginPage from "containers/authentication/login";

import ModalContainer from "containers/modal";
import EditProfile from "containers/profile/edit_profile";
import IndexBox from "containers/index/index_page";
import PostListPage from "containers/post/post_list"
import  PostPage    from "containers/post/post_page"
import  QuestionPage    from "containers/question/question_page"
import ProfilePage from "containers/profile/profile_page";
import  PasswordChangePage from "containers/authentication/password_change_page";
import EmailResendPage    from "containers/authentication/email_resend_page"
import PasswordResetForm   from "containers/authentication/password_reset_form" 

import AccountConfirmationPage from "containers/authentication/account_confirmation_page"
import UserListBox from "containers/users/user_list_page"; 


const persistStore = () => (next) =>
   (reducer, initialState, enhancer) => {
   let store;
   if (typeof initialState !== 'function') {
      store = next(reducer, initialState, enhancer);

   } 
   
   else {
      const preloadedState = initialState ||
      JSON.parse(localStorage.getItem('@@CachedEntyties') || {})
      store = next(reducer, preloadedState, enhancer);
   }

   store.subscribe(() => {
      let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
      let storeUpdate = store.getState().entyties
      var { userAuth, currentUser } = storeUpdate;
      
            
      if (userAuth.auth.isLoggedIn){
         cachedEntyties['auth'] = userAuth.auth
      }
      else if(currentUser.user){
         cachedEntyties['currentUser'] = currentUser;
      }

      localStorage.setItem('@@CachedEntyties',JSON.stringify(cachedEntyties));
      
   });

   return store;
}



const storeEnhancers = compose(
    applyMiddleware(thunkMiddleware),
    persistStore()
);

export const store = createStore(rootReducer, storeEnhancers);


export const history = createBrowserHistory();
/*export const store = createStore(rootReducer,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
   applyMiddleware(thunkMiddleware));*/


window.store = store

const routing = (

   <Provider store={store}> 
       <Router history={history}>
         <div>
           <Switch>
               <Route exact path="/" component={IndexBox}/>
               <Route  path="/profile/:slug/" component={ProfilePage}/>
               <Route  path="/question/:slug/" component={QuestionPage}/>
               <Route  path="/user/registration/" component={RegistrationPage} />
               <Route  path="/user/signup/" component={SignUpPage} />
               <Route  path="/user/login/" component={LoginPage} />
               <Route  path="/editor/" component={ModalContainer} />
               <Route  path="/post/list/" component={PostListPage} />
               <Route  path="/post/:slug/" component={PostPage} />
               <Route  path="/edit/profile/:slug/" component={EditProfile} />
               <Route  path="/:slug/followers/" component={UserListBox} />
               <Route  path="/answer/:id/upvoters/" component={UserListBox} />
               <Route  path="/comment/:id/upvoters/" component={UserListBox} />
               <Route  path="/reply/:id/upvoters/" component={UserListBox} />
               <Route  path="/post/:id/upvoters/" component={UserListBox} />
               <Route  path="/user/:slug/followers/" component={UserListBox} />
               <Route  path="/post/:slug/followings/" component={UserListBox} />
               <Route  path="/users/" component={UserListBox}/>
               <Route  path="/registration/account/confirm/:key/" component={AccountConfirmationPage} />
               <Route  path="/user/account/password/reset/" component={PasswordResetForm} />
               <Route  path="/reset/:uid/:token/" component={PasswordChangePage} />
               <Route  path="/account/email/resend/" component={EmailResendPage} />
               <Route  path="/:slug/answer/" component={QuestionPage}/>
            </Switch>
         </div>
      </Router>
   </Provider>

)


ReactDOM.render(
   	routing, document.getElementById('root')

);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();



