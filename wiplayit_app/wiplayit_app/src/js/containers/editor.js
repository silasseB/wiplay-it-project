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
import {TextAreaEditor, DraftEditor, EditorNavBar } from  "../components/editor_components";
import { AlertComponent } from "../components/partial_components";
import {showModal}  from '../actions/actionCreators';

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
        store.dispatch(ModalSubmitPending());
        store.dispatch(handleSubmit(submitProps));

    }

    onEditorUpdate = () =>{
 
        const onStoreChange = () => {
            if (this._isMounted) {

                let storeUpdate   = store.getState();
            
                let {entities} = storeUpdate
                let {modal} = entities
                let { redirected, submited } = this.state
                let {background, isPost} = this.props;

                console.log(modal, this.state, this.props)

                if (modal) {
                    !modal.modalIsOpen && setTimeout(()=> {
                        //ModalManager.close()
                    }, 2000);

                    this.setState({ submitting : modal.submitting || false });

                    if (modal.successMessage && !submited) {

                        this.setState({submited : true});
                        ModalManager.close(background)

                        let {objName, data} = modal;
                        let canRedirect = objName === "Question" || objName === "Post" || false;
                        isPost = isPost || false;

                        if (canRedirect  && isPost && !redirected) {
                            this.setState({ redirected : true});

                            let obj = data.question || data.post;
                            console.log(obj, data)

                            let pathToPost     = `post/${obj.slug}/${obj.id}/`
                            let pathToQuestion = `question/${obj.slug}/${obj.id}/`

                            let redirectTo = objName === "Question" ? pathToQuestion
                                                            : pathToPost;
                            setTimeout(()=> {
                                history.push(redirectTo); 
                            }, 2000  );
  
                        }
                    }

                    return;

                }
            }
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this._isMounted = false;
        
        this.unsubscribe();
    };

    

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
      
        console.log(file)
        alert('hi')

            
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
      console.log(validForm, validatedForm) 
      return helper.createFormData(validForm);
   };

   getSubmitProps = () =>{
      return Object.assign({
                       formData : this.getFormData(), 
                       IsModal  : true
                    }, this.props);
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
            editorContents    : editorContents,
            handleEmptyForm   : this.handleEmptyForm.bind(this),
            subimtCleanForm   : this.subimtCleanForm.bind(this),
            submitProps       : this.getSubmitProps.bind(this),
            textAreaProps     : this.getTextAreaProps(), 
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
            <div className="editors-page" onClick={this.focus}>
                <fieldset style={onSubmitStyles} 
                      disabled={ props.submitting } >
                    <EditorNavBar {...props}/>

                    { props.objName === "Question"?
                        <TextAreaEditor {...props}/>
                        :
                        <DraftEditor {...props}/>
                    }
                </fieldset>

                <div style={showAlertMessageStiles}>
                    <AlertComponent {...props}/>
                </div>
               
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


