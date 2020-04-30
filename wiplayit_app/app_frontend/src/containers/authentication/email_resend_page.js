import React, { Component } from 'react';
import { EmailFormComponent,NavBar } from '../../components/registration'
import  withAuthentication   from '../../containers/authentication/index'; 
 


export class EmailResendPage extends Component{

    constructor(props) {
      super(props);

        this.state = {
            pageTitle :  'Confirmation Resend',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Account Confirmation'],
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
                    <EmailFormComponent {...props}/>
                </div>
            </div>
        )
    };
};



export default withAuthentication(EmailResendPage);

