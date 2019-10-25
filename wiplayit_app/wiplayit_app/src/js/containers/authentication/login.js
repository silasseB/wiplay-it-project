import React, { Component } from 'react';
import ReduxLoginForm, { NavBar }  from '../../components/registration'; 
import withAuthentication          from '../../containers/authentication/index'; 
 


class LoginPage extends Component {

   constructor(props) {
    super(props);

      this.state = {
        navbarTitle : 'Logging on Wiplayit',
       
      }
   }

   getProps(){
      let props = {
          navbarTitle  : this.state.navbarTitle,
      }

    return Object.assign(props,this.props )
      
    }

    render() {
        let props = this.getProps();
          
        return (
            <div className="login-page"> 
                <div>
                  <NavBar {...props}/>
                </div>
          
                <div className="registration-container">
              
                    <ReduxLoginForm {...props}/>
              

                </div>


            </div>

        );
    };
};





export default withAuthentication(LoginPage);

