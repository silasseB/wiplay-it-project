
import { createStore,compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index';



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

return store;
}




const storeEnhancers = compose(
   applyMiddleware(thunkMiddleware),
   persistStore()
);

export const store = createStore(rootReducer, storeEnhancers);

