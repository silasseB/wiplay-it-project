import React, { Component } from 'react';

import { CharacterMetadata, CompositeDecorator, AtomicBlockUtils,
         RichUtils,convertToRaw, convertFromRaw,Entity,
         genKey, EditorState, ContentBlock} from 'draft-js'; 

import  {ModalSubmitPending}  from 'actions/actionCreators';
import { ModalManager}   from  "components/modal/modal-container";

import { List, Repeat } from 'immutable';

import  Helper from 'utils/helpers';
import {TextAreaEditor,
        DraftEditor,
        QuestionEditor,
        PostEditor,
        ToolBar,
        MobileModalNavBar,
        DesktopModalNavBar } from  "templates/editor/editor-templates";
import {insertLink} from 'components/draft-js-editor/plugins'
import { AlertComponent } from 'templates/partial-components';
import { showModal }  from 'actions/actionCreators';

import {store} from 'store/index';
import { history } from "App";
import Api from 'utils/api';
import { handleSubmit, _GetApi }  from "dispatch/index"
import  * as action  from "actions/actionCreators";
import * as checkType from 'helpers/check-types'; 



  
const api      = new Api();
const helper   = new Helper();  

const linkText = 'texting link';

export function findLinkEntities(contentBlock, callback, contentState) {
    //console.log(contentBlock, contentState)

    contentBlock.findEntityRanges((character) => {

        const entityKey = character.getEntity();
        
        return (
            entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );

    }, callback );
};


export const RenderLink = (props) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    //console.log(url, props)

    return (
        <a href={url} title={url} className="draft-js-link" target="_blank">
            {props.children}
        </a>
    );
};

export const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: RenderLink,
            },
        ]);


export default  class AppEditor extends Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        
      
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
            onScroolStyles     : undefined,
            isDraftEditor      : true, 
        };

        this.focus             = () => this.refs.editor.focus();
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

            let message = {
                textMessage : 'You cannot submit incomplete form',
                messageType : 'error'
            }
            this.setState({ submitting : true, hasErrors : true, message, });

            setTimeout(()=> {
                this.setState({ submitting : false, hasErrors : false, message:null, });
                
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
            
                let { entities } = storeUpdate
                let { modal    } = entities

                let { submited } = this.state
                let { isPost   } = this.props;
                                
                if (modal && modal['editor']) {
                    modal = modal['editor']

                    this.setState({ submitting : modal.submitting || false });

                    if (modal.successMessage && !submited) {
                        this.setState({submited : true});
                        ModalManager.close('editor')
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
       const type = contentBlock.getType();
       console.log(contentBlock) 
  
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

            let useToken=true
            const Api = _GetApi(useToken);   

            if (!Api) {
                console.log(Api)
                 return store.dispatch(action.handleError());
            }
    

            Api.post(apiUrl, fileForm)
        
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
      if (this.state.italicOnClick) {
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
        let newEditorState;

        if (linkUrl) {
            
            let urlValue = linkUrl;
            let protocol = urlValue && urlValue.slice(0, 4)
            
            let https = 'https://';
            let http  = 'http://';


            if (protocol !== http.slice(0, 4)) {
                urlValue = `${http}${urlValue}`

            }

            console.log(linkUrl)
            console.log( protocol )
        
            newEditorState = insertLink(editorState, { url: urlValue }, linkUrl)
            console.log(newEditorState)
        }

        newEditorState = newEditorState || editorState;
        this._handleChange(newEditorState)
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
        let importantProps = {
                formData : this.getFormData(), 
                IsModal  : true,
                modalName: 'editor',
            } 

        return  Object.assign(importantProps, this.props);
    }


    getTextAreaProps() {

        let getPlaceHolder = ()=> {
            let { editorPlaceHolder, objName} = this.props;
                    
            if (objName === 'Post') {
               editorPlaceHolder = 'Title'
            }
            return editorPlaceHolder;
        }

        return {
           value       : this.state.form.textarea,
           onChange    : this.onTextAreaChange,
           name        : "textarea",
           className   : "textarea-form-field",
           placeholder : getPlaceHolder(),
           onFocus     : this.handleFocus,
           onBlur      : this.handleBlur,
        };
    };

    handleScroll=()=>{
        //console.log(event)
        let isDesktopScreenSize = window.matchMedia("(min-width: 980px)").matches;

        if (isDesktopScreenSize) {
            let modalContent   = document.getElementById('modal-content')
            let editorsBox       = document.getElementById('editors-box')
            let modalContentsRect = modalContent && modalContent.getBoundingClientRect();

            if (modalContent && modalContentsRect) {
                let modalOverlay              = document.getElementById('modal-overlay')
                let modalContentClientHeight  = parseInt(modalContent.clientHeight) + parseInt(modalContentsRect.top);
                
                console.log(modalContent.clientHeight, modalContentsRect.top)
                console.log(modalContentClientHeight,  modalOverlay.clientHeight)

                editorsBox && console.log(editorsBox.clientHeight)

                if ( modalContentClientHeight >= modalOverlay.clientHeight - 30) {
                    editorsBox && console.log(editorsBox.clientHeight, modalOverlay.clientHeight)
                    
                    let onScroolStyles   = editorsBox && {height:editorsBox.clientHeight };
                    
                    !this.state.onScroolStyles &&  this.setState({onScroolStyles})
                }
            
            }
        }

    };

    handleFocus =()=> {
        console.log('focused')
        
        if (!window.matchMedia("(max-width: 980px)").matches) {
            return;
        }

        let onScroolStyles   = { height : '100px' };
        !this.state.onScroolStyles &&  this.setState({onScroolStyles})
    }

    handleBlur =()=> {
        console.log('Blured')
        
        if (!window.matchMedia("(max-width: 980px)").matches) {
            return;
        }

        this.state.onScroolStyles &&   this.setState({onScroolStyles:undefined});
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
       

        //console.log(props)
        return (
            <div
                className="modal-editor"
                id="modal-editor"
                onClick={this.focus}
                ref="editor"
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
    let { objName} = props;

    return(
        <div>
            <MobileModalNavBar {...props}/>
            <EditorCommp {...props}/>

        </div>
        )
};


export const DesktopEditorComponent =(props)=>{
    let {currentUser, objName} = props;

    if (!currentUser) {
        let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities'))  || {};
        currentUser = cacheEntities.currentUser;
        currentUser = currentUser && currentUser.user;
    }

    let profile = currentUser && currentUser.profile;
    console.log(profile)

    return(

        <div className="desktop-editor">
            <DesktopModalNavBar {...props}/>
            { currentUser &&
                <div className="modal-user-box">
                    <div className="editor-img-box">
                        { profile && profile.profile_picture &&
                            <img alt="" 
                                 src={profile.profile_picture}
                                 className="profile-photo"/>
                            ||

                            <img alt="" 
                                 src={require("media/user-image-placeholder.png")}
                                className="profile-photo"/> 
                        }
                    </div>

                    <ul className="editor-username-box">
                        <li className="editor-username" >
                            {currentUser.first_name}  {currentUser.last_name} 
                        </li>
                    </ul>
                </div>

                || null
            }

            <div className="editors-page">
               <EditorCommp {...props}/>
            </div>

            <div className="editor-navbar-bottom">
                <div className="toolbar-box">
                    { objName === "Question"?
                        null
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



export const EditorCommp = (props)=> {
    let { objName} = props;
    console.log(objName === 'Question')

    return(
        <div className="editors-page" id="editors-page">

            { objName === 'Question' &&
                <div className="">
                    <QuestionEditor {...props}/>
                </div>
            }

            { objName === 'Post' && 
                <div> 
                    <PostEditor {...props}/>
                </div>
            }
        
            { objName !== 'Question' && objName !== 'Post' &&
                <div style={props.onScroolStyles} id="editors-box" className="editors-box">
                    <DraftEditor {...props}/>
                </div>
            }
        </div>
    )
}



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


