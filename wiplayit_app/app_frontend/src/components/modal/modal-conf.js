import React from 'react';

import * as Styles from 'components/modal/styles';
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

    passwordConfirmForm(modalName, contentsProps){
        
        return ModalManager.open(
            <PasswordConfirmModal {...contentsProps} onRequestClose={() => true}/>,
            modalName
        );
    },
};





export const OptionModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.optionsModalStyles,
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
        modalStyles    : Styles.navBarModalStyles,
        effect         : Effects.SlideFromLeft,
        ...props
    };

    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
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
        modalStyles    : Styles.getEditorStyles(),
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


export const PasswordConfirmModal = props => {
    
    let modalProps = {
        modalStyles    : Styles.getPasswordConfirmStyles(),
        effect         : Effects.ScaleUp,
        ...props
    };
    
    return(
        <div>
            <ModalContainer {...modalProps} />
        </div>
    ); 
};





export const DropImageModal = props => {

    let modalProps = {
        modalStyles    : Styles.getDropImageStyles(),
        effect         : Effects.ScaleUp,
        ...props,
    }; 

    return(
        <ModalContainer {...modalProps} />
    ); 
};






export const UserListModal = props => {
    let modalProps = {
        modalStyles    : Styles.getEditorStyles(),
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









