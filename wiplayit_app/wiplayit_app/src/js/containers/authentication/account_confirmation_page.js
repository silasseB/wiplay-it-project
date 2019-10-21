import React, { Component } from 'react';


import { NavBar, AccountConfirmationComponent } from '../../components/registration'

import Axios from '../../axios_instance'



import Api from '../../api';






const api = new Api();

  


export default  class AccountConfirmationPage extends Component{

  constructor(props) {
    super(props);

    this.state = {
      confirmed        :  false,
      pageTitle        :  'Account Confirmation',
      navbarTitle      :  'Confirm Account',
      formDescription  :  ['Account Confirmation'],
      
            
      
    }
    

  }

   
   componentDidMount() {
    const axiosApi = new Axios(false);
    
    const  apiUrl = api.accountConfirmApi(this)
    let instance = axiosApi.axiosInstance();

    return instance.get(apiUrl)
      .then(response => { 
                   console.log(response.data)
                   this.setState({ confirmed : true})
           
         
        return Promise.resolve(response);
      })
      .catch(error => {console.log(error.response); console.log("failed")});
     
   }
   

  sendRequest(apiUrl, formData=null, formState=null) {
    
  };
   
  
   getProps(){

         let props = {
           pageTitle         : this.state.pageTitle,
           formDescription   : this.state.formDescription,
           navbarTitle       : this.state.navbarTitle,
                 
         };

         let parentProps =  this.props; 
         

         return Object.assign(props, parentProps );
   }
 

  
  
   render() {
      let props = this.getProps();
      
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
}



