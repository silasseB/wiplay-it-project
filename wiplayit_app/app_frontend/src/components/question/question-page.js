import React, { Component } from 'react';

import  * as action  from 'actions/actionCreators';
import { getQuestion } from 'dispatch/index';
import {PartalNavigationBar,NavigationBarBigScreen } from 'templates/navBar';
import  AjaxLoader from 'templates/ajax-loader';
import { QuestionComponent} from 'templates/question/question-templates';
import {store} from "store/index";
import { AnswersBox } from 'components/answer/answer-page';
import GetTimeStamp from 'utils/timeStamp';
import { UnconfirmedUserWarning, 
         PageErrorComponent } from 'templates/partial-components';
import  MainAppHoc from "components/index/index-hoc";



class QuestionPage extends Component {
    isMounted = false;
    

    constructor(props) {
        super(props);
        

        this.state = {
            isQuestionBox : true, 
            pageName      : "Question", 
            questionById  : '',
            isNewQuestion : false,
            isReloading   : false,
        };

    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };


    onQuestionUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let {question}   = entities;

            let {questionById}  = this.state;
             question           = question && question[questionById]
                     
            //console.log(errors) 
            if (this.isMounted && question){
                this.setState({isReloading : question.isLoading, error: question.error})  
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    


    componentDidMount() {
        this.isMounted = true;
        this.onQuestionUpdate();
        
        console.log(this.props) 
                        
        let { entities,
              match,
              location }  =  this.props;

        let { slug, id }  =  match.params;
        let {state}       =  location; 
        let questionById  = `question${id}`;

        this.setState({questionById, id})
        
        if (state && state.recentlyCreated) {
            let question = state.question;
            console.log('Question recently created')
            this.dispatchToStore(questionById, question)
            return; 
        }

        let { question } = entities;
        question = question && question[questionById]
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
                          
            if (menDiff <= 0) {
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
    };

    reLoader =()=>{
        let id = this.state.id;   
        this.isMounted && this.setState({isReloading : true})
        return this.props.getQuestion(id);
    };
    
    getProps() {
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        }
    };

    render() {
        let props = this.getProps();
        let { questionById, entities, id} = props;
        let { question } = entities && entities;
        question = question && question[questionById]
        console.log(props, questionById, question)
      
        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />

                { question &&
                    <div className="app-box-container app-question-box">
                        <UnconfirmedUserWarning {...props}/>
                        { question.isLoading &&
                            <div className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        }
                        <PageErrorComponent {...props}/>

                        {!question.isLoading &&
                           <Questions {...props}/>
                        }
                    </div>
                }           
            </div>
        );
    };
};


export default  MainAppHoc(QuestionPage);



export const Questions = props => {
    var {questionById, entities} = props;
    let {question, answers} = entities;
    question = question && question[questionById];
    if(question && question.isLoading) return null;

    question = question && question.question;
    if (!question) return null;

    let questionProps = { question};
    questionProps = {...props, ...questionProps}; 
   
    return (
        <div className="question-page" id="question-page">
            { question &&
                <div className="question-container">
                    <QuestionComponent {...questionProps}/>
                    <AnswersBox {...questionProps}/>
                </div>
            }
        </div>
    );
};






