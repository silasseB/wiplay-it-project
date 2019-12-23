import React, { Component } from 'react';
import { AnswersComponent } from "../../components/answer_components";
import {store} from "../../configs/store-config";
import  * as action  from '../../actions/actionCreators';
import {LocalCache} from  "../../utils/storage";



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
      console.log(this.props)
      let {questionById, question, cacheEntities } = this.props;
      //let { question } =  cacheEntities;
      
        //question = question && question[questionById];

        var answerListById   = question && `answers${question.id}`;
        console.log(question)

        if (question && question.answers) {
            console.log(question);
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, question.answers));

        }

        this.setState({answerListById, question })
    };

       
 
    getProps() {
   
        let props = {
            ...this.state
        };

        return Object.assign(props, this.props)
    };


   render() { 
      const props =  this.getProps();
      console.log(props)
      var answers      = props.entities.answers;
      
      answers          = answers[props.answerListById]
         
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
    var answers = props.entities.answers;
    answers = answers[props.answerListById]
         
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


