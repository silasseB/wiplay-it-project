import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from 'components/authentication/index';
import AuthenticationHoc  from 'components/authentication/index-hoc'; 
import SignUpForm   from 'templates/authentication/signup'; 
import {NavBar} from 'templates/authentication/utils'





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
                 <NavBar {...props}/>
                <SignUpFormSmallScreen {...props}/>
                <RegistrationBigScreen/>
            </div>

        );
    };
};


export default AuthenticationHoc(SignUpPage);



const SignUpFormSmall = (props) => {
    return (
        <div className="login-page"> 
            <div className="registration-container">
                <SignUpForm {...props}/>
            </div>
        </div>

    );

};



const SignUpFormSmallScreen = MatchMediaHOC(SignUpFormSmall, '(max-width : 980px)');
const RegistrationBigScreen = MatchMediaHOC(RegistrationPage, "(min-width : 980px)");


