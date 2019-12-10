import React, { Component } from 'react';

import  * as action  from '../../actions/actionCreators';
import { getQuestion } from '../../dispatch/index';
import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";
import  AjaxLoader from "../../components/ajax-loader";
import { QuestionComponent} from "../../components/question_components"
import {store} from "../../configs/store-config";
import {LocalCache} from  "../../utils/storage";

import AnswersBox from "../../containers/answer/answer_page";

import withHigherOrderIndexBox from "../../containers/index/higher_order_index";


 


class QuestionPage extends Component {
    

    constructor(props) {
        super(props);
        

        this.state = {
            question      : '',
            isQuestionBox : true, 
            pageName      : "Question", 
            questionById  : '',
            isNewQuestion : false,
        };

    };

    componentWillUnmount() {
        //this.unsubscribe();
    };


    componentDidMount() {
        
                   
        let { entities } = this.props;
        let { slug, id } = this.props.match.params;
        let  questionById = `question${id}`;

        

        if (entities) {
            let { question, currentUser } = entities;
            question = question && question[questionById]

            console.log(question)

            if(question){
                let timeStamp = question.timeStamp;

                question = question.question;
            
                var now = new Date();
                

                let msDiff   = now.getTime() - timeStamp
                let secDiff  = msDiff / 1000
                let menDiff  = secDiff / 60
                let hourDiff = menDiff/60
                let dayDiff  = hourDiff/24

                console.log(parseInt(menDiff)  + ' ' + 'Menutes ago')
                
               
                if (menDiff < 1) {
                    questionById = `question${id}`;
                    this.setState({questionById })
                    console.log('Question found from cachedEntyties')
                    store.dispatch(action.getQuestionPending(id));
                    store.dispatch(action.getQuestionSuccess(question));
                    return 
                }
               
            }
        }

        this.setState({questionById})
        return this.props.getQuestion(id);
    };
   

   
    componentDidCatch(error, info) {
        // You can also log the err or to an error reporting service
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
        var {question} = props.entities;
        question = question[questionById]
        console.log(question)
                 
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
   let question = props.entities.question;
   question = question[questionById]
   question = question.question

   let questionProps = { question};
   console.log(question)
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






