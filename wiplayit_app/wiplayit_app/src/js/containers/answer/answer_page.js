import React, { Component } from 'react';
import { AnswersComponent } from "../../components/answer_components";
import {store} from "../../configs/store-config";
import  * as action  from '../../actions/actionCreators';



class AnswersBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox : true,
            question : '',
            answerListById  : '', 
        };
    };
   
   
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }


    componentDidMount() {
        var questionById =  this.props.questionById;
        var questionEntytie = this.props.entyties.question;
        questionEntytie = questionEntytie.byId[questionById];

        let question  =  questionEntytie.question;
        var answerListById   = `answers${question.id}`;
        if (question.answers) {
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, question.answers));
        }
        this.setState({answerListById, question })
    };

    componentDidUpdate(nextProps, prevState) {
    
    } 
   
 
    getProps() {
   
        let props = {
            ...this.state
        };

        return Object.assign(props, this.props)
    };


   render() { 
      const props =  this.getProps();
      var answers      = props.entyties.answers;
      console.log(answers)
      answers          = answers.byId[props.answerListById]
         
      return (
         <div>
            { answers?
               <div>
                  {answers.answerList.length?
                     <Answers {...props}/>
                     :
                     ""  
                  }
               </div>
              :
              ""
            }
         </div>
      );        
   };
};


export default AnswersBox;


export const Answers = props => {
    var answers = props.entyties.answers;
    answers = answers.byId[props.answerListById]
         
    return(
        <div>

            {answers && answers.answerList?

                <div className="answer-container">
                    
                    { answers.answerList.map((answer, index) => {

                        let answerProps = { answer };

                        Object.assign(answerProps, props); 
      
                        return ( 
                            <div key={index} className="answer-contents"> 
                                <AnswersComponent {...answerProps}/>
                            </div>
                        );
                    }
                    )}
                </div>

                :

                ""
            }

        </div> 
    )
};


