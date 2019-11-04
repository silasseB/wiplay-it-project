import React, { Component } from 'react';
import { ReduxEmailForm } from '../../components/registration'
import  withAuthentication   from '../../containers/authentication/index'; 
 
 



class PasswordResetForm extends Component{

   constructor(props) {
      super(props);

      this.state = {
         formName           : 'password_reset',
         formTitle          : 'Password Reset',
         navbarTitle        : 'Password Reset',
         formDescription    : [''],
                         
      };
            
   }

   
   
   render(){
      
      let props = Object.assign(this.state, this.props);
      console.log(this.props)

      return (
         <div className="password-reset">
         
             <ReduxEmailForm {...props}/>
         
         </div>
      )
   }
}




export default withAuthentication(PasswordResetForm);


