import React from 'react';
import ReactDOM from 'react-dom';

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
	        <Switch>
	           <App/>
	        </Switch>
	    </Router>
	</Provider>

	, document.getElementById('root')
	);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();



