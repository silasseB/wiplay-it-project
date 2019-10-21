import React, { Component } from 'react';
import { AnswersComponent } from "components/answer_components";



class AnswersBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAnswerBox : true,
            question : '',
            answerById  : '', 
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
        var answerById   = `answer${question.id}`;
        this.setState({answerById, question })
    };

    componentDidUpdate(nextProps, prevState) {
    
    } 
   
 
    getProps() {
   
        let props = {
            isAnswerBox  : this.state.isAnswerBox,

            answerById   : this.state.answerById,
            question  : this.state.question,
        };

        return Object.assign(props, this.props)
    };


   render() { 
      const props =  this.getProps();
      var answers      = props.entyties.answers;
      answers          = answers.byId[props.answerById]
         
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
    answers = answers.byId[props.answerById]
         
    return(
        <div>

            {answers && answers.answerList?

                <div className="answer-container">
                    
                    { answers.answerList.map((answer, index) => {

                        let answerProps = {answer : answer, index : index};

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


