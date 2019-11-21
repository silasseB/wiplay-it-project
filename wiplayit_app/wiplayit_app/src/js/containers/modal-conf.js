import React, { Component } from 'react';
import {ModalContainer, ModalManager} from "../containers/modal";
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
    let modal_props = {
      modal_styles   : option_modal_styles,
      effect         : SlideFromBottom,
      modalContents  : props.modalContents,
    };

    modal_props =Object.assign(modal_props, props)

   return(
      <ModalContainer {...modal_props} />
   ); 
};






export const edit_modal_styles = {
  
  content: {
    width                   : '100%',
    margin                  : '0% auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
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
       effect         : SlideFromBottom ,
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
      effect         : ScaleUp,
      modalContents  : props.modalContents,
   }; 

   return(
      <ModalContainer {...modal_props} />
  ); 
};






export const ScaleUp = {
      transition : {
         property : 'all',
         duration : 300,
         timingfunction : 'linear'
      },
      begin : {
        'transform': 'scale(0.7)',
        'opacity': 0
      },
      end : {
        'transform': 'scale(1)',
        'opacity': 1
      }
}

export const SlideFromRight = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'cubic-bezier(0.25, 0.5, 0.5, 0.9)'
     },
     begin : {
       'transform': 'translateX(35%)',
       'opacity': 0
     },
     end : {
       'transform': 'translateX(0)',
       'opacity': 1
     }
};

export const SlideFromBottom = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transform': 'translateY(35%)',
       'opacity': 0
     },
     end : {
       'transform': 'translateY(0)',
       'opacity': 1
     }
};

export const Newspaper = {
     transition : {
        property : 'all',
        duration : 500,
        timingfunction : 'linear'
     },
     begin : {
       'transform': 'scale(0) rotate(720deg)',
       'opacity': 0
     },
     end : {
       'transform': 'scale(1) rotate(0deg)',
       'opacity': 1
     }
};


export const Fall = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'ease-in'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transform': 'translateZ(600px) rotateX(20deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transform': 'translateZ(0px) rotateX(0deg)',
       'opacity': 1
     }
};


export const SideFall = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transform': 'translate(30%) translateZ(600px) rotate(10deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transform': 'translate(0%) translateZ(0) rotate(0deg)',
       'opacity': 1
     }
};

export const FlipHorizontal3D = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transform': 'rotateY(-70deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transform': 'rotateY(0deg)',
       'opacity': 1
     }
};

export const FlipVertical3D = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transform': 'rotateX(-70deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transform': 'rotateX(0deg)',
       'opacity': 1
     }
};

export const Sign3D = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '50% 0',
       'transform': 'rotateX(-60deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '50% 0',
       'transform': 'rotateX(0deg)',
       'opacity': 1
     }
};

export const SuperScaled = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transform': 'scale(2)',
       'opacity': 0
     },
     end : {
       'transform': 'scale(1)',
       'opacity': 1
     }
};


export const RotateFromBottom3D = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'ease-out'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '0 100%',
       'transform': 'translateY(100%) rotateX(90deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '0 100%',
       'transform': 'translateY(0%) rotateX(0deg)',
       'opacity': 1
     }
};

export const RotateFromLeft3D = {
     transition : {
        property : 'all',
        duration : 300,
        timingfunction : 'linear'
     },
     begin : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '0 100%',
       'transform': 'translateZ(100px) translateX(-30%) rotateY(90deg)',
       'opacity': 0
     },
     end : {
       'transformStyle': 'preserve-3d',
       'transformOrigin': '0 100%',
       'transform': 'translateZ(0px) translateX(0%) rotateY(0deg)',
       'opacity': 1
     }
};

