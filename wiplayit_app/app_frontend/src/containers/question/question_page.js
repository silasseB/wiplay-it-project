import React, { Component } from 'react';

import  * as action  from 'actions/actionCreators';
import { getQuestion } from 'dispatch/index';
import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";
import  AjaxLoader from "components/ajax-loader";
import { QuestionComponent} from "components/question_components"
import {store} from "store/index";
import AnswersBox from "containers/answer/answer_page";
import GetTimeStamp from 'utils/timeStamp';
import { UnconfirmedUserWarning } from "components/partial_components";
import withHigherOrderIndexBox from "containers/index/higher_order_index";


 


class QuestionPage extends Component {
    

    constructor(props) {
        super(props);
        

        this.state = {
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

            //console.log(question)

            if(question){
                let timeStamp = question.timeStamp;

                question = question.question;
                const getTimeState = new GetTimeStamp({timeStamp});
                let menDiff        = parseInt(getTimeState.menutes());

                console.log(menDiff  + ' ' + 'Menutes ago')
                
               
                if (menDiff < 10) {
                    questionById = `question${id}`;
                    this.setState({questionById })
                    console.log('Question found from cachedEntyties')
                    store.dispatch(action.getQuestionPending(questionById));
                    store.dispatch(action.getQuestionSuccess(questionById, question));
                    return 
                }
               
            }
        }

        console.log('Fetching question data form the server') 
        this.setState({questionById})
        return this.props.getQuestion(id);
    };
   

   
    componentDidCatch(error, info) {
        // You can also log the err or to an error reporting service
        console.log(error, info);
    }
    
    getProps() {
        return {...this.props, ...this.state};
    };

    render() {
        let props = this.getProps();
        let { questionById, entities} = props;
        let { question } = entities && entities;
        question = question && question[questionById]
        //console.log(props, questionById, question)
                 
        return (

            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />

                { question?

                    <div className="app-box-container">
                        <UnconfirmedUserWarning {...props}/>
                        { question.isLoading?
                            <div className="page-spin-loader-box question-page-loader">
                                <AjaxLoader/>
                            </div>

                            :
                            <Questions {...props}/>
                        } 
                    </div>

                    :
                    null  
                }           
            </div>
        );
    };
};


export default  withHigherOrderIndexBox(QuestionPage);











export const Questions = props => {
   var {questionById, entities} = props;
   let {question, answers} = entities;
   
   question = question && question[questionById];
   question = question && question.question;

   let newAnswerListById = question && `newAnswers${question.id}`;
   let newAnswers        = answers  && answers[newAnswerListById];
   let newAnswersLength  = newAnswers &&  newAnswers.answerList && newAnswers.answerList.length || 0;

   let totalAnswersLength = question && question.answer_count + newAnswersLength;

   let questionProps = { question};
   
   questionProps = {...props, ...questionProps}; 

   
    return (
        <div className="question-page" id="question-page">
        {question &&
            <div className="question-container">
                <QuestionComponent {...questionProps}/>

                {  question.answers || newAnswers?
                    <div className="answer-list-container">
                        <ul className="number-answers-box">
                            { totalAnswersLength > 1? 
                                <li className="number-of-answers">{totalAnswersLength}  Answers</li>
                                :
                                <li className="number-of-answers">{ totalAnswersLength } Answer</li>
                            }
                        </ul>
                
                        <AnswersBox {...questionProps}/>
                    </div>
                    :

                    <p className="items-count">No answer yet</p>
                }
            </div>
            
        }
        </div>
    );
};






