import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from "components/authentication/index";
import  LoginForm   from 'templates/authentication/login'; 
import  AuthenticationHoc   from 'components/authentication/index-hoc'; 
import {NavBar} from 'templates/authentication/utils'



class LoginPage extends Component {
    isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
           navbarTitle : 'Login',
        }
        console.log(this)
    }

    componentDidMount() {
        console.log(this.props.isMounted)
        if(this.props.isMounted){
            this.props.formConstructor('loginForm')
        }
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
                <NavBar {...props}/>
                <LoginFormSmallScreen {...props}/>
                <RegistrationBigScreen />
            </div>

        );
    };
};





export default AuthenticationHoc(LoginPage);


const LoginFormSmall = (props) => {
    return (
        <div className="login-page"> 
            <div className="registration-container">
                <LoginForm {...props}/>
            </div>
        </div>

    );

};



const LoginFormSmallScreen = MatchMediaHOC(LoginFormSmall, '(max-width : 800px)');
const RegistrationBigScreen = MatchMediaHOC(RegistrationPage, "(min-width : 900px)");



