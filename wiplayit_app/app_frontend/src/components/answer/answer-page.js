import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { AnswersComponent } from 'templates/answer/answer-templates';
import CommentsBox from "components/comment/comment-page";
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import  MainAppHoc from "components/index/index-hoc";

import {store} from "store/index";
import  * as action  from 'actions/actionCreators';


class AnswerContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox : true,
            question    : undefined,
            answer      : undefined,      
        };
    };


    componentDidMount() {
        console.log(this.props)
        let { match,location, entities }  =  this.props;
        let { slug, id }  =  match.params;
        let {state}       =  location; 
        let {answers}     = entities;
        let {question, answer} = state;
       
        let answerListById   = question && `newAnswers${question.id}`;

        this.setState({ answerListById, question});

        answers = answers[answerListById]
        console.log(answers, answer, answerListById)

        if (!answers) {
            console.log('dispatch answers')
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, [answer]));
        }
        
    }

    render() { 
        let props = {...this.props, ...this.state}
        let { answer,
              question,
              entities,
              answerListById} = props; 

        let {answers}    = entities;
        let questionPath = question && `/question/${question.slug}/${question.id}/`;
        answers          = answers   && answers[answerListById];
        
        console.log(entities )
      
        return(
            <div className="app-box-container app-question-box">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                
                <div className="answer-page" id="answer-page">
                    <div className="answer-container">    
                        <div className="answer-contents"> 
                            <div className="answer-question-box">
                                <p className="question">
                                    <Link to={{pathname: questionPath, state : {question} }} 
                                          className="question-link">
                                        {question  && question.add_question }
                                    </Link>
                                </p>
                            </div>
                            <AvailableAnswers {...props}/>
                        </div>
                    </div>
                </div> 
            </div>
        )
    };
} 



export default MainAppHoc(AnswerContainer);

export class AnswersBox extends Component {

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
        console.log(this.props)
        let {questionById, question, entities} = this.props;
        let {answers} = entities;

      
        let answerListById      = question && `answers${question.id}`;
        let newAnswerListById   = question && `newAnswers${question.id}`;

        this.setState({answerListById, newAnswerListById, question });

        answers = answers[answerListById]

        if (!answers) {
            if (question && question.answers) {
                //console.log(question);
                store.dispatch(action.getAnswerListPending(answerListById));
                store.dispatch(action.getAnswerListSuccess(answerListById, question.answers));
            }
        }
    };

       
    getProps() {
        return {...this.props, ...this.state};
    };

    getNumberOfAnswers(currentAnswers, newAnswers){
                    
        newAnswers            = newAnswers     && newAnswers.answerList;
        currentAnswers        = currentAnswers && currentAnswers.answerList;
        let newAnswersNum     = newAnswers     && newAnswers.length;
        let currentAnswersNum = currentAnswers && currentAnswers.length;

        let numberOfAnswers;
        console.log(currentAnswersNum, newAnswersNum)
        
        if (newAnswersNum) {
            currentAnswersNum = currentAnswersNum  + newAnswersNum;
        }

        return currentAnswersNum;
    }    


    render() { 
        const props =  this.getProps();
        let { entities, 
             answerListById,
             newAnswerListById,
             question,
             isQuestionBox } = props;

        let {answers}        = entities;
        let currentAnswers   = answers        && answers[answerListById];
        let newAnswers       = answers        && answers[newAnswerListById];
        let numberOfAnswers  = this.getNumberOfAnswers(currentAnswers, newAnswers);

        //console.log(answers,currentAnswers, newAnswers)
        //console.log(props, numberOfAnswers)
                 
        return (
            <div className="answer-list-container">
                <div>
                    {numberOfAnswers !== 0 && isQuestionBox &&
                        <ul className="number-answers-box">
                            { numberOfAnswers > 1 && 
                                <li className="number-of-answers">{numberOfAnswers}  Answers</li>
                                   ||
                                <li className="number-of-answers">{numberOfAnswers}  Answer</li>
                            }
                        </ul>
                    }
                    <div>
                        <NewAddedAnswers {...props}/>
                        <AvailableAnswers {...props}/>
                    </div>
                </div>

                <div>
                    {!numberOfAnswers && isQuestionBox &&
                        <ul className="number-answers-box">
                            <li className="number-of-answers">No answer yet</li>
                        </ul>
                    }
                </div>
               
            </div>
        );        
    };
};




const NewAddedAnswers = props => {
   let {entities, newAnswerListById} = props;
   let answers = entities && entities.answers[newAnswerListById]; 
   answers     = answers && answers.answerList;
   let isNewAnswers = true;

   let answerList = answers && answers.length && answers;  
   return answerList && Answers(props, answerList, isNewAnswers) || null;
};

const AvailableAnswers = props => {
   let {entities, answerListById} = props;
   let answers = entities && entities.answers[answerListById];
   answers     = answers && answers.answerList; 
   
   let answerList = answers && answers.length && answers;  
   return answerList && Answers(props, answerList) || null;
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


