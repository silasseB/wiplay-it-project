import React, { Component } from 'react';

import {CharacterMetadata, CompositeDecorator, AtomicBlockUtils,
         RichUtils,convertToRaw, convertFromRaw,Entity,
         genKey, EditorState, ContentBlock} from 'draft-js'; 

import  {ModalSubmitPending}  from 'actions/actionCreators';
import {ModalManager}   from  "components/modal/modal-container";

import {List, Repeat} from 'immutable';

import  Helper, {GetLoggedInUser} from 'utils/helpers';
import {TextAreaEditor,
        DraftEditor,
        QuestionEditor,
        PostEditor,
        DesktopToolBar,
        MobileModalNavBar,
        DesktopModalNavBar } from  "templates/editor/editor-templates";
import {insertLink, decorator} from 'components/draft-js-editor/plugins'
import {AlertComponent} from 'templates/partial-components';
import {showModal}  from 'actions/actionCreators';
import {handleModalScroll} from 'components/modal/helpers';
import {store} from 'store/index';
import {history} from "App";
import Api from 'utils/api';
import {handleSubmit, _GetApi }  from "dispatch/index"
import  * as action  from "actions/actionCreators";
import * as checkType from 'helpers/check-types'; 

  
const api      = new Api();
const helper   = new Helper();  



export default  class AppEditor extends Component{
    isMounted = false;

    constructor(props) {
        super(props);
        
      
        this.state = {
            editorState        : EditorState.createEmpty(decorator),
            form               : {textarea   :  "", },
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
        this.handleKeyCommand  = this.handleKeyCommand.bind(this);
        this.addBold           = this.addBold.bind(this);
        this.addItalic         = this.addItalic.bind(this);
        this.handleAddLink     = this.handleAddLink.bind(this); 
        this.promptLinkIpunt   = this.promptLinkIpunt.bind(this);
        this.submit            = this.submit.bind(this);
        this.handleFocus       = this.handleFocus.bind(this);
        this.handleBlur        = this.handleBlur.bind(this);      

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
        this.setState({ editorState, });

        const contentState = editorState.getCurrentContent();
        let validatedForm = helper.validateForm({editorContents : contentState})

        if (validatedForm.formIsValid) {
            this.setState({contentIsEmpty : false,})
        }
        else {
           this.setState({contentIsEmpty : true,})

        }

       
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
    };
   
    submit = () => {
        let { contentIsEmpty }= this.state;

        if (contentIsEmpty) {
            console.log('Form is Empth')

            let message = {
                textMessage : 'You cannot submit incomplete form',
                messageType : 'error'
            }
            this._SetErrorMessage(message)

            return
        }

        let submitProps = this.getSubmitProps();
        store.dispatch(ModalSubmitPending('editor'));
        store.dispatch(handleSubmit(submitProps));

    };

    _SetErrorMessage(message){
        this.setState({ submitting : true, hasErrors : true, message, });

        setTimeout(()=> {
            this.setState({ submitting : false, hasErrors : false, message:null, });
        }, 5000);

    }

    onEditorUpdate = () =>{
 
        const onStoreChange = () => {
            if (this.isMounted) {
                let storeUpdate   = store.getState();
          
                let { entities } = storeUpdate
                let { modal,errors    } = entities
                                                             
                if (modal && modal['editor']) {
                    modal = modal['editor']
                    this.setState({ submitting : modal.submitting });

                    if (modal.error) {
                                     
                        let message = {
                            textMessage : modal.error,
                            messageType : 'error'
                        }

                        this._SetErrorMessage(message)

                        delete modal.error;   
                    }
                }
            }
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        
        this.unsubscribe();
    };

    
    componentDidUpdate(prevProps, nextProps) {
        
       //console.log()
    }

    componentDidMount(){
        this.isMounted = true;
        this.onEditorUpdate();
        
        let {isPut, objName, obj} = this.props;
                   
        if (isPut) {
            this.setState({contentIsEmpty:false})          
            if (objName === 'About') {
                this.updateDraftEditor(obj.about_text);
                this.updateTextAreaForm(obj.about_title);
            }

            if ( objName === 'Post') {
                this.updateDraftEditor(obj.add_post);
                this.updateTextAreaForm(obj.add_title);
            }

            if (objName === 'Question') {
                this.updateTextAreaForm(obj.add_question);
            }

            else if (objName === 'Answer') {
                this.updateDraftEditor(obj.add_answer);
            }

            else if (objName === 'Comment') {
                this.updateDraftEditor(obj.comment)
            }

            else if (objName === 'Reply') {
                this.updateDraftEditor(obj.reply)
            }
        }
    };

    updateDraftEditor(value){

        const editorState  = helper.convertFromRaw(value);
        this.setState({editorState})
    };

    updateTextAreaForm(value){
        let {form} = this.state;
        let withTextArea = true;
        form['textarea']  = value; 
        this.setState({withTextArea, form})

    };

    blockStyleFn(contentBlock) {
       const type = contentBlock.getType();
       console.log(contentBlock) 
  
    }


    onURLChange(e) {
        e.preventDefault();
        let {editorState} = this.state;
            
        var reader = new FileReader();
        var file = e.target.files[0];
        let name = e.target.name;
                             
        reader.onloadend = () => {
            let apiUrl   = api.createDraftEditorContentsApi(this);
            let form     = {'draft_editor_file': file}
            let fileForm = helper.createFormData(form);

            let useToken=true
            const Api = _GetApi(useToken);   

            if (!Api) {
                return store.dispatch(action.handleError());
            }
    

            Api.post(apiUrl, fileForm)
            .then(response => {
                let {draft_editor_file} = response.data;
                const entityKey = Entity.create(name, 'IMMUTABLE', {src:draft_editor_file});
                editorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '');
                this.setState({editorState});
            })
            .catch(error => {

                if (error.request) {
                    console.log(error.request)
                }
                else if(error.response){
                    console.log(error.response)
                }
            });
        };

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
    };
      
    promptLinkIpunt(e){
        e.preventDefault()
        console.log(this);
        this.setState({onLinkInput: true})
    };

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
        this.setState({editorState, onLinkInput:false});
    };

    sendMediaContent(){}


    getFormData = () =>{
        let objName = this.props.objName;
        let form    =  this.state.form;

        let editorContents = this.state.editorState.getCurrentContent();
        let validatedForm  = helper.validateForm({editorContents});
        let validForm      = {};

        if (objName === "Question") {
            
            validatedForm =  helper.validateForm({form});
            validForm     =  {add_question: validatedForm.data}; 
        }
        else if (objName === "Post") {
            let add_title =  helper.validateForm({form});
        
            validForm = {
                add_post  : validatedForm.data,
                add_title : add_title.data, 
            };
        }

        else if(objName === "Answer"){
            validForm = {add_answer : validatedForm.data}; 

        }else if(objName === "Comment"){
            validForm = {comment : validatedForm.data};  

        }
        else if(objName === "Reply"){
            validForm = {reply : validatedForm.data};

        }
        else if(objName === "About"){
            let about_title =  helper.validateForm({form});
            validForm = {
                about_text  : validatedForm.data,
                about_title : about_title.data,
            }; 

        }

        return helper.createFormData(validForm);
    };

    getSubmitProps = () =>{
        return {
            formData : this.getFormData(),
            ...this.props, 
        };
    }


    getTextAreaProps() {

        let getPlaceHolder = ()=> {
            let { editorPlaceHolder, objName} = this.props;
                    
            if (objName === 'Post' || objName === 'About' ) {
               editorPlaceHolder = 'Title...'
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
        let {onScroolStyles}    = this.state;
        let isDesktopScreenSize = window.matchMedia("(min-width: 980px)").matches;

        if (isDesktopScreenSize) {
            let editorsBoxElem = document.getElementById('editors-box')
            let isAtBottom     = handleModalScroll();
            //editorsBoxElem && console.log(editorsBoxElem.clientHeight)

            if (editorsBoxElem && isAtBottom && !onScroolStyles) {
                onScroolStyles  = {
                    height : editorsBoxElem.clientHeight
                };

                this.isMounted && this.setState({onScroolStyles});
            }
        }
    };

    handleFocus =()=> {
        console.log('focused')
        
        if (window.matchMedia("(max-width: 980px)").matches) {
            let onScroolStyles   = { height : '100px' };

            if(!this.state.onScroolStyles){
                this.setState({onScroolStyles})
            }
        }
    }

    handhleFocus =()=> {
        this.focus()
    }

    handleBlur =()=> {
        console.log('Blured')
        
        if (window.matchMedia("(max-width: 980px)").matches) {
            this.state.onScroolStyles &&   this.setState({onScroolStyles:undefined});
        }
    }


    getProps() {
        let currentContent   = this.state.editorState.getCurrentContent();
        let editorContents   = convertToRaw(currentContent);
        editorContents       =  JSON.stringify(editorContents);
    
        return {
            ...this.props,
            onChange          : this.onChange,
            onURLChange       : this.onURLChange,
            handleAddLink     : this.handleAddLink,
            promptLinkIpunt   : this.promptLinkIpunt,
            addItalic         : this.addItalic,
            addBold           : this.addBold,
            editorContents    : editorContents,
            submit            : this.submit,
            textAreaProps     : this.getTextAreaProps(), 
            handleScroll      : this.handleScroll, 
            handleBlur        : this.handleBlur,
            handhleFocus      : this.handhleFocus,
            ...this.state,
        } 
    }

    render() {
        let props = this.getProps();
        let onSubmitStyles = props.submitting ? {opacity:'0.70',}
                                              : {opacity:'2',};

        let showAlertMessageStiles = props.hasErrors?{ display : 'block'}:
                                                     { display : 'none' };

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
            <EditorContentsComponent {...props}/>
        </div>
    )
};


export const DesktopEditorComponent =(props)=>{
    let {currentUser, objName} = props;

    if (!currentUser) {
        currentUser = GetLoggedInUser();
    }
  
    return(
        <div className="desktop-editor">
            <DesktopModalNavBar {...props}/>
            <Author {...currentUser}/>

            <div>
               <EditorContentsComponent {...props}/>
            </div>
            <DesktopToolBar {...props}/>
        </div>
    );
};

const Author =(author)=>{
    let {profile} = author;

    return(
        <div className="modal-user-box">
            <div className="editor-img-box">
                {profile && profile.profile_picture &&
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
                    {author.first_name}  {author.last_name} 
                </li>
            </ul>
        </div>
    );
}; 


export const EditorContentsComponent = (props)=> {
    let {objName, withTextArea} = props;

    switch(objName){
        case 'Question':
            return <QuestionEditor {...props}/>

        case 'Post':
        case 'About':
            return <PostEditor {...props}/>

        default:
            return <PureDraftEditor {...props}/>;  
    };

};

const PureDraftEditor =(props)=>{
    let {onScroolStyles, handhleFocus, handleScroll} = props;

    return(
        <div className="editors-page" id="editors-page">
            <div style={onScroolStyles}
                id="editors-box" 
                className="editors-box pure-draft-editor"
                onClick={()=> handhleFocus()}>
                <DraftEditor {...props}/>
            </div>
        </div>
    )
}

