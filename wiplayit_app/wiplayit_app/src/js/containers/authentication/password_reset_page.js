import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
 
import { NavBar, EmailFormComponent } from '../../components/registration'




class PasswordResetPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle    : 'Password Reset',
                             
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
            <div>
                <NavBar {...props}/>
                <EmailFormComponent {...props}/>
            </div>
        )
    };
};




export default withAuthentication(PasswordResetPage);


