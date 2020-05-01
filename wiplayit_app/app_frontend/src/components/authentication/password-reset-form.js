import React, { Component } from 'react';
import  EmailForm   from 'templates/authentication/email-form'; 
import  withAuthHoc   from 'components/authentication/index-hoc';  
 



class PasswordResetForm extends Component{

   constructor(props) {
      super(props);

      this.state = {
         formTitle          : 'Password Reset',
         navbarTitle        : 'Password Reset',
         formDescription    : `Forgotten your password? Enter your e-mail address below,
                                   and we'll send you an e-mail allowing you to reset it`,
                         
      };
            
   };

   componentDidMount() {
      this.props.formConstructor('passwordResetForm')

    };

   
   
   render(){
      
      let props = Object.assign(this.state, this.props);
      console.log(this.props)

      return (
         <div className="password-reset">
         
             <EmailForm {...props}/>
         
         </div>
      )
   }
}




export default withAuthHoc(PasswordResetForm);

