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

import { store } from "../../configs/store-config";
import { ModalOptionsMenu } from "../../components/buttons";
import EditProfile, { DropImage } from "../../containers/profile/edit_profile";
import UserListBox from "../../containers/users/modal_user_list"; 

import AppEditor  from '../../containers/editor';
import ModalBox,{ModalManager}  from "../../containers/modal/modal_container";
import * as Effects from '../../containers/modal/Effects';
import { showModal }  from '../../actions/actionCreators';


export function Modal(props) {
    
    let {background, modalProps} = props;
    console.log(props)

    let {
        modalType, 
        editorProps,
        optionsMenuProps,
        dropImageProps,
        userListProps } = modalProps !== undefined && modalProps;

    console.log(props, modalType)

    let modalStoreParams = { background, modalType  };

    let getEditorContents = ()=>{
        let { objName } = editorProps;
        return objName === 'UserProfile' && <EditProfile {...editorProps}/> || <AppEditor {...editorProps}/>
    }
        

    let getModalType = (type) => {
        

        if (background) {
            switch(type){
         
                case 'editor':
                    editorProps['background']    = background;
                    editorProps['modalContents'] = getEditorContents();
                    return ModalOpener.editorModal(editorProps, modalStoreParams);

                case 'userProfile':
                    editorProps['background']    = background;
                    editorProps['modalContents'] =  <AppEditor {...editorProps}/>;
                    return ModalOpener.editorModal(editorProps, modalStoreParams);

                case 'optionsMenu':
                    optionsMenuProps['background']    = background;
                    optionsMenuProps['modalContents'] = <ModalOptionsMenu {...optionsMenuProps}/>
                    return ModalOpener.optionsMenuModal(optionsMenuProps, modalStoreParams);

                case 'dropImage':
                    dropImageProps['background']    = background;
                    dropImageProps['modalContents'] = <DropImage {...dropImageProps}/>
                    return ModalOpener.dropImageModal(dropImageProps, modalStoreParams);

                case 'userList':
                    userListProps['background']    = background;
                    userListProps['modalContents'] = <UserListBox {...userListProps}/>
                    return ModalOpener.userListModal(userListProps, modalStoreParams);

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



    optionsMenuModal(contentsProps, modalStoreParams) {
        return ModalManager.open(
            <OptionModal {...contentsProps} onRequestClose={() => true}/>,
            modalStoreParams

        );
    },


    editorModal(contents, modalStoreParams){
        
        return ModalManager.open(
            <EditModal {...contents} onRequestClose={() => true}/>,
            modalStoreParams
        );
    },
 

    dropImageModal(contents, modalStoreParams){

        return ModalManager.open(
            <DropImageModal {...contents} onRequestClose={() => true}/>,
            modalStoreParams
        );
    },

    userListModal(contents, modalStoreParams){

        return ModalManager.open(
            <UserListModal {...contents} onRequestClose={() => true}/>,
            modalStoreParams
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

    let modal_props = {
        modalStyles    : getDropImageStyles(),
        effect         : Effects.ScaleUp,
        modalContents  : props.modalContents,
        background     : props.background,
        modalType      : 'dropImage',
    }; 

    return(
        <ModalContainer {...modal_props} />
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
    let modal_props = {
        modalStyles    : getEditorStyles(),
        effect         : Effects.ScaleUp ,
        modalContents  : props.modalContents,
        background     : props.background,
        modalType      : 'userList',
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









