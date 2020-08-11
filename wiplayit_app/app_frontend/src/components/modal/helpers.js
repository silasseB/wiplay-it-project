
 
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
        let contentRect =  content.getBoundingClientRect();
        let contentRectTop      = parseInt(contentRect.top);
        let contentClientHeight = parseInt(content.clientHeight)

        //console.log('contentRectTop is: ', contentRectTop)  
        //console.log('content clientHeight: ', contentClientHeight)
        //console.log('Overlay is: ', overlay.clientHeight)
        
        let totalContentHeight = contentClientHeight + contentRectTop;
        let _overlay = overlay.clientHeight - 70;

        //console.log('totalContentHeight', totalContentHeight)   
        //console.log('Now overlay is: ', _overlay)                     
        if (totalContentHeight >= _overlay) {
            console.log('Reached bottom')
           return true;
        }else{
            return false;
        }
    }
}

