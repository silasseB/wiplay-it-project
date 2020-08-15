
 
import {store } from "store/index";
import { ModalManager}   from  "components/modal/modal-container";


export const closeModals =(background)=> {

    let { entities}  = store.getState();
    let { modal } = entities;
    
    let optionsModal     = modal && modal['optionsMenu'];
    let editorModal      = modal && modal['editor'];
    let dropImageModal   = modal && modal['dropImage'];
    let userListModal    = modal && modal['userList'];
    let navigationModal  = modal && modal['navigationMenu'];
    let smsCodeFormModal = modal && modal['smsCodeForm'];
    let passwordConfirmForm = modal && modal['passwordConfirmForm'];

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
    smsCodeFormModal && smsCodeFormModal.modalIsOpen  && 
                                  ModalManager.close('smsCodeForm');
    passwordConfirmForm && passwordConfirmForm.modalIsOpen && 
                                   ModalManager.close('passwordConfirmForm'); 
                                  
    if (background) window.history.back();
};

export const handleModalScroll =()=> {
    let content      = document.getElementById('modal-content');
    let overlay      = document.getElementById('modal-overlay');

    if (content) {
        let contentRectTop      = content.getBoundingClientRect().top;
        let _contentHeight = content.clientHeight + contentRectTop;
        let _overlay = overlay.clientHeight - 80;
        
                        
        if (_contentHeight >= _overlay) {
            return true;

        }else{
            return false;
        }
    }

    return false;
}

