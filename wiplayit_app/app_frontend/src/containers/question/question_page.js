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
        
        console.log(this.props) 
                        
        let { entities,
              match,
              location }  =  this.props;

        let { slug, id }  =  match.params;
        let {state}       =  location; 

        this.setState({questionById: `question${id}`})
        
        if (state && state.recentlyCreated) {
            let question = state.question;
            console.log('Question recently created')
            this.dispatchToStore( `question${id}`, question)
            return; 
        }

        let { question } = entities;
        question = question && question[`question${id}`]
        !question && this.updateQuestionStore(id);
      
    };

    updateQuestionStore(id){

        let { cacheEntities } = this.props;
        let { question }     = cacheEntities && cacheEntities;
        question = question[`question${id}`]

        if (question) {
            let timeStamp = question.timeStamp;
            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = parseInt(getTimeState.menutes());
            console.log(menDiff  + ' ' + 'Menutes ago')
                
               
            if (menDiff < 10) {
                question     = question.question;
                let questionById = `question${id}`;
                this.setState({questionById })
                console.log('Question found from cachedEntyties')
                this.dispatchToStore(questionById, question)

                return 
            }
        }

        console.log('Fetching question data form the server') 
        return this.props.getQuestion(id);
    }

    dispatchToStore(questionById, question){
        if (questionById && question) {
            store.dispatch(action.getQuestionPending(questionById));
            store.dispatch(action.getQuestionSuccess(questionById, question));
        }

    } 
   

   
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
                            <div className="page-spin-loader-box partial-page-loader">
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

   let questionProps = { question};
   
   questionProps = {...props, ...questionProps}; 

   
    return (
        <div className="question-page" id="question-page">
        {question &&
            <div className="question-container">
                <QuestionComponent {...questionProps}/>
                <AnswersBox {...questionProps}/>
            </div>
            
        }
        </div>
    );
};






