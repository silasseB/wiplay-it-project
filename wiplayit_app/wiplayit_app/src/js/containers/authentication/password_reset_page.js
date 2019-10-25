import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
 
import { NavBar, ReduxEmailForm } from '../../components/registration'




class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            formName       : 'password_reset',
            navbarTitle    : 'Password Reset',
                             
        };
    
   };

      
    getProps(){
          
        return Object.assign(this.state, this.props );
    }
 

    render(){
      
        let props = this.getProps();

        return (
            <div>
                <NavBar {...props}/>
                <ReduxEmailForm {...props}/>
            </div>
        )
    };
};




export default withAuthentication(PasswordResetPage);


