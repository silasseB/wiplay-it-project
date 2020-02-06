import React from 'react';
import ReactDOM from 'react-dom';

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

import { Router, Switch  } from "react-router-dom";

import { createHashHistory, createMemoryHistory, createBrowserHistory } from 'history';
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker';

import { store } from "./configs/store-config";

import App from './App';
export const history = createBrowserHistory();



ReactDOM.render(
	<Provider store={store}>
	    <Router history={history}>
	        <App/>
	    </Router>
	</Provider>

	, document.getElementById('root')
	);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();



