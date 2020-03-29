import React, { Component } from 'react';
import { MatchMediaHOC } from 'react-match-media';
import RegistrationPage from "../../containers/authentication/registration";
import  { RegistrationComponent, LoginFormComponent,  NavBar }  from '../../components/registration'; 
import withAuthentication          from '../../containers/authentication/index'; 
 


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





export default withAuthentication(LoginPage);


const LoginForm = (props) => {
    return (
        <div className="login-page"> 
            <div className="registration-container">
                <LoginFormComponent {...props}/>
            </div>
        </div>

    );

};



const LoginFormSmallScreen = MatchMediaHOC(LoginForm, '(max-width : 800px)');
const RegistrationBigScreen = MatchMediaHOC(RegistrationPage, "(min-width : 900px)");



