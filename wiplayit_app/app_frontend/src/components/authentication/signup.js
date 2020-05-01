import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from 'components/authentication/index';
import withAuthHoc   from 'components/authentication/index-hoc'; 
import SignUpForm   from 'templates/authentication/signup'; 





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


export default withAuthHoc(SignUpPage);



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


