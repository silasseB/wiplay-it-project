import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams
} from "react-router-dom";


import { ModalOptionsMenu } from "../../components/buttons";
import { DropImage } from "../../containers/profile/edit_profile";
import AppEditor  from '../../containers/editor';
import ModalBox,{ModalManager}  from "../../containers/modal/modal_container";
import * as Effects from '../../containers/modal/Effects';


export function Modal(props) {
    
    let {background, modalProps} = props;

    let {
        modalType, 
        editorProps,
        optionsMenuProps,
        dropImageProps, 
                        } = modalProps && modalProps;

    //console.log(props, modalType)
        

    let getModalType = (type) => {

        if (background) {
            switch(type){
         
                case 'editor':
                    editorProps['background']    = background;
                    editorProps['modalContents'] =  <AppEditor {...editorProps}/>;
                    return ModalOpener.editorModal(editorProps);

                case 'optionsMenu':
                    optionsMenuProps['background']    = background;
                    optionsMenuProps['modalContents'] = <ModalOptionsMenu {...optionsMenuProps}/>
                   return ModalOpener.optionsMenuModal(optionsMenuProps);

                case 'dropImage':
                    dropImageProps['background']    = background;
                    dropImageProps['modalContents'] = <DropImage {...dropImageProps}/>
                    return ModalOpener.dropImageModal(dropImageProps);

                default:
                    return; 
            }
        
        }
    }; 

    return (
        <div>
          {getModalType(modalType)}
        </div>
        )
   
}




export const ModalOpener = {

    optionsMenuModal(contents) {
        return ModalManager.open(
            <OptionModal {...contents} onRequestClose={() => true}/>
        );
    },


    editorModal(contents){
        
        return ModalManager.open(
            <EditModal {...contents} onRequestClose={() => true}/>
        );
    },
 

    dropImageModal(contents){

        return ModalManager.open(
            <DropImageModal {...contents} onRequestClose={() => true}/>
        );
    },
};





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
        modalStyles    : option_modal_styles,
        effect         : Effects.SlideFromBottom,
        modalContents  : props.modalContents,
        background     : props.background,
        modalType      : 'optionsMenu',
    };

    modal_props =Object.assign(modal_props, props)


   return(
      <ModalContainer {...modal_props} />
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
    position                : 'fixed',
    right                   : 'auto',
    left                    : 'auto',
   
   }
};

let desktopModalStyles  = {
    content: {
       position                : 'relative',
        margin                  : '15% auto',
        width                   : '60%',
        background              : '#F6F6F6',
        overflow                : 'auto',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
        height                  : '200px',
    }
}; 

let getEditorStyles = ()=>{
        if (window.matchMedia("(min-width: 900px)").matches) {
            return desktopModalStyles;
        } else {
            return mobileModalStyles;
        } 
    };

let getModalEffect =()=> {
        if (window.matchMedia("(min-width: 900px)").matches) {
            return Effects.ScaleUp;
        } else {
            return Effects.SlideFromBottom;
        } 

};

export const EditModal = props => {
    let modal_props = {
       modalStyles    : getEditorStyles(),
       effect         : getModalEffect() ,
       modalContents  : props.modalContents,
       background     : props.background,
       modalType      : 'editor', 

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
      modalStyles    : image_modal_styles,
      effect         : Effects.ScaleUp,
      modalContents  : props.modalContents,
      background     : props.background,
      modalType      : 'dropImage',
   }; 

   return(
      <ModalContainer {...modal_props} />
  ); 
};









export function  ModalContainer(props)  {
   
   //Render modal with pass its contents
    const {
            modalContents,
            modalStyles,
            modalType,
            effect, 
            onRequestClose,
            background } = props;
    
    return (
        <ModalBox
            style={modalStyles}
            background={background}
            modalType={modalType}
            onRequestClose={onRequestClose}
            effect={effect}>

            {modalContents}
         
        </ModalBox>
    );
};









