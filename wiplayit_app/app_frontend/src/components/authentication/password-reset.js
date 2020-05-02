import React, { Component } from 'react';
import EmailForm   from 'templates/authentication/email-form'; 
import AuthenticationHoc  from 'components/authentication/index-hoc';  
import {NavBar} from 'templates/authentication/utils'



class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle    : 'Password Reset',
            formDescription    : `Forgotten your password? Enter your e-mail address below,
                                   and we'll send you an e-mail allowing you to reset it`,
                             
        };
    
   };

    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('passwordResetForm');
    }


      
    getProps(){
          
        return Object.assign(this.state, this.props );
    }
 

    render(){
      
        let props = this.getProps();

        return (
            <div className="registration-container">
                 <NavBar {...props}/>
                  <EmailForm {...props}/>
            </div>
        )
    };
};




export default AuthenticationHoc(PasswordResetPage);


