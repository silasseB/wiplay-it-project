import React, { Component } from 'react';
import  * as action  from 'actions/actionCreators';
import { Link } from "react-router-dom";

import {NavigationBarSmallScreen,NavigationBarBigScreen } from "components/navBar";
import {store} from "index";
//import AnswersBox from "containers/answer/answer_page";
import { QuestionComponent} from "components/question_components"
import { PostComponent} from "components/post_components"

import  AjaxLoader from "components/ajax-loader";
import { AnswersComponent } from "components/answer_components";

import withHigherOrderIndexBox from "containers/index/higher_order_index";




class IndexBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',


        } 
    };
  

    // static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //  return  dispatch => action.handleError(error);
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    }


    componentDidUpdate(nextProps, prevState) {
      //console.log(nextProps, this.props)
    };

         
   
    componentDidMount() {
        let questionList  = localStorage.getItem('questionList');
        questionList = JSON.parse(questionList)
        var questionListById = this.state.questionListById;
        var {entyties } = this.props;
        
        if (questionList) {
            store.dispatch(action.getQuestionListPending(questionListById));
            store.dispatch(action.getQuestionListSuccess(questionListById, questionList));
        }
        else{

            let optionsProps = this.state;
            this.updateIndexEntyties(optionsProps);
            var index  =  entyties.index;

            if (!index.isSuccess) {
                this.props.getIndex(optionsProps); 
            }                          
        }
    };

    updateIndexEntyties(params){
        var { questionListById, answerListById, postListById} = params;

        store.dispatch(action.getQuestionListPending(questionListById));
        store.dispatch(action.getAnswerListPending(answerListById));
        store.dispatch(action.getPostListPending(postListById))

    }


    getProps(){
        let props = {
                ...this.state,
        };

        return Object.assign(props, this.props );  
    };

      
    render() {
        let props = this.getProps()
        //console.log(props)
        var index  = props.entyties.index;
        //console.log(index)
                     
        return (

            <div>

                <NavigationBarBigScreen {...props}/>
                <NavigationBarSmallScreen {...props}/>

                { index?

                    <div>
                        { index.isLoading?
                            <div className="page-spin-loader-box">
                                <AjaxLoader/>
                            </div>

                            :
                            <IndexComponent {...props}/>
                        } 
                    </div>

                    :
                   ""  
                }           
            </div>
        );
    };
};





export default  withHigherOrderIndexBox(IndexBox);


export const IndexComponent = props => {
   
      
   return(
     <div className="home-page-contents" id="home-page-contents">
       <Answers {...props}/>
       <Posts {...props}/>
       <Questions {...props}/>

     </div>
   )

}


export const Questions = props => {
   
    var { questionListById, entyties } = props;

    var questions = entyties.questions.byId[questionListById];
    //console.log(questions, props)
  
    return (

      <div>
         { questions && questions.questionList.length?
         <div className="index-questions-box">
            <div className="index-items-label">
                <b>Questions</b>
            </div>

            { questions.questionList.map((question, index) => {
                let contentsProps = {question, index};
                Object.assign(contentsProps, props)  

                return (

                  <div key={index} >
                     <QuestionComponent {...contentsProps}  />
                  </div>
               )
            }
            )}
         </div>
         :
         ""

      }
       
      </div>
   );
};





export const Posts = props => {
   
    var { postListById, entyties } = props;

    var posts = entyties.posts.byId[postListById];
    
  
    return (

        <div >
            { posts && posts.postList.length?
                <div  className="index-posts-box">
                    <div className="index-items-label">
                        <b>Posts</b>
                    </div>

                    { posts.postList.map((post, index) => {
                        let contentsProps = {post, index};
                        Object.assign(contentsProps, props)  

                        return (
                            <div key={index} >
                                <PostComponent {...contentsProps}  />
                            </div>
                        )
                    })}

                </div>
                :
                ""

            }
       
        </div>
    );
};






export const Answers = props => {
    var { answerListById, entyties } = props;
    var answers   = entyties.answers.byId[answerListById]; 
         
    return(
        <div>

            {answers && answers.answerList?
                <div className="index-answers-box">

                    <div className="answer-container">
                        <div className="index-items-label">
                           <b>Answers</b>
                        </div>
                  
                        { answers.answerList.map((answer, index) => {

                            let answerProps = { answer, index};
                            let question = answer.question;
                            let questionPath = `/question/${question.slug}/`;

                            Object.assign(answerProps, props); 
      
                            return ( 
                                <div key={index} className="answer-contents"> 
                                    <div>
                                        <b className="">
                                            <Link to={{pathname: questionPath, state : {question} }} 
                                                                      className="question-link">
                                                { question.add_question }
                                            </Link>
                                        </b>
                                    </div>

                                    <AnswersComponent {...answerProps}/>
                                </div>
                            );
                        } )}

                    </div>
                </div>

                :
               ""
            }

        </div> 
    );
};




