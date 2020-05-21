import React, { Component } from 'react';

import { QuestionComponent} from "templates/question/question-templates"
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import  MainAppHoc from "components/index/index-hoc";

import { UnconfirmedUserWarning,PageErrorComponent, } from 'templates/partial-components';

import {PartalNavigationBar,NavigationBarBigScreen } from 'templates/navBar';
import  AjaxLoader from 'templates/ajax-loader';
 


class  QuestionListPage extends Component  {
    isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            isQuestionListBox : true,
            questionListById  : 'filteredQuestions',
            isReloading       : false,
            pageName          : "Questions",
            error             : '',
        }
     
   }

    onQuestionListUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let {questions}   = entities;

            let {questionListById}  = this.state;
             questions           = questions && questions[questionListById]
                     
            //console.log(errors) 
            if (this.isMounted && questions){
                this.setState({isReloading : questions.isLoading, error: questions.error})  
            }
                      
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    

    
    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };
      
    componentDidMount() {
        this.isMounted = true;
        this.onQuestionListUpdate();

        var questionListById = this.state.questionListById;
        let { cacheEntities } = this.props;
        let { questions, currentUser } = cacheEntities;
        
             
        questions = questions[questionListById]
        let questionList = questions && questions.questionList;

        if (questionList) {
            console.log(questionList) 
            
            store.dispatch(action.getQuestionListPending(questionListById));
            store.dispatch(action.getQuestionListSuccess( questionListById, questionList));
            return
        }
      

        this.props.getQuestionList(questionListById);                           
      
    };

     reLoader =()=>{
        let {questionListById} = this.state;   
        this.isMounted && this.setState({isReloading : true})
        return this.props.getQuestionList(questionListById);
    };

   

    getProps(){
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        }
    };

    render() {
      let props = this.getProps();
      //let style =  {border:'1px solid red',padding:'60px 0 0 0', margin:'100px 0 0 0'}
      var { questions }  = props.entities;
      
      questions  = questions[props.questionListById];
      console.log(props, questions)
        return (
            <div style={{}}>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} /> 
                { questions &&
                    <div  className="app-box-container question-list-page" id="question-list-page">
                        <UnconfirmedUserWarning {...props}/>
                        
                        { questions.isLoading && 
                            <div  className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        } 
                        { questions.error && !questions.error &&
                            <PageErrorComponent {...props}/>
                        }
                        
                        <Questions {...props}/>   
                    </div>
                
                }
            </div>
        );
    };

};


export default MainAppHoc(QuestionListPage);






const Questions = props => {

   let questions  = props.entities.questions;
   questions  = questions[props.questionListById];
   let questionList = questions && questions.questionList;
   console.log(questionList)

    return (
        <div>
            { questionList && questionList.length &&
                IterateQuestionList(props, questionList)

                ||

                <ul className="">
                    <li className="">
                        No question yet
                    </li>
                </ul>
            }
        </div>
    );
}


const IterateQuestionList = (props, questionList=[])=>{
   
    return questionList.map(( question, index )  => {
                       
        return (
            <div key={question.id}>
                <QuestionComponent {...{...props, question}}/>
            </div>
        )
    })
};


 