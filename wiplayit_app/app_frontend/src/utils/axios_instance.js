
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
        this.timeout       =  props && props.timeout || 15000; 
    }

    tokenTimeStampe(timeStamp){
        return new GetTimeStamp({timeStamp});
   }

    _getAuth = () => {
        
        if (this.cacheEntities) {
            let {userAuth} = this.cacheEntities;

            if (userAuth) {
                let {loginAuth} = userAuth;

                if (loginAuth && loginAuth.tokenKey) {
                   return userAuth
                }
            }
        }
        return null;
    };

    refreshToken(){
        let userAuth = this._getAuth();
        let expireTime = userAuth && this.tokenTimeStampe(userAuth.timeStamp)
                
        if (expireTime && expireTime.menutes() >= 3) {
            let token = this.getToken(userAuth)
          
            let apiUrl   =  api.refreshTokenApi();
            let useToken = true; 
            store.dispatch(authenticate({apiUrl, form:{token}, useToken}))
        }
    }

    getToken(userAuth){
        let loginAuth = userAuth && userAuth.loginAuth;
        return loginAuth && loginAuth.tokenKey; 
    }

    createInstance=()=>{
        let instance = axios.create({
            baseURL: this.DOMAIN_URL,
        });

        instance.defaults.xsrfCookieName = csrftoken;
        instance.defaults.timeout = this.timeout;
        return instance;

    };

    instance = () => {
        const instance = this.createInstance()
     	
        if (this.useToken) {
            instance.interceptors.request.use((config)=> {
                // Do something before request is sent
                //console.log('intercepting request')
                this.refreshToken()

                return config;

            }, (error)=> {
                // Do something with request error
                return Promise.reject(error);
            });

            let userAuth = this._getAuth();  
            let tokenKey = this.getToken(userAuth)
                               
            tokenKey =`JWT ${tokenKey}`;
            instance.defaults.headers.common['Authorization'] = tokenKey;
        }

        return instance;
    };

};





