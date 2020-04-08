import React, { Component } from 'react';

import  withAuthentication   from 'containers/authentication/index'; 
import { NavBar, AccountConfirmationComponent } from 'components/registration'
import {store} from "store/index";
import Axios from 'utils/axios_instance'
import { getCurrentUser }  from "dispatch/index"
import Api from 'utils/api';






const api = new Api();

  

class AccountConfirmationPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            confirmed        :  false,
            successMessage   :  '',
            pageTitle        :  'Account Confirmation',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Account Confirmation'],
        };

        this.isConfirmed = this.isConfirmed.bind(this);
    
    };


    isConfirmed = (params)=>{
        let  { cacheEntities }  = this.props;
        let  { currentUser }    = cacheEntities && cacheEntities; 
        currentUser             = currentUser   && currentUser.user;

        !currentUser && store.dispatch(getCurrentUser());
        console.log(params)  
        this.setState({...params});
        
    };

   
    componentDidMount() {
        
        let { key } = this.props.match.params; 
        this.props.confirmUser( key, this.isConfirmed );    
    };
   
  
    getProps(){
         
        return Object.assign(this.state, this.props );
    };
 

  
  
    render() {
        let props = this.getProps();
        console.log(props) 
        return (
            <div className="registration-page">
              <NavBar {...props}/>

               <div>
                    <div className="account-confirm-container registration-container">
                       <AccountConfirmationComponent{...props } />   
                    </div>
                </div>
          
            </div>
        );
    };
};


export default withAuthentication(AccountConfirmationPage);

