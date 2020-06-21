
import axios from 'axios';

let API_URL = 'http://127.0.0.1:8000';
let MobileAPI_URL = 'http://192.168.43.14:8000'
import GetTimeStamp from 'utils/timeStamp';
import { getCookie } from 'utils/csrf_token.js';
import * as checkType from 'helpers/check-types'; 
import {store} from "store/index";
import {authenticate} from "dispatch/index"
import Api from 'utils/api';


const api      = new Api();
  
var csrftoken = getCookie('csrftoken');  



let   isRefreshingToken =()=>{
        let storeUpdate = store.getState();
        let {entities}  = storeUpdate;
        let {userAuth}  = entities;

        let isLoading = checkType.isBoolean(userAuth.isLoading)
        
        if (isLoading) {
            //console.log(userAuth)
            return userAuth.isLoading;

        }else{
            return false;
        }
    }

export default class Axios {

    constructor(props){
        this.cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'));
        this.baseURL       =  API_URL;
        this.DOMAIN_URL    =  window.location.origin; 
        this.useToken      =  props && props.useToken;
        this.timeout       =  props && props.timeout || 15000; 
        this.requestFor    =  props.requestFor; 
        console.log(props)
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

    tokenExpired=()=>{
        let userAuth = this._getAuth();
        let expireTime = userAuth && this.tokenTimeStampe(userAuth.timeStamp);
        console.log(expireTime.days())
        return expireTime && expireTime.days() >= 7 || false

    }

    refreshToken(){
                        
        if (this.tokenExpired()) {
            let userAuth = this._getAuth();
            let token = this.getToken(userAuth);
           
            let authProps ={
                apiUrl :api.refreshTokenApi(), 
                form   :{token},
                isTokenRefresh : true,
                useToken : false,
            };
            store.dispatch(authenticate(authProps))
        }
    };

    getToken(userAuth){
        let loginAuth = userAuth && userAuth.loginAuth;
        return loginAuth && loginAuth.tokenKey; 
    };

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
            this.refreshToken();
            let userAuth = this._getAuth();  
            let tokenKey = this.getToken(userAuth)
                               
            tokenKey =`JWT ${tokenKey}`;
            instance.defaults.headers.common['Authorization'] = tokenKey;
        }
     
        return instance        
    };

};




/*
instance.interceptors.request.use((config)=> {
    // Do something before request is sent
    //console.log('intercepting request', this.requestFor)
    this.canSendrequest = false
                                
    return config;

    }, (error)=> {
        // Do something with request error
        console.log(error)
        return Promise.reject(error);
    });

        instance.interceptors.response.use((response)=> {
                console.log(response, this.requestFor)
               return response;
            }, (error)=> {
                this.canSendrequest = false
                if (error.response) {
                    console.log(error.response, this.requestFor)
                }

                return Promise.reject(error);
            });
*/