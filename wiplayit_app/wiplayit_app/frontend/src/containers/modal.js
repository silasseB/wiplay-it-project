
import React, { Component } from 'react';
import { Modal} from 'react-dynamic-modal';


 


class ModalContainer extends Component {

   componentDidUpdate(){
      console.log(window.onpopstate);
   };

   componentDidMount(){
     console.log(this.props);
   };
   
   //Render modal with pass its contents
   render(){
      const { modalContents, modal_styles ,effect, onRequestClose } = this.props;
 
      return (
         <Modal style={modal_styles}  
            onRequestClose={onRequestClose}  effect={effect}>
             {modalContents}
         
         </Modal>
      );
   };
};

export default ModalContainer;




