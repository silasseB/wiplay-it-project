
import { createStore,compose, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index';



const persistStore = () => (next) => (reducer, initialState, enhancer) => {
    let store;
    if (typeof initialState !== 'function') {

        let cacheEntities = localStorage.getItem('@@CacheEntities');
        cacheEntities     = cacheEntities && JSON.parse(cacheEntities || {}) || {};

        const preloadedState = initialState || cacheEntities;

        let entities = Object.defineProperty({}, "entities", {
                                               value : preloadedState,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                            });;

        store = next(reducer, initialState, enhancer);
       
       
    } 

    else {
        const preloadedState = initialState ||
        JSON.parse(localStorage.getItem('@@CacheEntities') || {})
        store = next(reducer, preloadedState, enhancer);
        
    }

    

    let UpdateKeyedLocalCache =(storeData, cacheData)=> {
        //console.log(cachedKeys, )
        let cacheMerge;
        let storeDataKeys = storeData && Object.keys(storeData);
         
                    
        if (storeDataKeys.length) {
                        
            for(var Key in storeData){
                let storeDataValue  =  storeData[Key] 
                let cacheDataValue  = cacheData && cacheData[Key] || {} ;

                cacheMerge = Object.assign(cacheDataValue, storeDataValue);

                cacheMerge =  Object.defineProperty({}, Key, {
                                               value : cacheMerge,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                            });
                                           
            }
      
        }


        return cacheMerge;     
    };

    let UpdateNonKeyedLocalCache =(storeData, cacheData)=> {
       return  Object.assign( cacheData || {}, storeData);

    };

    store.subscribe(() => {

        let cacheEntities = localStorage.getItem('@@CacheEntities');
        cacheEntities     = cacheEntities && JSON.parse(cacheEntities || {}) || {};
                
        let storeUpdate = store.getState();
        let { entities } = storeUpdate;
        let storeEntities = entities;


        
        
 
            let storeData 
            let cacheData;
            let _cacheMerge;

            for(var entitieKey in storeEntities){

                storeData = storeEntities && storeEntities[entitieKey] || {}
                cacheData = cacheEntities && cacheEntities[entitieKey] || {};

                let storeDataKeys = storeData && Object.keys(storeData);
                                 
                                
                if (storeDataKeys.length && entitieKey != 'index' &&
                                            entitieKey != 'currentUser' && 
                                            entitieKey != 'userAuth' &&
                                            entitieKey != 'modal' ) {
        
                    _cacheMerge = UpdateKeyedLocalCache(storeData, cacheData)
                                        
                    cacheEntities[entitieKey] = Object.assign(cacheData, _cacheMerge)

                   
                 
                }else if (storeDataKeys.length && entitieKey === 'currentUser' || 
                                                  entitieKey === 'userAuth' ||
                                                  entitieKey === 'modal' ||
                                                  entitieKey === 'index'  ) {

                    _cacheMerge = UpdateNonKeyedLocalCache(storeData, cacheData)
                    cacheEntities[entitieKey] = Object.assign(cacheData, _cacheMerge)
                   
                }
            } 

            if (cacheEntities.userAuth) {
                let auth = cacheEntities.userAuth.auth;
                
                if (auth && auth.isLoggedIn === false) {
                    cacheEntities = {};
                }
            }   
                       
      
           localStorage.setItem('@@CacheEntities',JSON.stringify(cacheEntities));  
    })


    return store;
};


const storeEnhancers = compose(
   applyMiddleware(thunkMiddleware),
   persistStore()
);


export const store = createStore(rootReducer, storeEnhancers);

export const useStoreUpdate = (entitie)=>{
    
    store.subscribe(() => {
        let storeUpdate = store.getState().entities;
        return storeUpdate[entitie]  
    })
}


