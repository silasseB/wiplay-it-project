import React, { Component } from 'react';
import { AnswersComponent } from "../../components/answer_components";
import {store} from "../../configs/store-config";
import  * as action  from '../../actions/actionCreators';
import {LocalCache} from  "../../utils/storage";



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
      let {entities, newAnswerListById, answerListById} = props;
      
      let {answers}    =  entities;
      
      let questionAnswerList   = answers && answers[answerListById];
      let newAnswers   = answers && answers[newAnswerListById];
      //console.log(answers, answerListById) 
      console.log(props, newAnswers, newAnswerListById)
         
        return (
            <div>
                <div>
                    { newAnswers?
                        <NewAddedAnswers {...props}/>
                        :
                        "" 
                    }
                </div>

                <div>
                   { questionAnswerList &&  questionAnswerList.answerList.length?
                        <div>
                            <AvailableAnswers {...props}/>
                        </div>
                        :
                        ""
                    }
                </div>

                
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
                    </div>
                );
            })}
        </div> 
    )
};


