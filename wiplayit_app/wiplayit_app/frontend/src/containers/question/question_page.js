import React, { Component } from 'react';

import  * as action  from 'actions/actionCreators';
import { getQuestion } from 'dispatch/index';
import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";
import  AjaxLoader from "components/ajax-loader";
import { QuestionComponent} from "components/question_components"
import {store} from "index";
import AnswersBox from "containers/answer/answer_page";

import withHigherOrderIndexBox from "containers/index/higher_order_index";


 


class QuestionPage extends Component {

   constructor(props) {
      super(props);

         this.state = {
            isQuestionBox : true, 
            pageName      : "Question", 
            questionById  : ''
         };

      };
  
   componentWillUnmount() {
   }


   componentDidUpdate(nextProps, prevState) {
     console.log(nextProps)
     //var questionById = this.state.questionById;
     //var questionEntytie = nextProps.entyties.question;

     //questionEntytie = questionEntytie.byId[questionById];

   }    


    componentDidMount() {
        console.log(this.props)
        var { state } = this.props.location;
        var { entyties } = this.props;

        if (state) {

            let { isNewQuestion, question } = state;
            var questionById = `question${question.id}`;
            this.setState({questionById})

            if (isNewQuestion) {
                store.dispatch(action.getQuestionSuccess(question))
                store.dispatch(action.Redirected());
                return ;
            }
      
            var questionEntytie = entyties.question;
            questionEntytie = questionEntytie.byId[questionById]

            if (!questionEntytie) {
                store.dispatch(getQuestion(question.id));
            }
        }
      
    };
   

   
   componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }
    
   getProps(){
      //Collect all state data and props.
      let props = {
         isQuestionBox     : this.state.isQuestionBox,
         pageName          : this.state.pageName,
         questionById      : this.state.questionById
    
      };
      return Object.assign(props, this.props );  
     
   };

   render() {
        let props = this.getProps();
        var questionById = props.questionById;
        var question = props.entyties.question;
        question = question.byId[questionById]

                 
        return (

            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />

                { question?

                    <div>
                        { question.isLoading?
                            <div className="page-spin-loader-box">
                                <AjaxLoader/>
                            </div>

                            :
                            <Questions {...props}/>
                        } 
                    </div>

                    :
                   ""  
                }           
            </div>
        );
    };
};


export default  withHigherOrderIndexBox(QuestionPage);











export const Questions = props => {
   var questionById = props.questionById;
   var questionEntytie = props.entyties.question;
   questionEntytie = questionEntytie.byId[questionById]
   var question =questionEntytie.question
   let questionProps = { question};
   Object.assign(questionProps, props) 

   
   return (
      <div className="question-page" id="question-page">
         <div>
            <QuestionComponent {...questionProps}/>

            { question.answers?
                <div>
                <div className="number-answers-box">
                    { question.answer_count > 1? 
                        <p className="items-count">{question.answer_count }  Answers</p>
                        :
                        <p className="items-count">{ question.answer_count } Answer</p>
                    }
                </div>

                
                <AnswersBox {...questionProps}/>
                </div>
               :
               <p className="items-count">No answer yet</p>
            }
         </div>
      </div>
   );
   
};






