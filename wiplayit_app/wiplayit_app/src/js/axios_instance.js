
import axios from 'axios';

let API_URL = 'http://127.0.0.1:8000';
let MobileAPI_URL = 'http://192.168.43.14:8000'
import { getCookie } from './csrf_token.js';

  
var csrftoken = getCookie('csrftoken');  

export default class Axios {

    constructor(props){
        this.cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));
        this.withAuthentication = props;
        this.baseURL        =  API_URL;
        this.DOMAIN_URL  =  window.location.origin;  // 'valoi.pythonanywhere.com';

        console.log(window.location.origin)
    }

    getTokenKey(){
        
        if (this.cachedEntyties) {
            var {auth } = this.cachedEntyties

            if (auth && auth.tokenKey) {
                return auth.tokenKey
            }
        }

        return null;
    };


    axiosInstance(){
       	let baseURL = this.DOMAIN_URL;
        
    	var instance = axios.create({
            baseURL: baseURL,
        });

        if (this.withAuthentication) {
            //retrive token from storage
            var tokenKey = this.getTokenKey();
         
            if (tokenKey) {
                tokenKey =`Token ${tokenKey}`;
                instance.defaults.headers.common['Authorization'] = tokenKey;
            }
        }
        
        instance.defaults.xsrfCookieName = csrftoken;
        instance.defaults.timeout = 30000;
        return instance;
    };

};





