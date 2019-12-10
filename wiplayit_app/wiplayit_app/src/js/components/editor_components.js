import React from 'react';
import LinkInput from '../containers/input';
import { Editor,Entity,CompositeDecorator } from 'draft-js';
import TextareaAutosize from 'react-autosize-textarea';



export const ToolBar = props => {
   const textStyles  = ['BOLD', 'ITALIC'];
   const mediaStyles = ['Video','Image', 'Link', 'MoreOptions']

   const buttons = textStyles.map(style => {
      let button;
      let buttonProps = {};
      buttonProps['name']   = style;
      
      //console.log(props)
      
          
      if (style === 'BOLD' || style === "ITALIC") {

         if (style === "BOLD" ) {
            buttonProps['onClick'] = props.addBold;
            buttonProps['buttonFormat'] = 'format_bold';
            buttonProps['boldOnClick']  = props.boldOnClick;
            buttonProps['className'] = props.boldOnClick?
                                      "btn-sm active toolbar-button":
                                      "btn-sm toolbar-button";
      
            
         }
         else if (style === "ITALIC") {
            buttonProps['onClick'] = props.addItalic;
            buttonProps['buttonFormat'] = 'format_italic';

            buttonProps['className'] = props.italicOnClick?
                                      "btn-sm active toolbar-button":
                                      "btn-sm toolbar-button";
      
         }

         button = <Button {...buttonProps} key={style} />; 
      }

      return button;
      });


      const MediaBtns = mediaStyles.map(style => {
         let button;
         let buttonProps = {};
         buttonProps['style']  = style
       
         if(style === "Image" || style === "Video") {
                      
            buttonProps['onChange']     = props.onURLChange;
            

            if (style === "Image" ) {
               buttonProps['name']         = 'image';
               buttonProps['accept']       = 'image/*'; 
               buttonProps['buttonFormat'] = 'insert_photo'; 
            }
            else if (style === "Video"){
               buttonProps['name']         = 'video'
               buttonProps['accept']       = 'video/*';
               buttonProps['buttonFormat'] = 'videocam'; 
            }

            button = <ImageButton  key={style} {...buttonProps}/>
         }

         else if(style === "MoreOptions"){
           buttonProps['name']         = 'more-options'
           buttonProps['onClick']      = props.moreBtns;
           buttonProps['buttonFormat'] = 'more_horiz'; 

           button = <Button  key={style} {...buttonProps}/>

         }

         else if(style === "Link"){
            buttonProps['name']         = 'LINK'
            buttonProps['onClick']      = props.promptLinkIpunt;
            buttonProps['buttonFormat'] = 'insert_link'; 
            button = <Button  key={style} {...buttonProps}/>

         }

         return button;

      });

      return (
         <div id='toolbar'>
            <div>
            { props.onLinkInput?
               <LinkInput {...props}/>
               :
               <div className='navigation-toolbar'  onMouseDown={(e)=>e.preventDefault()}>
                  <div className="text-btns">
                     { buttons }
                  </div>

                  <div className="media-btns">
                     {MediaBtns}
                  </div>
               </div>
            }
            </div>
         </div>
      )
} 






const ImageButton = props => {
   
   return (
     
      <label  id="fileContainer" className="btn-sm toolbar-button">
         <input
            type="file"
            accept={props.accept} 
            name={props.name}
            onChange={props.onChange}
            className="image"
            value={ props.urlValue }
         />
         <span className='material-icons'>{props.buttonFormat}</span>
      </label>
     
   )
}


const Button = props => {
   //console.log(props)
   const style = props.boldOnClick? props.active:{}; 
   //console.log(style)
               
      return (

      <button
         style={style}
         onClick={props.onClick} 
         name={props.name} 
         className={props.className}>
         <span  className='image-icon material-icons'>{props.buttonFormat}</span>
      </button>

   )
}





export const TextAreaEditor = props => {
   return (
      <div className="textarea-form">
         <form className="">
            <div className="textarea-box">
               <TextareaAutosize
                     {...props.textAreaProps} 
                        rows={1}/>
            </div>
         </form>
      </div>
   );

}


export const DraftEditor = props => {
	return (
		<div>
         <div className="editor-btns-box">
            <ToolBar {...props}/>
         </div>
    
         <div className="editors-box">
            {props.objName == "Post"?
               <div>
                 <TextareaAutosize   {...props.textAreaProps} rows={1}/>
            
               </div>
              :
              ""
            }
         
            <Editor 
               editorState={props.editorState} 
               blockRendererFn={mediaBlockRenderer}
               handleKeyCommand={props.handleKeyCommand}
               onChange={props.onChange}
               decorators={CompositeDecorator}
               blockStyleFn={props.blockStyleFn}
               placeholder={props.editorPlaceHolder}
            />
         </div>
      </div>
   );
}






export  function mediaBlockRenderer(block) {
        
        if (block.getType() === 'atomic') {
          return {
            component: Media,
            editable: false,
          };
        }
        return null;
      }



export  function pageMediaBlockRenderer(block) {
        
        if (block.getType() === 'atomic') {
          return {
            component: MediaPage,
            editable: false,
          };
        }
        return null;
   }   


const Image = (props) => {
   return <img alt="" src={props.src} style={styles.media}/>
};

const Video = (props) => {
   return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
   const entity = Entity.get(props.block.getEntityAt(0));
   const {src} = entity.getData();
   const type = entity.getType();
   let media;
       
   if (type === 'image') {
      media = <Image src={src} />;
   }
   else if (type === 'video') {
      media = <Video src={src} />;
   }
   return media;
};

const MediaPage = (props) => {
   const entity = Entity.get(props.block.getEntityAt(0));
   const {src} = entity.getData();
   const type = entity.getType();
   let media;
       
   if (type === 'image') {
      media = <div style={styles.imageBox}>
                 <img alt="" src={src} style={styles.mediaPage}/>
             </div>;
   }
   else if (type === 'video') {
      media = <div style={styles.imageBox}>
               <video controls src={src} style={styles.mediaPage} />;
            </div>;
   }
   return media;
};
    

const styles = {
   root: {
      fontFamily: '\'Georgia\', serif',
      padding: 20,
      width: 600,
   },
   buttons: {
      marginBottom: 10,
   },
   urlInputContainer: {
      marginBottom: 10,
   },
   urlInput: {
      fontFamily: '\'Georgia\', serif',
      marginRight: 10,
      padding: 3,
   },
   editor: {
      border: '1px solid #ccc',
      cursor: 'text',
      minHeight: 80,
      padding: 10,
   },

   button: {
      marginTop: 10,
      textAlign: 'center',
   },

   media: {
      width     : '100%',
      height    : 'auto',
      objectFit : 'cover',
   },

   mediaPage: {
      width     : '70%',
      height    : 'auto',
      objectFit : 'cover',
   },

   imageBox: {
      border    : 'px solid red',
      margin    : '0 10px',
   }
};









