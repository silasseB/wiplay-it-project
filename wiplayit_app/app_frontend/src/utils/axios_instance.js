
import axios from 'axios';

let API_URL = 'http://127.0.0.1:8000';
let MobileAPI_URL = 'http://192.168.43.14:8000'
import GetTimeStamp from 'utils/timeStamp';
import { getCookie } from 'utils/csrf_token.js';
import {store} from "store/index";
import {authenticate} from "dispatch/index"

import Api from 'utils/api';


const api      = new Api();
  
var csrftoken = getCookie('csrftoken');  

export default class Axios {

    constructor(props){
        this.cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));
        this.baseURL       =  API_URL;
        this.DOMAIN_URL    =  window.location.origin; 
        this.useToken      =  props && props.useToken;
        this.timeout       =  props && props.timeout || 10000; 
    }

    _checkAuth = () => {
        
        if (this.cacheEntities) {
            let {userAuth} = this.cacheEntities;

            if (userAuth) {
                let {auth} = userAuth;

                if (auth && auth.tokenKey) {
                   return userAuth
                }
            }
        }

        return null;
    };


    instance = () => {
     	let userAuth = this._checkAuth();

    	let instance = axios.create({
            baseURL: this.DOMAIN_URL,
        });

        //retrive token from storage
        if (this.useToken) {

            let auth     = userAuth && userAuth.auth;
            let tokenKey = auth     && auth.tokenKey; 
            //console.log(tokenKey)
            if (!tokenKey) {
                return
            }
            
            tokenKey =`JWT ${tokenKey}`;
            instance.defaults.headers.common['Authorization'] = tokenKey;
            
        }
        
        instance.defaults.xsrfCookieName = csrftoken;
        instance.defaults.timeout = this.timeout;
        
        
        if (this.useToken) {
            instance.interceptors.request.use((config)=> {
                // Do something before request is sent
                //console.log('intercepting request')

                let timeStamp      = userAuth && userAuth.timeStamp;
                const getTimeState = new GetTimeStamp({timeStamp});
                let menDiff        = parseInt(getTimeState.menutes());
                let hourDiff       = parseInt(getTimeState.hours());
                let dayDiff        = parseInt(getTimeState.days());

            
                let auth     = userAuth && userAuth.auth;
                let tokenKey = auth     && auth.tokenKey; 

                //console.log(menDiff + ' menutes', hourDiff +' hourDiff', dayDiff + ' dayDiff')

                let apiUrl   =  api.refreshTokenApi();
                let useToken = true; 

                //store.dispatch(authenticate({apiUrl, form:{tokenKey}, useToken}))
                return config;

                }, (error)=> {
                    // Do something with request error
                    return Promise.reject(error);
                });
        }

        //console.log(instance.defaults)
        return instance;
    };

};





