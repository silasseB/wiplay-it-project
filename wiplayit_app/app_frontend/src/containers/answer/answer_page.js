import React, { Component } from 'react';
import { AnswersComponent } from 'components/answer_components';
import CommentsBox from "containers/comment/comment_page";

import {store} from "store/index";
import  * as action  from 'actions/actionCreators';



class AnswersBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox       : true,
            question          : '',
            answerListById    : '', 
            newAnswerListById : '',
        };
    };
   
   
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }


    componentDidMount() {
        //console.log(this.props)
        let {questionById, question, cacheEntities } = this.props;
      
        let answerListById      = question && `answers${question.id}`;
        let newAnswerListById   = question && `newAnswers${question.id}`;

        this.setState({answerListById, newAnswerListById, question });
        
        if (question && question.answers) {
            //console.log(question);
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, question.answers));
        }
    };

       
    getProps() {
        return {...this.props, ...this.state};
    };    


    render() { 
        const props =  this.getProps();
        let { entities, 
             answerListById,
            question,
            isQuestionBox } = props;
        let {answers}  = entities;
        answers        = answers && answers[answerListById];
        let answerList = answers && answers.answerList;
        let numberOfAnswers = answerList && answerList.length;
                 
        return (
            <div className="answer-list-container">
                { answerList && answerList.length &&
                    <div>
                        { isQuestionBox &&
                            <ul className="number-answers-box">
                                { numberOfAnswers > 1 && 
                                    <li className="number-of-answers">{numberOfAnswers}  Answers</li>
                                       ||
                                    <li className="number-of-answers">{numberOfAnswers}  Answer</li>
                                }
                            </ul>
                        }
                
                        <div>
                            <AvailableAnswers {...props}/>
                        </div>
                    </div>

                    ||

                    <div>
                        { isQuestionBox &&
                            <ul className="number-answers-box">
                                <li className="number-of-answers">No answer yet</li>
                            </ul>
                        }
                    </div>
                }
            </div>
        );        
    };
};


export default AnswersBox;


const NewAddedAnswers = props => {
   let {entities, newAnswerListById} = props;
   let answers = entities && entities.answers[newAnswerListById]; 
   let isNewAnswers = true;

   let answerList = answers.answerList && answers.answerList.length && answers.answerList;  
   return Answers(props, answerList, isNewAnswers);
};

const AvailableAnswers = props => {
   let {entities, answerListById} = props;
   let answers = entities && entities.answers[answerListById]; 
   
   let answerList = answers.answerList && answers.answerList.length && answers.answerList;  
   return Answers(props, answerList);
};


export const Answers = (props, answerList, isNewAnswers=false) => {
             
    return(
        <div className="answer-container">
            { answerList && answerList.map((answer, index) => {
                let answerProps = { answer, isNewAnswers };
                answerProps = {...props, ...answerProps}; 
      
                return ( 
                   <div key={index} className="answer-contents"> 
                        <AnswersComponent {...answerProps}/>
                        <CommentsBox {...answerProps}/>
                    </div>
                );
            })}
        </div> 
    )
};


