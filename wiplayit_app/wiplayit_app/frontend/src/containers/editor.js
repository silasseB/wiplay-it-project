import React, { Component } from 'react';
import 'draft-js/dist/Draft.css';
import 'containers/app-editor.css';
import { CharacterMetadata, CompositeDecorator, AtomicBlockUtils,
         RichUtils,convertToRaw, convertFromRaw,Entity,
         genKey, EditorState, ContentBlock} from 'draft-js';

import { List, Repeat } from 'immutable';
import Axios from 'axios_instance'
import  Helper from 'containers/utils/helpers';
import {TextAreaEditor, DraftEditor } from  "components/editor_components";
import { EditorNavBar } from "components/navBar";

import Api from 'api';


  
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


   constructor(props) {
        super(props);
        const decorator = new CompositeDecorator([
         {
           strategy: findLinkEntities,
           component: Link,
         },
      ]);


      
      this.state = {
         editorState       : EditorState.createEmpty(decorator),
         form              : {textarea   :  "", },
         editorPlaceHolder : "", 
         postTitle         : "",
         showURLInput      : false,
         showImage         : false,
         url               : '',
         urlType           : '',
         urlValue          : '',
         italicOnClick     : false,
         boldOnClick       : false,
         onLinkInput       : false, 
         onPost            : false,
         contentIsEmpty    : true,

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

    componentDidUpdate(){
       //let contents =  JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
       //const contentState = convertFromRaw( JSON.parse( contents) );
       //console.log(JSON.parse( contents))
       //console.log(convertToRaw(this.state.editorState.getCurrentContent()))
        window.onpopstate =  (e) => {
            e.preventDefault();
           //console.log(e);
        }
    }

    componentDidMount(){
    
       //window.history.pushState({}, '');  
                              
       //window.addEventListener("popstate", this.closeEditor.bind(this));
       //window.onpopstate = this.closeEditor;

       console.log(this.props)

       let state = this.state;
       state['objName'] = this.props.objName;
       state['editorPlaceHolder'] = this.props.editorPlaceHolder;
            
       if (this.props.objName === 'post') {
         this.setState({onPost: true })
      }

      if (this.props.objId) {
         state['objId']    = this.props.objId;
      }
   
      if (this.props.isPut) {
         state['contentIsEmpty'] = false;
         if (this.props.objName === 'question') {
            state.form['textarea']  = this.props.obj.add_question; 
         }

         else if (this.props.objName === 'answer') {
            let storedState = JSON.parse(this.props.obj.add_answer);
            console.log(this.props)
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; //
           

         }

         else if (this.props.objName === 'comment') {
            let storedState = JSON.parse(this.props.obj.comment);
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; //
           
         }

         else if (this.props.objName === 'reply') {
            let storedState = JSON.parse(this.props.obj.reply);
            let editorState = this.newEditorState(storedState);
            state['editorState']  = editorState; 
             
         }
             
      }
      
      this.setState({state})
   }

    closeEditor = (e) => {
       e.preventDefault();
       e.stopPropagation();
       console.log(e);

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
      
        console.log(file)

            
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
      
      if (objName === "question") {
         let form      =  this.state.form;
         validatedForm =  helper.validateForm({form});
         validForm     =  {add_question: validatedForm.data}; 
      }
      else if (objName === "post") {
        let form      =  this.state.form;
        var add_title =  helper.validateForm({form});
        
        validForm   =  {
            add_post  : validatedForm.data,
            add_title : add_title.data, 
        };

      }

      else if(objName === "answer"){
         validForm   =  {add_answer : validatedForm.data};  
      }else if(objName === "comment"){
         validForm   =  {comment : validatedForm.data};    
      }
      else if(objName === "reply"){
         validForm   =  {reply : validatedForm.data};    
      }
      console.log(validForm, validatedForm) 
      return helper.createFormData(validForm);
   };

   getSubmitProps = () =>{
      return Object.assign({formData : this.getFormData()}, this.props);
   }


    getTextAreaProps() {

        let props = {
           value       : this.state.form.textarea,
           onChange    : this.onTextAreaChange,
           name        : "textarea",
           className   : "create-question-form",
           placeholder : this.props.editorPlaceHolder,
        };

        return props;
    };



    getProps() {
       let currentContent   = this.state.editorState.getCurrentContent();
       let editorContents = convertToRaw(currentContent);
       editorContents =  JSON.stringify(editorContents)
    
        let props =  {
            onChange          : this.onChange,
            onURLChange       : this.onURLChange,
            onPostTitleChange : this.onPostTitleChange,
            handleAddLink     : this.handleAddLink,
            promptLinkIpunt   : this.promptLinkIpunt,
            addItalic         : this.addItalic,
            addBold           : this.addBold,
            italicOnClick     : this.state.italicOnClick,
            boldOnClick       : this.state.boldOnClick,
            onLinkInput       : this.state.onLinkInput,
            onPost            : this.state.onPost,
            editorContents    : editorContents,
            editorPlaceHolder : this.state.editorPlaceHolder,
            editorState       : this.state.editorState,
            postTitle         : this.state.postTitle,
            contentIsEmpty    : this.state.contentIsEmpty,
            handleEmptyForm   : this.handleEmptyForm.bind(this),
            submitProps       : this.getSubmitProps(),
            textAreaProps     : this.getTextAreaProps(), 
        } 

        if (this.state.contentIsEmpty) {
                props['canSubmit']    = true;
                props['submitStyles'] = {opacity:'0.70',};
            }else{
                props['canSubmit']    = false;
                props['submitStyles'] = {opacity:'2',};
            }

        return Object.assign(props, this.props);
      
    }

    render() {
        let props = this.getProps();
        console.log(props)
        return (
            <div className="editors-page" onClick={this.focus}>
               <EditorNavBar {...props}/>

               {this.props.objName === "question"?
                  <TextAreaEditor {...props}/>
                  :
                  <DraftEditor {...props}/>
               }
               
            </div>
        );
    }
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


