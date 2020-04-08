
import axios from 'axios';

let API_URL = 'http://127.0.0.1:8000';
let MobileAPI_URL = 'http://192.168.43.14:8000'

import { getCookie } from 'utils/csrf_token.js';

  
var csrftoken = getCookie('csrftoken');  

export default class Axios {

    constructor(props){
        this.cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));
        this.baseURL       =  API_URL;
        this.DOMAIN_URL    =  window.location.origin; 
        this.useToken      =  props && props.useToken;
    }

    getTokenKey = () => {
        
        if (this.cacheEntities) {
            let {userAuth} = this.cacheEntities;

            if (userAuth) {
                let {auth} = userAuth;

                if (auth && auth.tokenKey) {
                   return auth.tokenKey
                }
            }
        }

        return null;
    };


    instance = () => {
     	        
    	let instance = axios.create({
            baseURL: this.DOMAIN_URL,
        });

        //retrive token from storage
        if (this.useToken) {

            let tokenKey = this.getTokenKey();
            //console.log(tokenKey)
            if (!tokenKey) {
                return
            }
            
            tokenKey =`Token ${tokenKey}`;
            instance.defaults.headers.common['Authorization'] = tokenKey;
            
        }
        
        instance.defaults.xsrfCookieName = csrftoken;
        instance.defaults.timeout = 30000;
        
        //console.log(instance.defaults)
        return instance;
    };

};





