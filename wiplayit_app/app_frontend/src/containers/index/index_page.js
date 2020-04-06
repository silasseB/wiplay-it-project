import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";

import {NavigationBarSmallScreen,NavigationBarBigScreen } from "components/navBar";
import {store } from "store/index";
import { FollowUserBtn} from "components/buttons"; 
import { GetModalLinkProps } from "components/component-props";
import { UnconfirmedUserWarning } from "components/partial_components";

import { QuestionComponent} from "components/question_components"
import { PostComponent} from "components/post_components"

import  AjaxLoader from "components/ajax-loader";
import { AnswersComponent } from "components/answer_components";
import GetTimeStamp from 'utils/timeStamp';

import withHigherOrderIndexBox from "containers/index/higher_order_index";




class IndexBox extends Component {
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',
            userListById     : 'filteredUsers'


        } 
    };
  

    // static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //  return  dispatch => action.handleError(error);
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.log(error, info);
    }

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onIndexUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let {
               index,
               questions,
               posts, 
               answers }   = entities && entities;
                     

            if (index && index.isSuccess) {
                index.isSuccess = false;
             
                this.updateIndexEntities(index);
               
            }
          
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    

    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();

        let { cacheEntities, entities } = this.props;
        let { index}                    = entities;
       
        let cachedIndex                 = cacheEntities.index; 
        let now = new Date();
        //console.log(Object.keys(index))
        
        if (cachedIndex && Object.keys(cachedIndex).length && !Object.keys(index).length) {
            //console.log(cachedIndex)
            let timeStamp = cachedIndex.timeStamp;
            let {questions, answers, posts, users} = cachedIndex && cachedIndex;
            
            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = parseInt(getTimeState.menutes());
          

            console.log(menDiff  + ' ' + 'Menutes ago')
            if(questions && questions.length || answers &&
                answers.length || posts && posts.length || users && users.length ){
                if (menDiff <= 1) {

                    console.log('Index found from cachedEntyties')
                    this.updateIndexEntities(cachedIndex);
                    this.isMounted &&  this.forceUpdate();
                    return;
                }
            }
        }
               
        console.log('Fetching index data from the server' )
        this.props.getIndex();
        
    };
   

   

    updateIndexEntities(index){
        let {entities} = this.props;

        var { questionListById,
              answerListById, 
              postListById,
              userListById,
            } = this.state;

        let {questions, posts, answers, users} =  entities;

        let indexQuestions = index && index.questions;
        let indexAnswers   = index && index.answers;
        let indexPosts     = index && index.posts;
        let indexUsers     = index && index.users;

        //console.log(index)      
        if (!questions[questionListById] && indexQuestions && indexQuestions.length ) {
           
            store.dispatch(action.getQuestionListPending(questionListById));
            store.dispatch(action.getQuestionListSuccess(questionListById, indexQuestions));
            
        }
        if (!answers[answerListById] && indexAnswers && indexAnswers.length) {
            store.dispatch(action.getAnswerListPending(answerListById));
            store.dispatch(action.getAnswerListSuccess(answerListById, indexAnswers));
        }
        if (!posts[postListById] && indexPosts && indexPosts.length){
            store.dispatch(action.getPostListPending(postListById));
            store.dispatch(action.getPostListSuccess(postListById, indexPosts));
           
        }

        if (!users[userListById] && indexUsers && indexUsers.length){
           store.dispatch(action.getUserListPending(userListById));
           store.dispatch(action.getUserListSuccess(userListById, indexUsers));
           

        }
    };

    

    getProps(){
        let props = {
                ...this.state,
        };

        return Object.assign(props, this.props );  
    };

      
    render() {
        let props = this.getProps();
  
        let { entities }  = props ;
        var { index }          = entities;
        //console.log(props, index)
                     
        return (

            <div>

                <NavigationBarBigScreen {...props}/>
                <NavigationBarSmallScreen {...props}/>

                { index?

                    <div className="app-box-container index-box">
                        <UnconfirmedUserWarning {...props}/>

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

    //console.log(props)
      
    return(
        <div className="home-page-contents" id="home-page-contents">
           <Answers {...props}/>
           <Users {...props}/>
           <Posts {...props}/>
           <Questions {...props}/>

        </div>
    )

}


export const Questions = props => {
   
    let { questionListById, entities } = props;

    let questions = entities.questions[questionListById];
    //console.log(questions)
   
  
    return (

        <div >
            { questions && questions.questionList && questions.questionList.length?
                <div className="index-questions">
                    <div className="index-questions-box">
                        <div className="question-container">
                            <div className="index-items-label">
                                <b>Questions</b>
                            </div>

                            { questions.questionList.map((question, index) => {
                                let contentsProps = {
                                        question,
                                        questionById :questionListById
                                };

                                Object.assign(contentsProps, props)  

                                return (

                                    <div key={index} >
                                        <QuestionComponent {...contentsProps}  />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                :
                null
            }
       
      </div>
   );
};





export const Posts = props => {
   
    var { postListById, entities } = props;

    var posts = entities.posts[postListById];
    
  
    return (

        <div>
            { posts && posts.postList && posts.postList.length?
                <div className="index-posts">
                    <div className="index-posts-box">
                       <div className="post-container">
                            <div className="index-items-label">
                                <b>Posts</b>
                            </div>

                            { posts.postList.map((post, index) => {
                                let contentsProps = {
                                        post,
                                        postById: postListById,
                                };

                                Object.assign(contentsProps, props)  

                                return (
                                    <div key={index} >
                                        <PostComponent {...contentsProps}  />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                :
                null
            }
        </div>
    );
};






export const Answers = props => {
    var { answerListById, entities } = props;
    var answers   = entities.answers[answerListById]; 
    //console.log(answers)     
    return(
        <div>
            {answers && answers.answerList && answers.answerList?
                <div className="index-answers">
                    <div className="index-answers-box">

                        <div className="answer-container">
                            <div className="index-items-label">
                                <b>Answers</b>
                             </div>
                  
                            { answers.answerList.map((answer, index) => {

                                let answerProps = { answer };
                                
                                let question = answer.question;
                                let questionPath = `/question/${question.slug}/${question.id}/`;

                                Object.assign(answerProps, props); 
      
                                return ( 
                                    <div key={index} className="answer-contents"> 
                                        <div>
                                            <p className="question">
                                                <Link to={{pathname: questionPath, state : {question} }} 
                                                                      className="question-link">
                                                    { question.add_question }
                                                </Link>
                                            </p>
                                        </div>

                                        <AnswersComponent {...answerProps}/>
                                    </div>
                                );
                            } )}
                        </div>
                    </div>
                </div>

                :
               ""
            }

        </div> 
    );
};




export const Users = props => {
    let { userListById, entities, currentUser } = props;
    let users  =  entities && entities.users 
    users =  users[userListById]; 
    //console.log(answers)     
    return(
        <div className="index-user-list">
            <ul className="index-user-list-title-box">
                <li>Discover New People</li>
            </ul>

            {users && users.userList && users.userList.length?
                <div className="index-user-list-container">
                       
                    { users.userList.map((user, index) => {

                        let userProps = { user };
                        let pathToProfile = user    && `/profile/${user.id}/${user.slug}/`;
                        let profile         = user    &&  user.profile;
                        let profile_picture = profile &&  profile.profile_picture;

                        let editUserProfileProps = {
                            objName    : 'UsersList',
                            isPut      : true,
                            obj        : user, 
                            byId       : userListById,
                            currentUser,
                        }

                        editUserProfileProps = GetModalLinkProps.props(editUserProfileProps);
                            var btnsProps   = {...props, editUserProfileProps};
                            let UnfollowOrFollowUserBtn =  <FollowUserBtn {...btnsProps}/>;

                            Object.assign(userProps, props); 
      
                            return ( 
                                <div key={index} className="index-user-list-box">
                                    <div className="index-user-list-contents">

                                        <div className="index-user-list-img-container">
                                            <div className="index-user-img-box">
                                                { profile_picture?
                                                <div className="index-user-list-img-box"> 
                                                    <Link to={{ pathname: pathToProfile,userProps,}}
                                                          className="index-user-list-img-box">
                                                        <img  src={`${profile_picture}`} 
                                                              alt="" 
                                                              className="index-user-list-img"/> 
                                                    </Link>
                                                    </div>
                                                    :
                                                    <div className="index-user-list-img-box">
                                                    <Link to={{ pathname: pathToProfile,userProps,}}>
                                                          
                                                        <img alt="" 
                                                             src={require("media/user-image-placeholder.png")}
                                                            className="index-user-list-img"/>  
                                                    </Link>
                                                    </div>
                                                }
                                            </div>

                                            <div className="hid-user-btn-box">
                                                <button type="button" className="hid-user-btn btn-sm">
                                                    <span className="hid-user-icon">&times;</span>
                                                </button>
                                            </div>
                                        </div>
                                        

                                        <div className="">
                                            <ul className="index-user-name-box">
                                                <li className="index-user-name">
                                                    <Link to={{ pathname: pathToProfile,userProps,}}>
                                                        {user.first_name} { user.last_name } 
                                                    </Link>
                                                </li>
                                            </ul>
                                            
                                        </div>
                                    </div>
                                    
                                    <div className="index-user-credentials-box text-wrap">
                                        <p>{user.profile.credential}</p>
                                    </div>

                                    <div className="index-user-follow-btn-box">
                                        {UnfollowOrFollowUserBtn}
                                    </div>
                                    
                                </div>
                            );
                    } )}
                </div>

                :
               ""
            }

        </div> 
    );
};







