import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router}  from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import './index.css';
import "./containers/index/home.css";
import "./containers/navbar.css";
import "./containers/question/css/mobile-question-page.css";
import "./containers/question/css/desktop-question-page.css";

import "./containers/main-sm-screen.css";
import "./containers/profile/profile-edit.css";
import "./containers/profile/user-list.css";

import "./containers/profile/profile.css"

import './containers/authentication/css/registration-mobile.css';
import './containers/authentication/css/registration-desktop.css';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import App, {history} from './App';
import {store} from "store/index";

const _App =()=> (
	<Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>
) 

ReactDOM.render(<_App/>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();



