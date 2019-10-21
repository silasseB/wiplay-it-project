import React, { Component } from 'react';
import ReduxLoginForm, { NavBar }  from '../../components/registration'; 
import withAuthentication          from '../../containers/authentication/index'; 
 


class LoginPage extends Component {

   constructor(props) {
    super(props);

      this.state = {
       
      }
   }

  render() {
          
    return (
          <div className="login-page"> 
            <div>
              <NavBar {...this.props}/>
            </div>
          
            <div className="registration-container">
              
              <ReduxLoginForm {...this.props}/>
              

            </div>


          </div>

       );
  };
  }





export default withAuthentication(LoginPage);

