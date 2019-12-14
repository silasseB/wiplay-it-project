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
    let history = useHistory();
    let {background} = props || props.modalProps;
    let {
        modalType, 
        editorProps,
        optionsMenuProps,
        dropImageProps, 
                        } = props && props.modalProps;

    console.log(props, modalType)
    
    let back = e => {
       e.stopPropagation();
       history.goBack();
    };

    let getModalType = (type) => {

        if (background) {
            switch(type){
         
                case 'editor':
                    editorProps['background'] = background;
                    editorProps['modalContents'] =  <AppEditor {...editorProps}/>;
                    return ModalOpener.editorModal(editorProps);

                case 'optionsMenu':
                   optionsMenuProps['background'] = background;
                   optionsMenuProps['modalContents'] = <ModalOptionsMenu {...optionsMenuProps}/>
                   return ModalOpener.optionsMenuModal(optionsMenuProps);

                case 'dropImage':
                    dropImageProps['background'] = background;
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
      modal_styles   : option_modal_styles,
      effect         : Effects.SlideFromBottom,
      modalContents  : props.modalContents,
      background     : props.background,
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
       effect         : Effects.SlideFromBottom ,
       modalContents  : props.modalContents,
       background     : props.background,

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
      effect         : Effects.ScaleUp,
      modalContents  : props.modalContents,
      background     : props.background,
   }; 

   return(
      <ModalContainer {...modal_props} />
  ); 
};









export function  ModalContainer(props)  {
   
   //Render modal with pass its contents
    const { modalContents, modal_styles ,effect, onRequestClose, background } = props;
    
    return (
        <ModalBox
            style={modal_styles}
            background={background}
            onRequestClose={onRequestClose}
            effect={effect}>

            {modalContents}
         
        </ModalBox>
    );
};









