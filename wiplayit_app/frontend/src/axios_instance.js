
import axios from 'axios';

let API_URL = 'http://127.0.0.1:8000';
let MobileAPI_URL = 'http://192.168.43.14:8000'


  
  

export default class Axios {

    constructor(props){
        this.cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'));
        this.withAuthentication = props;
        this.baseURL        =  API_URL;
        //this.MobileAPI_URL  =  'http://192.168.43.14:3000'
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
       	let baseURL = API_URL;
        
    	if(window.navigator.platform === 'Linux armv7l'){
            baseURL =  MobileAPI_URL;
                  
        }

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

        instance.defaults.timeout = 30000;
        return instance;
    };

};





