import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { EditorNavBar  } from "./components/navBar";
import  Helper from './containers/utils/helpers';
import {createQuestionPending,createQuestionSuccess,
        updateQuestionPending, updateQuestionSuccess, 
        updateQuestionError, createQuestionError } from "actions/question";

import {  ModalNavBar  } from "./components/navBar";
import Api from './api';

const api      = new Api();
let helper = new Helper();

export default class ModalForm extends React.Component {
 
    constructor(props) {
        super(props);

        this.state = {

          form: {textarea   :  "", },
          formData       : {},
          objId          : '',
          objIndex       : '',
          objName        : '', 
          isEdit         : false,
          isPost         : false,
          isPut          : false,
          contentIsEmpty : true,
          submitProps    : {},
 

        };

        this.handleChange    = this.handleChange.bind(this);
        this.handleEmptyForm = this.handleEmptyForm.bind(this);
       
    }

    componentDidMount() {
      console.log(this.props)

      let state = this.state;

      state['objName'] = this.props.objName;

      if (this.props.objId) {
         state['objId']    = this.props.objId;
      }
      

      if (this.props.isEdit) {
         let form = state.form;

         if (this.props.objName === 'question') {
            form['textarea']  = this.props.obj.add_question; //
         }

         state['isEdit']   = this.props.isEdit;
         state['objIndex'] = this.props.objIndex;
         state['form']     = form;
         state['contentIsEmpty'] = false;
      }
      else if(this.props.isPost) {
         state['isPost']   = this.props.isPost;
      }

      this.setState({state})

    }
 
      
   handleChange(event) {
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


   getFormData = () =>{
    let validatedForm = helper.validateForm({form : this.state.form})
    return helper.createFormData({add_question: validatedForm.data})
   }

   getSubmitProps = () =>{
      let props = {};
      
      if (this.props.isEdit) {
          props['apiUrl'] = api.updateQuestionApi(this)
          props['handlPending']  = updateQuestionPending;
          props['handleSuccess'] = updateQuestionSuccess;
          props['handleError']   = updateQuestionError;

      }else if(this.props.isPost){
         props['isPost'] = this.props.isPost;
         props['apiUrl'] = api.createQuestionApi(this);
         props['handlPending']    = createQuestionPending;
         props['handleSuccess']   = createQuestionSuccess;
         props['handleError']     = createQuestionPending;
      }
      if (this.props.objIndex) {
         props['objIndex'] = this.props.objIndex
      }

      if (this.props.objId) {
         props['objId']    = this.props.objId;
      }

      return Object.assign(
       {formData : this.getFormData(), objName : this.props.objName,}, props);
   }

   getProps(){

      let props = {
         form            : this.state.form,
         handleEmptyForm : this.handleEmptyForm, 
         contentIsEmpty  : this.state.contentIsEmpty,
         submitProps     : this.getSubmitProps(),
      };

      if (this.props) {
         Object.assign(props, this.props);
      };

      return props;
   };
  

   getformProps() {

      let props = {
        value       : this.state.form.textarea,
        onChange    : this.handleChange,
        name        : "textarea",
        className   : "create-question-form",
        placeholder : "Add Question",
      };

      return props;
   };

        
   render() {

     let props = this.getProps(); 

      return (
        <div className="textarea-form">
          <EditorNavBar {...props}/>
            <form className="">
              <div className="textarea-box">
                <TextareaAutosize
                   {...this.getformProps()} 
                   rows={1}/>
              
              </div>
            
            </form>
          </div>
 
      );
    }     
}



