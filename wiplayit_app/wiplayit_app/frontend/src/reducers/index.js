
import { combineReducers } from 'redux';
import {modal, entyties}  from 'reducers/lib/appReducers';

import { reducer as form } from 'redux-form'


export  default combineReducers({
	modal,
    form,
    entyties,

})
