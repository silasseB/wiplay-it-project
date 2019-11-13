import React, { Component } from 'react';
import { EmailFormComponent,NavBar } from '../../components/registration'
import  withAuthentication   from '../../containers/authentication/index'; 
 


export class EmailResendPage extends Component{

   constructor(props) {
      super(props);

      this.state = {
   
      };

      
   }

   componentDidMount() {
      this.props.formConstructor('emailResendForm')
    }


   
   
   render(){
      console.log(this.props)
      return (
         <div>
            <NavBar {...this.props}/>

            <EmailFormComponent {...this.props}/>
         </div>
      )
   }
}



export default withAuthentication(EmailResendPage);

