import React, { Component } from 'react';
import { NavBar} from 'templates/authentication/utils';
import  PassWordChangeForm,{SuccessPasswordChange}   from 'templates/authentication/password-change'; 
import AuthenticationHoc  from 'components/authentication/index-hoc'; 





export class PasswordChangePage extends Component{

   constructor(props) {
      super(props);

        this.state = {
            navbarTitle        : 'Password Change',
            formTitle          : 'Password Change',
            formDescription    : 'Enter a new passsword on both fields.',
        };
    }

   
   
    componentDidMount() {
        let {match, entities} =this.props;
        let {uid, token}  = match.params;
        
        let passwordAuthOpts = {}
        if (uid && token) {
            passwordAuthOpts = {uid, token}
        }

        this.props.formConstructor('passwordChangeForm', passwordAuthOpts);
    }

    
   
    render(){
      
        let props = {...this.props, ...this.state};
        let {userAuth, errors} = props.entities;
        let {passwordChangeAuth}  = userAuth;
        let {successMessage} = passwordChangeAuth || {};
  
        
        return (
            <div className="registration-page">
               <NavBar {...props}/>
                <div className="password-change-container registration-container">
                    {successMessage &&
                        <SuccessPasswordChange {...props}/>
                        ||
                        <PassWordChangeForm {...props}/>
                    }
                </div>   
            </div>
        )
    }
}







export default AuthenticationHoc(PasswordChangePage)

