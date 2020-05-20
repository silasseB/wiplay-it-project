import React from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { compose } from 'redux';
import {handleSubmit, authenticate }  from "dispatch/index"
import  * as action  from 'actions/actionCreators';
import { ModalManager}   from  "components/modal/modal-container";

import { AlertComponent } from "templates/partial-components";
import * as checkType from 'helpers/check-types'; 
import {store} from "store/index";
import {history} from "App";
import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import Helper from 'utils/helpers';



const api      = new Api();
const helper   = new Helper();


export function MainAppHoc(Component) {

    return class MainApp extends Component {
        _isMounted = false;

        constructor(props) {
            super(props);

            this.state = {
                adminUser        : undefined,
                currentUser      : undefined,
                cacheEntities    : this._cacheEntities(), 
                isAuthenticated  : this.isAuthenticated(),
                displayMessage   : false,
                message          : null,
                modalIsOpen      : false,
            };
          
        };


        isAuthenticated() {
      	    let cacheEntities = this._cacheEntities();
            //console.log(cacheEntities)        
            if (cacheEntities){
        	    let {admin} = cacheEntities;
                let  auth   = admin && admin.auth;

                if (auth && auth.isLoggedIn && auth.tokenKey) {
             	    return true;
                }
            }
            return false;
        };

        _SetCurrentUser =(currentUser=undefined)=>{
                    
            if (!currentUser) {
                let  cacheEntities  = this._cacheEntities();
                currentUser = cacheEntities.currentUser;
                currentUser = currentUser && currentUser.user;
            }
                       
            this.setState({currentUser})
            return currentUser;  
        };

        _cacheEntities = ()=>{
            return JSON.parse(localStorage.getItem('@@CacheEntities'))  || {};
        }

 

        static getDerivedStateFromProps(props, state) {
            //console.log(state, props)
            return null
        }

        
        onStoreUpdate = () =>{
 
            const onStoreChange = () => {
                if (this._isMounted) {
                }
            };

            this.unsubscribe = store.subscribe(onStoreChange);

        };

        componentDidMount() {
            this._isMounted = true;
            this.onStoreUpdate() //Subscribe on store change 

            if (!this.isAuthenticated()) {
                //User is not authenticated,so redirect to authentication page.
                history.push('/user/registration/')
                return;
            }

            this._SetCurrentUser();
        };

        

        onBeforeUnload =()=>{
            console.log('Component is unloading')
        };
  

        render() {
            let props = this.getProps();
            let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                          { display : 'none' };

            let onModalStyles = props.modalIsOpen ? {opacity:'0.70',} :
                                                    {opacity:'2',};
            //console.log(props)

            return (
                <div  className="app-container">
                    <fieldset style={ onModalStyles } 
                              disabled={ props.modalIsOpen } >
                        
                        <Component {...props}/>                    

                    </fieldset>

                    <div style={alertMessageStyles}>
                       <AlertComponent {...props}/>
                    </div>
                    
                </div> 

            );
        };

    };
};



//binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => {
   
    return {
        submit               : (props )     => dispatch(handleSubmit(props)), 
        authenticate         : (props)      => dispatch(authenticate(props)),
        
   }

};




const mapStateToProps = (state, ownProps) => {
   
    return {
        admin      : state.entities.admin,       
    }
};

const composedHoc = compose( connect(mapStateToProps, mapDispatchToProps),  MainAppHoc)


export default  composedHoc;





