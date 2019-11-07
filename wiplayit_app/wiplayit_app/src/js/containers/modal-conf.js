import React, { Component } from 'react';
import { ModalManager,Effect} from 'react-dynamic-modal';
import ModalContainer from "../containers/modal";
import { createPortal } from "react-dom";





export default class Modals {

   optionsMenuModal(contents) {
      return ModalManager.open(
              <OptionModal {...contents} onRequestClose={() => true}/>
            );
   };


   editorModal(contents){
     console.log(contents)
    return ModalManager.open(
         <EditModal {...contents} onRequestClose={() => true}/>
      );
   };



   dropImageModal(contents){

    return ModalManager.open(
         <DropImageModal {...contents} onRequestClose={() => true}/>
      );
   };
};






const modalStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,.2)",
    color: "##FFF",
    fontSize: "40px",
};


export  class CustomModal extends Component {
    render() {
        return createPortal(
            <div style={modalStyle} onClick={this.props.onClick}>
                {this.props.children}
            </div>,
            document.getElementById("modal_root"),
        );
    }
}





const option_modal_styles = {
  
  content: {
    width                   : '100%',
    margin                  : 'auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : 'auto', 
    bottom                  :  0,
    top                     :  'auto', 
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
  }
};


export const OptionModal = props => {
   const modal_props = {
      modal_styles   : option_modal_styles,
      effect         : Effect.SlideFromBottom,
      modalContents  : props.modalContents,
   };

   return(
      <ModalContainer {...modal_props} />
   ); 
};






const edit_modal_styles = {
  
  content: {
    width                   : '100%',
    margin                  : '0% auto',
    border                  : 'px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : '100%', 
    bottom                  :  0,
    top                     :  0, 
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
   }
};


export const EditModal = props => {
    let modal_props = {
       modal_styles   : edit_modal_styles,
       effect         : Effect.SlideFromBottom ,
       modalContents  : props.modalContents,

    }; 

    return(
       <ModalContainer {...modal_props} />
    ); 
};





const image_modal_styles = {
  
  content: {
    width                   : '90%',
    margin                  : '35%auto',
    border                  : 'px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    position                : 'relative !important',
   
   
   }
};





export const DropImageModal = props => {
   let modal_props = {
      modal_styles   : image_modal_styles,
      effect         : Effect.ScaleUp,
      modalContents  : props.modalContents,
   }; 

   return(
      <ModalContainer {...modal_props} />
  ); 
};









