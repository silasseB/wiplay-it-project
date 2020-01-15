
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { store } from "../configs/store-config";
import {showModal} from '../actions/actionCreators';
import {history} from "../index" 
import { ModalManager}   from  "../containers/modal/modal_container";



export const EditorLink = props => {
    //console.log(props)
	
    let {modalProps} = props ;
    let { background, modalPath } =  props;
    
    let editorProps = modalProps && modalProps.editorProps || {...props};

    modalProps = {
            editorProps,
            modalType   : 'editor', 
        };

    
    let {objName, isPut, linkName, editorLinkStyles} = editorProps;
    let context   = objName && objName.toLowerCase();
    let pathname  = modalPath || `/compose/${context}/${'1'}/`;

    let state = { 
        background : background || useLocation(),
        modalProps
    } 
    

    let buildLinkName =()=> {
        let Edit = isPut && "Edit " || "";
        return `${Edit}${objName}`;
    };

    let getEditorStyles = ()=>{
            if (window.matchMedia("(min-width: 900px)").matches) {
               return props.editorLinkDesktopStyles || {};
            } else {
              return props.editorLinkMobileStyles || {};
            } 
        };

    
    linkName   = linkName?linkName:buildLinkName();
    let styles = getEditorStyles();

    let madalParams = {
            boolValue   : true,
            modalType   : 'editor',
            background  : state.background,
        }
       
    return(
        <button style={styles} className="btn-sm"  onClick={()=> {
                        ModalManager.close('optionsMenu', state.background)
                       
                        setTimeout(()=> {
                            store.dispatch(showModal(madalParams));
                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
                    { linkName } 
        </button>
        
    );
};




export const OptionsModalLink = props => {
    let location = useLocation();
    let pathname = `/compose/${'options'}/${props.obj.id}/`;

    let  modalProps = {
            optionsMenuProps : {...props},
            modalType   : 'optionsMenu', 
        }; 

    let state = { 
        background : props.background || location,
        modalProps
    } 

    let madalParams = {
            boolValue : true,
            modalType   : 'optionsMenu',
            background  : state.background,
        }
        
        
    return(
        <button className="btn btn-sm"    onClick={()=> {
                        store.dispatch(showModal(madalParams))
                        setTimeout(()=> {

                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
             <i className="material-icons ">more_horiz</i>  
        </button>
        
    );
};





export const ChangeImageLink = props => {
    let location = useLocation();
    //console.log(props)

    let  modalProps = {
            dropImageProps : {...props},
            modalType   : 'dropImage', 
        }; 
    let pathname = `/compose/${'profile-pic'}/${'1'}/`;
    let state    = { background: location, modalProps };

    let madalParams = {
            boolValue : true,
            modalType   : 'dropImage',
            background  : state.background,
        }

    return(
       
        <button className="btn-sm edit-img-btn "   onClick={()=> {
                        store.dispatch(showModal(madalParams))

                        setTimeout(()=> {
                            
                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
            Change  
        </button>
   );
};



