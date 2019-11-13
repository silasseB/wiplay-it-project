
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

store.subscribe(() => {
   let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
   let storeUpdate = store.getState().entyties
   let { userAuth, currentUser,userProfile } = storeUpdate;
   let userProfileAllIds =  userProfile.allIds.length
   
   if (userAuth.auth.isLoggedIn){
       cachedEntyties['auth'] = userAuth.auth
   }

   else if(currentUser.user){
      cachedEntyties['currentUser'] = currentUser;

   }

   localStorage.setItem('@@CachedEntyties', JSON.stringify(cachedEntyties ));
   
});

return store;
}




const storeEnhancers = compose(
   applyMiddleware(thunkMiddleware),
   persistStore()
);

export const store = createStore(rootReducer, storeEnhancers);

