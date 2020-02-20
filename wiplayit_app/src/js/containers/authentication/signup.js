import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from "../../containers/authentication/registration";

import  withAuthentication   from '../../containers/authentication/index'; 
import { SignUpFormComponent,RegistrationComponent, NavBar }  from '../../components/registration'; 





class SignUpPage extends Component {

    constructor(props) {

        super(props);
        this.state = {
            navbarTitle : 'Sign Up ',
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
            <div> 
                <SignUpFormSmallScreen {...props}/>
                <RegistrationBigScreen/>
            </div>

        );
    };
};


export default withAuthentication(SignUpPage);



const SignUpForm = (props) => {
    return (
        <div className="login-page"> 
            <div className="registration-container">
                <SignUpFormComponent {...props}/>
            </div>
        </div>

    );

};



const SignUpFormSmallScreen = MatchMediaHOC(SignUpForm, '(max-width : 800px)');
const RegistrationBigScreen = MatchMediaHOC(RegistrationPage, "(min-width : 900px)");


