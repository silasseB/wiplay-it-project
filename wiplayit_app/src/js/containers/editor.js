import React, { Component } from 'react';
import 'draft-js/dist/Draft.css';
import '../containers/app-editor.css';
import { CharacterMetadata, CompositeDecorator, AtomicBlockUtils,
         RichUtils,convertToRaw, convertFromRaw,Entity,
         genKey, EditorState, ContentBlock} from 'draft-js';
import  {ModalSubmitPending}  from '../actions/actionCreators';
import { ModalManager}   from  "../containers/modal/modal_container";

import { List, Repeat } from 'immutable';
import Axios from '../axios_instance'
import  Helper from '../containers/utils/helpers';
import {TextAreaEditor,
        DraftEditor,
        ToolBar,
        MobileModalNavBar,
        DesktopModalNavBar } from  "../components/editor_components";

import { AlertComponent } from "../components/partial_components";
import { showModal }  from '../actions/actionCreators';

import {store} from '../configs/store-config';
import { history } from "../index";
import Api from '../api';
import { handleSubmit }  from "../dispatch/index"


  
const api      = new Api();
const helper   = new Helper();  

const linkText = 'foo bar';

function findLinkEntities(contentBlock, callback, contentState) {

    contentBlock.findEntityRanges((character) => {

        const entityKey = character.getEntity();

        return (
            entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );

    }, callback );
};


const Link = (props) => {
const { url } = props.contentState.getEntity(props.entityKey).getData();
console.log(url)


return (
    <a href={url} title={url} className="link">
      {props.children}
    </a>
  );
};




export default  class AppEditor extends Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        const decorator = new CompositeDecorator([
         {
           strategy: findLinkEntities,
           component: Link,
         },
      ]);


      
    this.state = {
        editorState        : EditorState.createEmpty(decorator),
        form               : {textarea   :  "", },
        editorPlaceHolder  : "", 
        postTitle          : "",
        showURLInput       : false,
        showImage          : false,
        url                : '',
        urlType            : '',
        urlValue           : '',
        italicOnClick      : false,
        boldOnClick        : false,
        onLinkInput        : false, 
        onPost             : false,
        contentIsEmpty     : true,
        submitting         : false,
        showSuccessMessage : false,
        hasErrors          : false,  
        errorMessage       : null,
        submited           : false,
        redirected         : false, 
        editorsBoxStyles   : undefined,
        isDraftEditor      : true, 

        

      };

      this.onChange          = this.onChange.bind(this);
      this.onTextAreaChange  = this.onTextAreaChange.bind(this);
      this.onURLChange       = this.onURLChange.bind(this);
      this.onPostTitleChange = this.onPostTitleChange.bind(this)
      this.handleKeyCommand  = this.handleKeyCommand.bind(this);
      this.addBold           = this.addBold.bind(this);
      this.addItalic         = this.addItalic.bind(this);
      this.handleAddLink     = this.handleAddLink.bind(this); 
      this.promptLinkIpunt   = this.promptLinkIpunt.bind(this);
   };

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        console.log(newState)
        if (newState) {
            console.log(newState)
            this.onChange(newState);
            return 'handled';
        }

        console.log(newState)
        return 'not-handled';
    }

   

    onChange(editorState){

        const contentState = editorState.getCurrentContent();
        
        let validatedForm = helper.validateForm({editorContents : contentState})

        if (validatedForm.formIsValid) {
            this.setState({contentIsEmpty : false,})
        }
        else {
           this.setState({contentIsEmpty : true,})

        }

        this.setState({ editorState, });
    };



   onTextAreaChange(event) {
      event.preventDefault();
      let form = this.state.form;
      form[event.target.name] = event.target.value;
      this.setState({form});

      let validatedForm = helper.validateForm({form : this.state.form})
      if (validatedForm.formIsValid) {
         this.setState({contentIsEmpty : false,})
      }else {
         this.setState({contentIsEmpty : true,})

      }


   }

   
   
    handleEmptyForm(params){
       console.log(params)

    } 

    subimtCleanForm =()=>{
        let { contentIsEmpty }= this.state;

        if (contentIsEmpty) {
            console.log('Form is Empth')
            this.setState(
                {
                    submitting   : true,
                    hasErrors    : true,
                    errorMessage : 'You cannot submit empty form'
                });

            setTimeout(()=> {
                this.setState(
                    {
                       submitting   : false,
                       hasErrors    : false,
                       errorMessage : null
                    }
                ); 
            }, 5000);

            return
        }

        let submitProps = this.getSubmitProps();
        store.dispatch(ModalSubmitPending('editor'));
        store.dispatch(handleSubmit(submitProps));

    }

    onEditorUpdate = () =>{
 
        const onStoreChange = () => {
            if (this._isMounted) {

                let storeUpdate   = store.getState();
            
                let {entities} = storeUpdate
                let {modal} = entities
                let { submited } = this.state
                let {background, isPost} = this.props;
                modal = modal['editor']

                if (modal) {

                    this.setState({ submitting : modal.submitting || false });

                    if (modal.successMessage && !submited) {

                        this.setState({submited : true});
                        ModalManager.close('editor' ,background)
                    }



                }
            }
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this._isMounted = false;
        
        this.unsubscribe();
    };

    
    componentDidUpdate(prevProps, nextProps) {
        
       //console.log()
    }

    componentDidMount(){
        this._isMounted = true;
        //this.setState({submited : false, redirected: false});
        this.onEditorUpdate();
       
       let state = this.state;
       state['objName'] = this.props.objName;
       state['editorPlaceHolder'] = this.props.editorPlaceHolder;
            
       if (this.props.objName === 'Post') {
         this.setState({onPost: true })
       }

      if (this.props.objId) {
         state['objId']    = this.props.objId;
      }
   
        if (this.props.isPut) {
            state['contentIsEmpty'] = false;

            if (this.props.objName === 'Post') {
               let storedState = JSON.parse(this.props.obj.add_post);
               console.log(this.props)

               let editorState = this.newEditorState(storedState);
               state['editorState']  = editorState; //
               state.form['textarea']  = this.props.obj.add_title;
            }

         if (this.props.objName === 'Question') {
            state.form['textarea']  = this.props.obj.add_question; 
         }

         else if (this.props.objName === 'Answer') {
            let storedState = JSON.parse(this.props.obj.add_answer);
            console.log(this.props)
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; //
           

         }

         else if (this.props.objName === 'Comment') {
            let storedState = JSON.parse(this.props.obj.comment);
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; //
           
         }

         else if (this.props.objName === 'Reply') {
            let storedState = JSON.parse(this.props.obj.reply);
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; 
             
         }
             
      }
      
      this.setState({...state})
   }

    


    newEditorState(storedState){
       const contentState = convertFromRaw(storedState);
       return  EditorState.createWithContent(contentState);
    }

    blockStyleFn(contentBlock) {
       //const type = contentBlock.getType();
       //console.log(contentBlock) 
  
    }

    onPostTitleChange(e){
        e.preventDefault();
        console.log(e.target)
      
        this.setState({ postTitle:  e.target.value, });
    }

    onURLChange(e) {
        e.preventDefault();
        const {editorState} = this.state;
            
        var reader = new FileReader();
        var file = e.target.files[0];
        let name = e.target.name;
      
        //console.log(file)
                    
        reader.onloadend = () => {
            let apiUrl     = api.createDraftEditorContentsApi(this);
            let form = { 'draft_editor_file': file}
            let fileForm   = helper.createFormData(form);
            const axiosApi = new Axios(true);
            let instance   = axiosApi.axiosInstance();  


            instance.post(apiUrl, fileForm)
        
            .then(response => {
            
            const entityKey = Entity.create(name, 'IMMUTABLE', {src: response.data.draft_editor_file});

            this.setState({
                editorState: AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                ' '
               ),
             
            });
           
                      
         })
         .catch(error => {

            if (error.request) {
               console.log(error.request)
            }
            else if(error.response){
               console.log(error.response)
            }
         })
      }

      reader.readAsDataURL(file);
   

    };

   
   addBold(e){
      e.preventDefault();
      if (this.state.boldOnClick) {
         this.setState({boldOnClick : false});
      }else{
         this.setState({boldOnClick : true});
      }

      this.toggleInlineStyle('BOLD');
   }     

   addItalic(e){
      e.preventDefault();
      if (! this.state.italicOnClick) {
         this.setState({italicOnClick:false})
      }else{
         this.setState({italicOnClick:true})
      }
      this.toggleInlineStyle('ITALIC'); 
   }
   
   toggleInlineStyle(style){
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
   }
      
   promptLinkIpunt(e){
      e.preventDefault()
      console.log(this);
      this.setState({onLinkInput: true})
   }

    handleAddLink(linkUrl) {
        const { editorState } = this.state;
        let newEditorState = new inser_block('before', editorState)
   
        //const blockMap = contentState.getBlockMap();
        // create link entity

        const newContentState = newEditorState.getCurrentContent();
        const contentStateWithEntity = newContentState.createEntity(
                                                'LINK',
                                                'MUTABLE',
                                                { url: linkUrl }
                                          );


        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        newEditorState = EditorState.set(newEditorState, { currentContent: contentStateWithEntity });

        newEditorState = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);

        this._handleChange(newEditorState)
  
        console.log(newEditorState)
    };

    _handleChange = (editorState) => {
        this.setState({ editorState, onLinkInput:false });
    };

    sendMediaContent(){}


    getFormData = () =>{
      let editorContents = this.state.editorState.getCurrentContent();
      let validatedForm  = helper.validateForm({editorContents});
      var validForm      = {};

      var objName = this.props.objName;
      
      if (objName === "Question") {
         let form      =  this.state.form;
         validatedForm =  helper.validateForm({form});
         validForm     =  {add_question: validatedForm.data}; 
      }
      else if (objName === "Post") {
        let form      =  this.state.form;
        var add_title =  helper.validateForm({form});
        
        validForm   =  {
            add_post  : validatedForm.data,
            add_title : add_title.data, 
        };

      }

      else if(objName === "Answer"){
         validForm   =  {add_answer : validatedForm.data};  
      }else if(objName === "Comment"){
         validForm   =  {comment : validatedForm.data};    
      }
      else if(objName === "Reply"){
         validForm   =  {reply : validatedForm.data};    
      }
      //console.log(validForm, validatedForm) 
      return helper.createFormData(validForm);
   };

   getSubmitProps = () =>{
      return Object.assign({
                       formData : this.getFormData(), 
                       IsModal  : true,
                       modalType: 'editor',
                    }, this.props);
   }


    getTextAreaProps() {

        let props = {
           value       : this.state.form.textarea,
           onChange    : this.onTextAreaChange,
           name        : "textarea",
           className   : "textarea-form-field",
           placeholder : this.props.editorPlaceHolder,
           onFocus     : this.handleFocus,
           onBlur      : this.handleBlur,
        };

        return props;
    };

    handleScroll=()=>{
        //console.log(event)
        let isDesktopScreenSize = window.matchMedia("(min-width: 900px)").matches;

        if (isDesktopScreenSize) {
            let modalContent   = document.getElementById('modal-content')
            let modalContentsRect = modalContent && modalContent.getBoundingClientRect();

            if (modalContent && modalContentsRect) {
                let modalOverlay              = document.getElementById('modal-overlay')
                let modalContentClientHeight  = parseInt(modalContent.clientHeight) + parseInt(modalContentsRect.top);
               

                if (modalContentClientHeight >= modalOverlay.clientHeight - 30) {
                    let editorsBox       = document.getElementById('editors-box')
                    let editorsBoxStyles = editorsBox && {height:editorsBox.clientHeight };

                    !this.state.editorsBoxStyles &&  this.setState({editorsBoxStyles})
                }
            
            }
        }

    };

    handleFocus =()=> {
        console.log('focused')
        //alert('focused')
    }

    handleBlur =()=> {
        console.log('Blured')
    }


    getProps() {
        let currentContent   = this.state.editorState.getCurrentContent();
        let editorContents   = convertToRaw(currentContent);
        editorContents       =  JSON.stringify(editorContents)
    
        let props =  {
            onChange          : this.onChange,
            onURLChange       : this.onURLChange,
            onPostTitleChange : this.onPostTitleChange,
            handleAddLink     : this.handleAddLink,
            promptLinkIpunt   : this.promptLinkIpunt,
            addItalic         : this.addItalic,
            addBold           : this.addBold,
            editorContents    : editorContents,
            handleEmptyForm   : this.handleEmptyForm.bind(this),
            subimtCleanForm   : this.subimtCleanForm.bind(this),
            submitProps       : this.getSubmitProps.bind(this),
            textAreaProps     : this.getTextAreaProps(), 
            handleScroll      : this.handleScroll, 
            handleFocus       : this.handleFocus,
            handleBlur        : this.handleBlur,
            ...this.state,
        } 
      
        return Object.assign(props, this.props);
      
    }

    render() {
        let props = this.getProps();
        let onSubmitStyles = props.submitting ? {opacity:'0.70',}
                                              : {opacity:'2',};

        let showAlertMessageStiles = props.hasErrors?{ display : 'block'}:
                                                     { display : 'none' };
       

        console.log(props)
        return (
            <div
                className="modal-editor"
                id="modal-editor"
                onClick={this.focus}
                onScroll={props.handleScroll()}
                >
                <fieldset style={onSubmitStyles} 
                      disabled={ props.submitting } >
                    <EditorCommponent {...props}/>
                </fieldset>

                <div style={showAlertMessageStiles}>
                    <AlertComponent {...props}/>
                </div>
               
            </div>
        );
    }
};

const EditorCommponent = (props)=>{
    if (window.matchMedia("(min-width: 900px)").matches) {
            return DesktopEditorComponent(props);
        } else {
            return MobileEditorComponent(props);
        } 
    
};


export const MobileEditorComponent =(props)=>{
    

    return(
        <div className="editors-page" id="editors-page">
            <MobileModalNavBar {...props}/>
            { props.objName === "Question"?
                <TextAreaEditor {...props}/>
                :
                <DraftEditor {...props}/>
            }

        </div>
        )
};



export const DesktopEditorComponent =(props)=>{
    let {currentUser, objName} = props;
    //console.log(props.toolBarStyles)

    return(

        <div className="desktop-editor">
            <DesktopModalNavBar {...props}/>

            <div className="modal-user-box">
                <div className="editor-img-box">
                    { currentUser.profile && currentUser.profile.profile_picture?
                        <img alt="" src={currentUser.profile.profile_picture} className="profile-photo"/>
                        :
                        <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/> 
                    }
                </div>

                <ul className="editor-username-box">
                    <li className="editor-username" >
                        {currentUser.first_name}  {currentUser.last_name} 
                    </li>
                </ul>

            </div>

            <div className="editors-page">
                { objName === "Question"?
                    <TextAreaEditor {...props}/>
                    :
                    <DraftEditor {...props}/>
                }
            </div>

            <div className="editor-navbar-bottom">
                <div className="toolbar-box">
                    { objName === "Question"?
                        ""
                        :
                        <ToolBar {...props}/>
                    }
                </div>

                <div className="editor-submit-btn-box">
                    <button type="button" onClick={()=> props.subimtCleanForm()}
                           className="editor-submit-btn ">
                            Submit
                    </button>
                </div>
            </div>

        </div>
    );
};




export const inser_block = (direction, editorState) => {
    //const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    //const currentBlock = contentState.getBlockForKey(selection.getEndKey());

   const blockMap = contentState.getBlockMap()
   // Split the blocks
   //const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
     // return v === currentBlock
   //})
   //const blocksAfter = blockMap.toSeq().skipUntil(function (v) {
     // return v === currentBlock
   //}).rest()

   //const newBlockKey = genKey()
   

   const newBlock = new ContentBlock({
        key: genKey(),
        text: linkText,
        type: 'unstyled',
        characterList: new List(Repeat(CharacterMetadata.create(), linkText.length)),

   });

   const newBlockMap = blockMap.toSeq().concat([[newBlock.getKey(), newBlock]]).toOrderedMap();
   const newContent  = contentState.merge({
        blockMap: newBlockMap,


    })


   

   let newEditorState = EditorState.push(editorState, newContent, 'insert-fragment');

   //let newSelection = new SelectionState({
     // anchorKey: newBlockKey,
     // anchorOffset: 0,
     // focusKey: newBlockKey,
     // focusOffset: linkText.length
    //});
    
    //newEditorState = EditorState.forceSelection(newEditorState, newSelection);

   return newEditorState
}


