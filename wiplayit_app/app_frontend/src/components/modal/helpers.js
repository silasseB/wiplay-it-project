
 
import {store } from "store/index";
import { ModalManager}   from  "components/modal/modal-container";


export const closeModals =()=> {
    let { entities}  = store.getState();
    let { modal } = entities;
    console.log(modal)
    let optionsModal     = modal && modal['optionsMenu'];
    let editorModal      = modal && modal['editor'];
    let dropImageModal   = modal && modal['dropImage'];
    let userListModal    = modal && modal['userList'];
    let navigationModal  = modal && modal['navigationMenu'];

    editorModal     && editorModal.modalIsOpen      &&
                                     ModalManager.close('editor');
    optionsModal    && optionsModal.modalIsOpen     &&
                                     ModalManager.close('optionsMenu');

    dropImageModal  && dropImageModal.modalIsOpen   &&
                                    ModalManager.close('dropImage'); 

    userListModal   && userListModal.modalIsOpen    && 
                                  ModalManager.close('userList'); 
                                        
    navigationModal && navigationModal.modalIsOpen  && 
                                  ModalManager.close('navigationMenu');
};

