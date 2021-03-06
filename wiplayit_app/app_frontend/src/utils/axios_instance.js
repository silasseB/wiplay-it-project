
import axios from 'axios';

import GetTimeStamp from 'utils/timeStamp';
import { getCookie } from 'utils/csrf_token.js';
import * as checkType from 'helpers/check-types'; 
import {authenticate} from "dispatch/index"
import Api from 'utils/api';
import {store} from 'store/index';

const api      = new Api();
let csrftoken = getCookie('csrftoken');  


export default class Axios {

    constructor(props){
        this.cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities')) || {};
        this.DOMAIN_URL    =  window.location.origin; 
        this.useToken      =  props?.useToken;
        this.timeout       =  props?.timeout || 15000; 
        this.requestFor    =  props?.requestFor;
    }

    authTimeStampe(timeStamp){
        return new GetTimeStamp({timeStamp});
    }

    _getAuth = () => {
        
        if (this.cacheEntities) {
            let {userAuth} = this.cacheEntities;

            if (userAuth) {
                let {loginAuth} = userAuth;

                if (loginAuth && loginAuth.tokenKey) {
                   return loginAuth;
                }
            }
        }
        return null;
    };

    tokenExpired=()=>{
        let loginAuth  = this._getAuth();
        let expireTime = loginAuth && this.authTimeStampe(loginAuth.timeStamp);
        if (expireTime) {
            return expireTime.days() >= 7;
        }
        return true
    };

    refreshToken(){
                        
        if (this.tokenExpired()) {
            let loginAuth = this._getAuth();
            let token = this.getToken(loginAuth);
            if (!token) return
           
            let authProps ={
                apiUrl :api.refreshTokenApi(), 
                form   :{token},
                isTokenRefresh : true,
                useToken : false,
            };
            store.dispatch(authenticate(authProps))
        }
    };

    getToken(loginAuth){
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
            
            if (tokenKey) {
                tokenKey =`JWT ${tokenKey}`;
                instance.defaults.headers.common['Authorization'] = tokenKey;

            }else{
                return undefined
            }
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