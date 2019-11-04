import React, { Component } from 'react';
import { EmailForm,NavBar } from '../../components/registration'
import  withAuthentication   from '../../containers/authentication/index'; 
 


export class EmailResendPage extends Component{

   constructor(props) {
      super(props);

      this.state = {
   
      };

      
   }

   
   
   render(){
      console.log(this.props)
      return (
         <div>
            <NavBar {...this.props}/>

            <EmailForm {...this.props}/>
         </div>
      )
   }
}



export default withAuthentication(EmailResendPage);

