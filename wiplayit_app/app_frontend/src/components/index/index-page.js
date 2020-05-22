import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";

import { NavigationBarSmallScreen,
         NavigationBarBottom,
         NavigationBarBigScreen } from "templates/navBar";
import {store } from "store/index";
import { FollowUserBtn} from "templates/buttons"; 
import { GetModalLinkProps } from "templates/component-props";
import { UnconfirmedUserWarning,
         PageErrorComponent, } from "templates/partial-components";

import { QuestionComponent} from "templates/question/question-templates"
import { PostComponent} from "templates/post/post-templates"
import CommentsBox from "components/comment/comment-page";
import {AnswersBox} from "components/answer/answer-page";

import  AjaxLoader from "templates/ajax-loader";
import { AnswersComponent } from "templates/answer/answer-templates";
import GetTimeStamp from 'utils/timeStamp';

import  MainAppHoc from "components/index/index-hoc";




class IndexBox extends Component {
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isHomeBox        : true,
            questionListById : 'filteredQuestions',
            postListById     : 'filteredPosts',
            answerListById   : 'filteredAnswers',
            userListById     : 'filteredUsers',
            isReloading      : false,
            homeTab          : {color:'#A33F0B'},      
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
               answers, 
               errors }   = entities && entities;
                     
            //console.log(errors) 
            index && this.setState({isReloading : index.isLoading})  

            if (index && index.isSuccess) {
                index.isSuccess = false;
             
                this.updateIndexEntities(index);
               
            }
          
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    _CheckIndexDataFromStore(){
        let { entities } = this.props;

        var { questionListById,
              answerListById, 
              postListById,
              userListById,
            } = this.state;

        let {questions, posts, answers, users} =  entities;

        if(!questions[questionListById])return false;
        if(!answers[answerListById])return false;
        if(!posts[postListById])return false;

        return true;
    }
    

    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();

        if (this._CheckIndexDataFromStore()) return;
        
        //this.props.reloadContents(this.props.getIndex)

        let { cacheEntities, entities } = this.props;
        let { index}                    = entities;
       
        let cachedIndex                 = cacheEntities.index; 
        let now = new Date();
        console.log(this.props)
        
        if (cachedIndex && Object.keys(cachedIndex).length && !Object.keys(index).length) {
            //console.log(cachedIndex)
            let timeStamp = cachedIndex.timeStamp;
            let {questions, answers, posts, users} = cachedIndex && cachedIndex;
            
            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = getTimeState.menutes()//parseInt(getTimeState.menutes());
          

            console.log(menDiff  + ' ' + 'Menutes ago')
            if(questions && questions.length || answers &&
                answers.length || posts && posts.length || users && users.length ){
                if (menDiff <= 5) {

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
   

   
    reLoader =()=>{
        let id = this.state.id;   
        this.setState({isReloading : true})
        return this.props.getIndex(id);
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
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
        };
    };

      
    render() {
        let props = this.getProps();
  
        let { entities }  = props ;
        var { index }          = entities;
        //console.log(props, index)
        props['error'] = index && index.error; 
                         
        return (
            <div>
                <NavigationBarBigScreen {...props}/>
                <NavigationBarSmallScreen {...props}/>
                <NavigationBarBottom {...props}/>
                { index?
                    <div className="app-box-container app-index-box">
                        <UnconfirmedUserWarning {...props}/>

                        {index && index.isLoading &&
                            <div className="page-spin-loader-box">
                                <AjaxLoader/>
                            </div>
                        }

                        <PageErrorComponent {...props}/>
                        <IndexComponent {...props}/>
                       
                    </div>

                    :
                    null  
                }           
            </div>
        );
    };
};





export default  MainAppHoc(IndexBox);


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

    let {questions}    = entities
    questions          = questions && questions[questionListById];

    let questionList = questions && questions.questionList;
    
    return (

        <div >
            { questionList && questionList.length?
                <div className="index-questions">
                    <div className="index-questions-box">
                        <div className="question-container">
                            <div className="index-items-label">
                                <b>Questions</b>
                            </div>

                            { questionList.map((question, index) => {
                                let contentsProps = {
                                        question,
                                        questionById :questionListById
                                };

                                Object.assign(contentsProps, props)  

                                return (

                                    <div key={index}>
                                        <QuestionComponent {...contentsProps}/>
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
   
    let { postListById, entities } = props;

    let posts = entities.posts[postListById];
    
  
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
                                let postProps = {
                                        post,
                                        postById: postListById,
                                };

                                Object.assign(postProps, props)  

                                return (
                                    <div key={index} className="post-contents">
                                        <PostComponent {...postProps}  />
                                         <CommentsBox {...postProps}/>
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
    let { answerListById, entities } = props;
    let answers   = entities.answers[answerListById]; 
    //console.log(answers)     
    return(
        <div>
            {answers && answers.answerList && answers.answerList?
                <div className="index-answers">
                    <div className="index-answers-box">

                        <div className="answer-container">
                            <ul className="index-items-label">
                                <li>Answers</li>
                             </ul>
                  
                            { answers.answerList.map((answer, index) => {
                                let answerProps = { answer };
                                Object.assign(answerProps, props); 
      
                                return ( 
                                    <div key={index} className="answer-contents"> 
                                        
                                        <AnswersComponent {...answerProps}/>
                                        <CommentsBox {...answerProps}/>
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
        <div>
            {users && users.userList && users.userList.length?
                <div className="index-user-list">
                    <ul className="index-user-list-title-box">
                        <li>Discover New People</li>
                    </ul>

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
                                    
                                    <ul className="index-user-credentials-box text-wrap">
                                        <li>{user.profile.credential}</li>
                                    </ul>

                                    <div className="index-user-follow-btn-box">
                                        {UnfollowOrFollowUserBtn}
                                    </div>
                                    
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







