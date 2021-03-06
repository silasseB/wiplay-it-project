import React, { Component } from 'react';
import  EmailForm   from 'templates/authentication/email-form'; 
import  AuthenticationHoc   from 'components/authentication/index-hoc'; 
import {NavBar}  from 'templates/authentication/utils';


export class EmailResendPage extends Component{

    constructor(props) {
      super(props);

        this.state = {
            pageTitle :  'Confirmation Resend',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Enter Your email address'],
        };
    }

    componentDidMount() {
        this.props.formConstructor('emailResendForm')
    }


   
   
    render(){
        console.log(this.props)
        let props = {...this.props, ...this.state}

        return (
            <div>
                <NavBar {...props}/>
                <div className="account-confirm-container registration-container">
                    <EmailForm {...props}/>
                </div>
            </div>
        )
    };
};



export default AuthenticationHoc(EmailResendPage);

