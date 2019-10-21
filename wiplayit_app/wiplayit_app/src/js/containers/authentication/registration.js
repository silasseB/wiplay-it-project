
import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
 
import { NavBar,RegistrationComponent, } from '../../components/registration'








class RegistrationPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
         navbarTitle                : 'Joining Latiro', 
      }

    }

   componentDidMount() {
    
   }

   getProps(){
      let props = {
         navbarTitle               : this.state.navbarTitle,
      };

      let parentProps = this.props;
      return Object.assign(props, parentProps )
   };

   render() {
      let props = this.getProps();
      console.log(this.props)
      return (
         <div> 
            <div>
              <NavBar {...props}/>
            </div>

            <div className="registration-page">
                      
               <div className="registration-container">
                 <RegistrationComponent {...props}/>         

               </div>
            
            </div>


         </div>

      );
   };
};

export default withAuthentication(RegistrationPage);







