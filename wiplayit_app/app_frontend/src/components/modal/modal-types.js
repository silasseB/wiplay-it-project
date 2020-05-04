import React from 'react';

import { ModalOptionsMenu } from "templates/buttons";
import {EditProfile, DropImage} from "components/author/edit-profile";
import UserListBox from "components/users/modal-user-list"; 
import { NavBarMenuModalItems} from "templates/navBar";
import AppEditor  from 'components/draft-js-editor/editor';
import {ModalOpener} from 'components/modal/modal-conf'


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

