
import React from 'react';
import { Link, useLocation } from "react-router-dom";


export const EditorLink = props => {
	console.log(props)
    let location = useLocation();
    let  modalProps = {
            editorProps : {...props},
            modalType   : 'editor', 
        };

    let context = props.objName.toLowerCase();

    return(
        <Link id="create-question" className="btn btn-sm  create-question"
                to={{
            pathname: `/compose/${context}/${'1'}/`,
            // This is the trick! This link sets
            // the `background` in location state.
            state: { background: location, modalProps }
          }}
           >
           {props.objName}  
        </Link>
   );
};




export const OptionsModalLink = props => {
    let location = useLocation();

    let  modalProps = {
            optionsMenuProps : {...props},
            modalType   : 'optionsMenu', 
        }; 
        
        
    return(
        <Link id="create-question" className="btn btn-sm  create-question"
                to={{
            pathname: `/compose/${'options'}/${'1'}/`,
            // This is the trick! This link sets
            // the `background` in location state.
            state: { background: location, modalProps }
          }}
           >
           <i className="material-icons ">more_horiz</i>  
        </Link>
   );
};





export const ChangeImageLink = props => {
    let location = useLocation();

    let  modalProps = {
            dropImageProps : {...props},
            modalType   : 'dropImage', 
        }; 
    

    return(
        <Link id="create-question" className="btn btn-sm  create-question"
                to={{
            pathname: `/compose/${'profile-pic'}/${'1'}/`,
            // This is the trick! This link sets
            // the `background` in location state.
            state: { background: location, modalProps }
          }}
           >
           Ask  
        </Link>
   );
};


