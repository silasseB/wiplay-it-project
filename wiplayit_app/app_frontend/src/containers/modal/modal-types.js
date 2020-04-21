import React from 'react';

import { ModalOptionsMenu } from "components/buttons";
import EditProfile, { DropImage } from "containers/profile/edit_profile";
import UserListBox from "containers/users/modal_user_list"; 
import { NavBarMenuModalItems} from "components/navBar";
import AppEditor  from 'containers/editor';
import {ModalOpener} from 'containers/modal/modal-conf'


export const GetModalType = (props)=>{

    let {
        modalName, 
        editorProps,
        optionsMenuProps,
        navBarMenuProps,
        dropImageProps,
        userListProps } = props;


    let getEditorContents = () =>{
        let { objName } = editorProps;
        return objName === 'UserProfile' && <EditProfile {...editorProps}/> || <AppEditor {...editorProps}/>
    }
        
    //sconsole.log(props)

    switch(modalName){
        case 'editor':
            editorProps['modalContents'] = getEditorContents();
            return ModalOpener.editorModal(modalName, editorProps);

        case 'optionsMenu':
            optionsMenuProps['modalContents'] = <ModalOptionsMenu {...optionsMenuProps}/>
            return ModalOpener.optionsMenuModal(modalName, optionsMenuProps);

        case 'navigationMenu':
            navBarMenuProps['modalContents'] = <NavBarMenuModalItems {...navBarMenuProps}/>
            return ModalOpener.navBarMenuModal(modalName, navBarMenuProps);

        case 'dropImage':
            dropImageProps['modalContents'] = <DropImage {...dropImageProps}/>
            return ModalOpener.dropImageModal(modalName, dropImageProps);

        case 'userList':
            userListProps['modalContents'] = <UserListBox {...userListProps}/>
            return ModalOpener.userListModal(modalName, userListProps);

        default:
            return; 
    }
};

