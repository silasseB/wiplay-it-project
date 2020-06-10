import React from 'react';

import ModalBox,{ModalManager}  from "components/modal/modal-container";
import * as Effects from 'components/modal/Effects';




export const ModalOpener = {

    optionsMenuModal(modalName, contentsProps) {
        return ModalManager.open(
            <OptionModal {...contentsProps} onRequestClose={() => true}/>,
            modalName

        );
    },

    editorModal(modalName, contentsProps){
               
        return ModalManager.open(
            <EditModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    dropImageModal(modalName, contentsProps){

        return ModalManager.open(
            <DropImageModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    userListModal(modalName, contentsProps){

        return ModalManager.open(
            <UserListModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    navBarMenuModal(modalName, contentsProps){
        
        return ModalManager.open(
            <NavBarMenuModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },

    smsCodeModalForm(modalName, contentsProps){
        
        return ModalManager.open(
            <SmsCodeModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },
};





const optionsModalStyles = {
  
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



const navBarModalStyles = {
  
  content: {
    width                   : '70%',
    margin                  : 'auto',
    border                  : '1px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : '100%', 
    bottom                  : 'auto',
    top                     : 'auto', 
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
  }
};

export const OptionModal = props => {
    
    let modalProps = {
        modalStyles    : optionsModalStyles,
        effect         : Effects.SlideFromBottom,
        modalName      : 'optionsMenu',
        ...props,
    };

    return(
        <ModalContainer {...modalProps} />
    ); 
};




export const NavBarMenuModal = props => {
    
    let modalProps = {
        modalStyles    : navBarModalStyles,
        effect         : Effects.SlideFromLeft,
        ...props
    };

    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};


export const mobileModalStyles = {
  
  content: {
    width                   : '100%',
    margin                  : '0% auto',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    height                  : '100%', 
    bottom                  :  0,
    top                     :  0, 
    position                : 'relative',
    right                   : 'auto',
    left                    : 'auto',
     
   }
};

let desktopModalStyles  = {
    content: {
        position                : 'relative',
        margin                  : '6% 30% 0',
        width                   : '40%',
        background              : '#F6F6F6',
        overflowX               : 'hidden',
        overflowY               : 'hidden',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
        maxHeight               : '100%',
    }
}; 

let getEditorStyles = ()=>{
        if (window.matchMedia("(min-width: 980px)").matches) {
            return desktopModalStyles;
        } else {
            return mobileModalStyles;
        } 
    };

let getModalEffect =()=> {
        if (window.matchMedia("(min-width: 980px)").matches) {
            return Effects.ScaleUp;
        } else {
            return Effects.SlideFromBottom;
        } 

};

export const EditModal = props => {
    //console.log(props)

    let modalProps = {
        modalStyles    : getEditorStyles(),
        effect         : getModalEffect() ,
        ...props, 

    }; 

    return(
       <ModalContainer {...modalProps} />
    ); 
};





export const SmsCodeModal = props => {
    
    let modalProps = {
        modalStyles    : getDropImageStyles(),
        effect         : Effects.ScaleUp,
        ...props
    };
    
    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};



const mobileImageModalStyles  = {
  
  content: {
    width                   : '90%',
    margin                  : '35%auto',
    border                  : 'px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    position                : 'relative',
   
   
   }
};


const desktopImageModalStyles  = {
  
  content: {
    width                   : '90%',
    margin                  : '35%auto',
    border                  : 'px solid rgba(0, 0, 0, .2)',
    background              : '#fff',
    overflow                : 'none',
    borderRadius            : '4px',
    outline                 : 'none',
    boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    position                : 'relative',
   
   
   }
};



let getDropImageStyles = ()=>{
        if (window.matchMedia("(min-width: 980px)").matches) {
            return desktopModalStyles;
        } else {
            return mobileImageModalStyles;
        } 
    };


export const DropImageModal = props => {

    let modalProps = {
        modalStyles    : getDropImageStyles(),
        effect         : Effects.ScaleUp,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};



const UserListModalStyles = {
  
    content: {
        margin                  : '5%',
        border                  : 'px solid rgba(0, 0, 0, .2)',
        background              : '#fff',
        overflow                : 'none',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
        position                : 'relative !important',
    }
};





export const UserListModal = props => {
    let modalProps = {
        modalStyles    : getEditorStyles(),
        effect         : Effects.ScaleUp ,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};








export function  ModalContainer(props)  {
    
    //Render modal box with along with its contents
    const {
            modalContents,
            modalStyles,
            modalName,
            effect, 
            onRequestClose, } = props;
    
    return (
        <ModalBox
            style={modalStyles}
            modalName={modalName}
            onRequestClose={onRequestClose}
            effect={effect}>

            {modalContents}
         
        </ModalBox>
    );
};









