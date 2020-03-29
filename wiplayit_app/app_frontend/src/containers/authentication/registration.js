
import React, { Component } from 'react';
import  withAuthentication   from 'containers/authentication/index'; 
 
import { NavBar, RegistrationComponent, } from 'components/registration'








class RegistrationPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
         navbarTitle : 'Joining Wiplayit', 
      }

    }

    componentDidMount() {
       console.log(this.props)
       this.props.formConstructor('loginForm')
    }


    getProps(){
        return Object.assign(this.state, this.props )
    };

    render() {
        let props = this.getProps();
        console.log(props)
     
        return (
            <div> 
              <RegistrationComponent {...props}/>         
            </div>
        );
    };
};

export default withAuthentication(RegistrationPage);






