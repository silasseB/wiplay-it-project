import React, { Component } from 'react';
import  withAuthentication   from 'containers/authentication/index'; 
import {ReduxSignUpForm, NavBar }  from 'components/registration'; 





class SignUpPage extends Component {

   constructor(props) {
    super(props);

      this.state = {
      }
   }

  
   componentDidMount() {
   }

   getProps(){
      let props = {
     
      }

    return Object.assign(props,this.props )
      
    }




   render() {
     
    let props = this.getProps();        
    return (
          <div className="login-page"> 
            <div>
              <NavBar {...props.signupFormState}/>
            </div>
          
            <div className="registration-container">
              
              <ReduxSignUpForm {...props}/>
              

            </div>


          </div>

       );
  };
  }


  export default withAuthentication(SignUpPage);

