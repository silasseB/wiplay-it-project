
import React, { Component } from 'react';
import  withAuthentication   from '../../containers/authentication/index'; 
 
import { NavBar,RegistrationComponent, } from '../../components/registration'








class RegistrationPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
         navbarTitle : 'Joining Wiplayit', 
      }

    }

   componentDidMount() {
    console.log(this.props)
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







