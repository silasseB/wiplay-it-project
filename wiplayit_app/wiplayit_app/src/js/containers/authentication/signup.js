import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
import { SignUpFormComponent, NavBar }  from '../../components/registration'; 





class SignUpPage extends Component {

    constructor(props) {

        super(props);
        this.state = {
            navbarTitle : 'Signing on Wiplayit',
        };
    };

  
    componentDidMount() {
        this.props.formConstructor('signUpForm')

    };

    getProps(){
      let props = {
        navbarTitle  : this.state.navbarTitle,
      }

      return Object.assign(props,this.props );
      
    };




   render() {
     
    let props = this.getProps(); 
           
    return (
          <div className="login-page"> 
            <div>
              <NavBar {...props}/>
            </div>
          
            <div className="registration-container">
              
              <SignUpFormComponent {...props}/>
              

            </div>


          </div>

       );
  };
  }


  export default withAuthentication(SignUpPage);

