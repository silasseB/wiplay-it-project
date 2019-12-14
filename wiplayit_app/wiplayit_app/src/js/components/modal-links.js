
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { store } from "../configs/store-config";
import {showModal} from '../actions/actionCreators';
import {history} from "../index" 



export const EditorLink = props => {
	
    let location = useLocation();
    let  modalProps = {
            editorProps : {...props},
            modalType   : 'editor', 
        };

    let context = props.objName.toLowerCase();
    let pathname =  `/compose/${context}/${'1'}/`
    let state = { 
        background : props.background || location,
        modalProps
    } 
    

    let buildLinkName =()=> {
        let Edit = props.isPut && "Edit " || "";
        return `${Edit}${props.objName}`;
    };

    let linkName = props.linkName;
    linkName = linkName?linkName:buildLinkName();
       
    return(
        <button className=""  onClick={()=> {
                        store.dispatch(showModal(true, state.background))
                        setTimeout(()=> {
                            
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
        
        
    return(
        <button className="btn btn-sm"    onClick={()=> {
                        
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

    let  modalProps = {
            dropImageProps : {...props},
            modalType   : 'dropImage', 
        }; 
    let pathname = `/compose/${'profile-pic'}/${'1'}/`;
    let state    = { background: location, modalProps };

    return(
       
        <button className="btn-sm edit-img-btn "   onClick={()=> {
                        
                        setTimeout(()=> {
                            
                            history.push({ pathname: pathname, state}); 
                        }, 500);

                    }}>
            Change  
        </button>
   );
};



