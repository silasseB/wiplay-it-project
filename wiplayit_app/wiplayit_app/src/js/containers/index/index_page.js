import React, { Component } from 'react';
import  * as action  from "../../actions/actionCreators";
import { Link } from "react-router-dom";

import {NavigationBarSmallScreen,NavigationBarBigScreen } from "../../components/navBar";
import {store} from "../../configs/store-config";
import {LocalCache} from  "../../utils/storage";

import { QuestionComponent} from "../../components/question_components"
import { PostComponent} from "../../components/post_components"

import  AjaxLoader from "../../components/ajax-loader";
import { AnswersComponent } from "../../components/answer_components";

import withHigherOrderIndexBox from "../../containers/index/higher_order_index";




class IndexBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',
            userListById     : 'filteredUserss'


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


    onIndexUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let {entyties }   = storeUpdate;
            let { index  }    = entyties;
             

            if (index && index.isSuccess && !index.timeStamp) {
                console.log(index)
                var timeStamp = new Date();
                index['timeStamp'] = timeStamp.getTime()

                this.updateIndexEntyties(index)
                LocalCache('index', index);
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };


    componentDidMount() {
        this.onIndexUpdate();
        let { cachedEntyties } = this.props;

        var now = new Date();

        let since = new Date('2019-11-14T08:46:32.934Z')
        
                    
        
        
        if (cachedEntyties) {
            let { index, currentUser } = cachedEntyties;
            let timeStamp = index.timeStamp;

            let msDiff   = now.getTime() - timeStamp
            let secDiff  = msDiff / 1000
            let menDiff  = secDiff / 60
            let hourDiff = menDiff/60
            let dayDiff  = hourDiff/24

            console.log(parseInt(menDiff)  + ' ' + 'menutes ago')
            console.log(parseInt(hourDiff)  + ' ' + 'hours ago')
            console.log(parseInt(dayDiff)  + ' ' + 'days ago')
            console.log( hourDiff < 1 )
            
            if(index && hourDiff < 1 ){
                console.log('Index found from cachedEntyties')
                store.dispatch(action.getIndexPending());
                store.dispatch(action.getIndexSuccess(index));
                this.updateIndexEntyties(index)
                return 
            }
        }

        return this.props.getIndex();
    };
   

   

    updateIndexEntyties(index){
        var { questionListById,
              answerListById, 
              postListById,
              userListById
            } = this.state;

        let {questions, posts, answers, users} = index;

       
        if (questions && questions.length ) {
            store.dispatch(action.getQuestionListPending(questionListById));
            store.dispatch(action.getQuestionListSuccess(questionListById, questions))
        }
        if (answers && answers.length) {
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, answers));

        }
        if (posts && posts.length){
           store.dispatch(action.getPostListPending(postListById));
           store.dispatch(action.getPostListSuccess(postListById, posts));
        }

        if (users && users.length){
           store.dispatch(action.getUserListPending(userListById));
           store.dispatch(action.getUserListSuccess(userListById, users));

        }


    }


    getProps(){
        let props = {
                ...this.state,
        };

        return Object.assign(props, this.props );  
    };

      
    render() {
        let props = this.getProps()
        let entyties = props.entyties;
        var index  = entyties.index;
        
                     
        return (

            <div>

                <NavigationBarBigScreen {...props}/>
                <NavigationBarSmallScreen {...props}/>

                { index?

                    <div>
                        {index && index.isLoading?
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
   
  
    return (

      <div>
         { questions &&questions.questionList && questions.questionList.length?
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
                            let questionPath = `/question/${question.slug}/${question.id}/`;

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




