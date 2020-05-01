import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from "components/authentication/index";
import  LoginForm   from 'templates/authentication/login'; 
import  withAuthHoc   from 'components/authentication/index-hoc'; 
 


class LoginPage extends Component {

   constructor(props) {
        super(props);

        this.state = {
           navbarTitle : 'Login',
        }
    }

    componentDidMount() {
        this.props.formConstructor('loginForm')
    }

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
                <LoginFormSmallScreen {...props}/>
                <RegistrationBigScreen />
            </div>

        );
    };
};





export default withAuthHoc(LoginPage);


const LoginFormSmall = (props) => {
    return (
        <div className="login-page"> 
            <div className="registration-container">
                <LoginForm {...props}/>
            </div>
        </div>

    );

};



const LoginFormSmallScreen = MatchMediaHOC(LoginFormSmal, '(max-width : 800px)');
const RegistrationBigScreen = MatchMediaHOC(RegistrationPage, "(min-width : 900px)");



