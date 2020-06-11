
import React, { Component } from 'react';
import  AuthenticationHoc   from 'components/authentication/index-hoc';
import RegistrationComponent from 'templates/authentication/index';



class RegistrationPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
         navbarTitle : 'Joining Wiplayit', 
         defaultFormName : 'loginForm',
      }

    }

    componentDidMount() {
      this.props.formConstructor('loginForm')
    }

    render() {
        let props = {...this.props, ...this.state};
          
        return (
            <RegistrationComponent {...props}/>         
        );
    };
};

export default AuthenticationHoc(RegistrationPage);







