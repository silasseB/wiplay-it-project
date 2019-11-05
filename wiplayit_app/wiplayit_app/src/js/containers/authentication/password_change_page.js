import React, { Component } from 'react';
import { NavBar, PassWordChangeForm } from '../../components/registration';
import  withAuthentication   from '../../containers/authentication/index'; 





export class PasswordChangePage extends Component{

   constructor(props) {
      super(props);

      this.state = {
         navbarTitle        : 'Password Change',
         formTitle          :  'Password Change',
         formDescription    : ['Fill in the form bellow with your new account password and submit.'],
                            
      };
   }

   
   
    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('passwordChangeForm');
    }

   
   render(){
      
      let props = Object.assign(this.state, this.props);
      return (
         <div>
            <NavBar {...props.passwordChangeStateForm}/> 

            <div className="registration-page">
               <div className="password-change-container registration-container">
                  <PassWordChangeForm {...props}/>
               </div>   
            </div>
         </div>
      )
   }
}







export default withAuthentication(PasswordChangePage)

