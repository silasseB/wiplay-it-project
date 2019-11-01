import React, { Component } from 'react';

import { QuestionComponent} from "../../components/question_components"
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";
import  AjaxLoader from "../../components/ajax-loader";
 








class  QuestionListPage extends Component  {
    constructor(props) {
      super(props);

      this.state = {
         isQuestionListBox   : true,
         questionListById : 'questionList'

      }
     
   }
  
   componentWillMount() {
      console.log(this.props)

   }

   
   componentDidMount() {
      console.log(this.props)
      var questionListById = this.state.questionListById;
      
      var questions = this.props.entyties.questions;
      questions = questions.byId[questionListById]
      

      this.props.getQuestionList(questionListById);                           
      
          
   }

   

   getProps(){
      let props = {
         isQuestionListBox  : this.state.isQuestionListBox,
         pageName       : "Questions",
         questionListById : this.state.questionListById,
      }
      return Object.assign(props,this.props);
   };

   render() {
      let props = this.getProps();
      //let style =  {border:'1px solid red',padding:'60px 0 0 0', margin:'100px 0 0 0'}
      var questions  = props.entyties.questions;
      
      questions  = questions.byId[props.questionListById];
      console.log(props, questions)
      return (
         <div style={{}}>
            <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} /> 
               {questions?
                  <div>
                     { questions.isLoading? 
                        <div  className="page-spin-loder-box">
                           <AjaxLoader/>
                        </div>
                        : 
                        <div>
                           <Questions {...props}/>   
                        </div>
                     }
                  </div>
               :
               ""
            }
         </div>
      );
  };

}


export default withHigherOrderIndexBox(QuestionListPage);






const Questions = props => {

   var questions  = props.entyties.questions;
   questions  = questions.byId[props.questionListById];

   return (
      <div>
         <div className="home-page-contents">

            { questions.questionList.map(( question, index )  => {
               let questionProps = {question} 
               Object.assign( questionProps, props);
               
               return (
                  <div key={question.id} >
                    <QuestionComponent {...questionProps}/>
                  </div>
                  )
               }
            )}

         </div>
      </div>        
   )
}





 