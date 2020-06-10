import React, { Component } from 'react';
import EmailForm ,{EmailPasswordResetSuccess}  from 'templates/authentication/email-form'; 
import AuthenticationHoc  from 'components/authentication/index-hoc';  
import {NavBar} from 'templates/authentication/utils'



class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle     : 'Password Reset',
            formDescription : `Enter your e-mail address or phone number to change password.`,
        };
    };

    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('passwordResetForm');
    }
   
    render(){
        let props = {...this.props, ...this.state};
       
        return (
            <div className="registration-container">
                 <NavBar {...props}/>
                  <EmailForm {...props}/>
            </div>
        )
    };
};




export default AuthenticationHoc(PasswordResetPage);


