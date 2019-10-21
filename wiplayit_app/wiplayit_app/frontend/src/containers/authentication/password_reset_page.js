import React, { Component } from 'react';
import  withAuthentication   from 'containers/authentication/index'; 
 
import { NavBar, EmailForm } from 'components/registration'




class PasswordResetPage extends Component{

   constructor(props) {
      super(props);

      this.state = {
         formName           : 'password_reset',
         formTitle          : 'Password Reset',
                             
      };
    
   }

      
   componentDidMount() {
    
   }



   getProps(){

      let props = {
                     
      };

      let parentProps =  this.props; 
         

      return Object.assign(props, parentProps );
   }
 

   render(){
      
      let props = this.getProps();

      return (
         <div>
            <NavBar {...props}/>
            <EmailForm {...props}/>
         </div>
      )
   }
}




export default withAuthentication(PasswordResetPage);


