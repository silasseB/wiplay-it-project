import Helper from '../../containers/utils/helpers';
import  * as types  from '../../actions/types';


const helper   = new Helper();



const InitialState = () => {
  
    return {
    
        userAuth    : {},

        currentUser : {},

        userProfile : {},

        users       : {},

        index       : {},

        questions   : {},

        posts       : {},

        question    : {},

        post        : {},

        answers     : {},

        comments    : {},

        replies     : {},

        modal       : {},
    };
};


export function entities(state=InitialState(), action) {

    var currentTimeStamp = new Date();
    if ( action.payload) {
        action.payload['timeStamp'] = currentTimeStamp.getTime();
    }


    const CreateNewEntities = (stateEntintie, action)=>{
        let {byId, payload} = action;
        
       return  Object.defineProperty(
            stateEntintie, 
            byId,
            { value : payload,
              writable     : true,
              configurable : true,
              enumerable   : true,
            }
        );
        //console.log(stateEntintie, action)
   };
    

    const updateStateEntyties = (stateEntintieKey,  params )=>{
            let {byId, payload} = params
            let fakeState = state;
            let stateEntintie = fakeState[stateEntintieKey]
            let newState = {};
            

            if (!stateEntintie[byId]) {
                stateEntintie = CreateNewEntities(stateEntintie, {byId, payload});
                                    
            }else{
                stateEntintie[byId]        = {...stateEntintie[byId], ...payload};
            }

            newState[stateEntintieKey] =  stateEntintie
            fakeState                  = {...fakeState, ...newState};

            console.log(newState, fakeState)
            
            return fakeState;
    };
   
    let newStateEntintie;
    let {byId, payload} = action;
    let updateAction    = {byId};
    let createAction    = {byId};

    switch (action.type){

        case 'MODAL_ROUTER':
        case "MODAL_SUBMIT_PENDING":
        case "MODAL_SUBMIT_SUCESS":
        case "MODAL_SUBMIT_ERROR":
            return updateStateEntyties('modal', action);

            
    
        case types.USER_AUTHENTICATION.PENDING :
        case types.USER_AUTHENTICATION.SUCCESS:
        case types.USER_AUTHENTICATION.ERROR:
            return {...state, userAuth :action.payload}
      

        case types.GET_CURRENT_USER.SUCCESS:
        case types.GET_CURRENT_USER.ERROR:
        case types.GET_CURRENT_USER.PENDING:
            return {...state, currentUser :action.payload}
          

              
       
        case types.GET_USER_PROFILE.PENDING: 
        case types.GET_USER_PROFILE.SUCCESS:
        case types.GET_USER_PROFILE.ERROR:
        case types.UPDATE_USER_PROFILE.PENDING:
        case types.UPDATE_USER_PROFILE.ERROR:
            return updateStateEntyties('userProfile', action);
            
            

        case types.UPDATE_USER_PROFILE.SUCCESS:
            
            let profileToUpdate    = state.userProfile[byId];
            let updatedUserProfile = payload.user;
            profileToUpdate        = profileToUpdate.user;
            let user = Object.assign(profileToUpdate, updatedUserProfile)
            action.payload.user = user;

            return updateStateEntyties('userProfile', action);  


        case types.GET_USER_LIST.SUCCESS:
        case types.GET_USER_LIST.PENDING:
        case types.GET_USER_LIST.ERROR:
        case types.UPDATE_USER_LIST.PENDING:
        case types.UPDATE_USER_LIST.ERROR:
            return updateStateEntyties('users', action);

            



        case types.UPDATE_USER_LIST.SUCCESS:
                        
            if (state.users[byId]) {
                let updatedUser    = payload.user;
                let usersToUpdate  = state.users[byId];

                usersToUpdate      = usersToUpdate.userList
                 
                payload['userList'] = helper.updateReducerListEntynties(usersToUpdate, updatedUser);
                delete payload.user
            }
            console.log(payload)      
            return updateStateEntyties('users', {byId, payload});  

      
        
        case types.GET_INDEX.PENDING:
        case types.GET_INDEX.SUCCESS:
        case types.GET_INDEX.ERROR:
            return {...state, index :action.payload}
                       

        case types.GET_QUESTION_LIST.SUCCESS:
        case types.GET_QUESTION_LIST.PENDING:
        case types.GET_QUESTION_LIST.ERROR:
        case types.UPDATE_QUESTION.ERROR:
        case types.UPDATE_QUESTION.PENDING:
           
            return updateStateEntyties('questions', action);
           
       


        case types.CREATE_QUESTION.PENDING:
        case types.CREATE_QUESTION.SUCCESS:
        case types.CREATE_QUESTION.ERROR:
        case types.GET_QUESTION.PENDING:
        case types.GET_QUESTION.SUCCESS:
        case types.GET_QUESTION.ERROR:
        case types.UPDATE_QUESTION.ERROR:
        case types.UPDATE_QUESTION.PENDING:
            return updateStateEntyties('question', action);

            

        case types.UPDATE_QUESTION.SUCCESS:
            let updatedQuestion = payload.question;
            
            if (state.question[byId]) {

                let question        = state.question[byId]
                question            = question.question;
                payload['question'] = {...question, ...updatedQuestion}
              
                return updateStateEntyties('question', {byId, payload});

            }else if(state.questions[byId]){
            
                let questions = state.questions[byId];
                let questionList = questions && questions.questionList || [];
                payload['questionList'] = helper.updateReducerListEntynties(questionList, updatedQuestion);
                delete payload.question;

                return updateStateEntyties('questions', {byId, payload});

            };
            return state;
        




        case types.GET_POST_LIST.PENDING:
        case types.GET_POST_LIST.SUCCESS:
        case types.GET_POST_LIST.ERROR:
        case types.UPDATE_POST.ERROR:
        case types.UPDATE_POST.PENDING:
            return updateStateEntyties('posts', action);
            
                
         

        case types.GET_POST.PENDING:
        case types.GET_POST.SUCCESS:
        case types.GET_POST.ERROR:
        case types.UPDATE_POST.ERROR:
        case types.UPDATE_POST.PENDING:
            return updateStateEntyties('post', action);
        
        
        

        case types.UPDATE_POST.SUCCESS:
            let updatedPost = payload.post;
           
            if (state.post[byId]) {

                let post        = state.post[byId]
                post            = post.post;
                payload['post'] = {...post, ...updatedPost}
              
                return updateStateEntyties('post', {byId, payload});

            }else if(state.posts[byId]){
            
                let posts           = state.posts[byId];
                let postList        = posts && posts.postList || [];
                payload['postList'] = helper.updateReducerListEntynties(postList, updatedPost);
                delete payload.post;

                return updateStateEntyties('posts', {byId, payload});

            };
            return state;                 



        case types.GET_ANSWER_LIST.ERROR:
        case types.GET_ANSWER_LIST.PENDING:
        case types.GET_ANSWER_LIST.SUCCESS:
        case types.CREATE_ANSWER.PENDING:
        case types.CREATE_ANSWER.ERROR:
        case types.UPDATE_ANSWER.PENDING:
        case types.UPDATE_ANSWER.ERROR:
            return updateStateEntyties('answers', action);
          
            
          


        case types.CREATE_ANSWER.SUCCESS:
               
            let newAnswer         =  payload.answer;
            let newAnswerList     =  [newAnswer];
            let currentNewAnswers =  state.answers[byId];
            currentNewAnswers     =  currentNewAnswers && currentNewAnswers.answerList;

            newAnswerList         =  currentNewAnswers && currentNewAnswers.length &&
                                     currentNewAnswers.unshift(newAnswer) || newAnswerList;

            payload['answerList'] = Array.isArray(newAnswerList) && newAnswerList;
            delete payload.answer; 
            return  updateStateEntyties('answers', {byId, payload})|| state;  
            


        case types.UPDATE_ANSWER.SUCCESS:
            
            let updatedAnswer = payload.answer;
            var answers = state.answers[action.byId];
            answers = answers.answerList;

            payload['answerList'] = helper.updateReducerListEntynties(answers, updatedAnswer);
            delete payload.answer;
            return  updateStateEntyties('answers',  {byId, payload })|| state;


        case types.CREATE_COMMENT.PENDING:
        case types.CREATE_COMMENT.ERROR:
        case types.GET_COMMENT_LIST.PENDING:
        case types.GET_COMMENT_LIST.SUCCESS:
        case types.GET_COMMENT_LIST.ERROR: 
        case types.UPDATE_COMMENT.PENDING:
        case types.UPDATE_COMMENT.ERROR:
        case 'GET_COMMENT_LINK_DATA':
            return updateStateEntyties('comments', action);

           


        case types.CREATE_COMMENT.SUCCESS:
             
            let newComment           = payload.comment;
            let newComments          = [newComment];  

            let currentNewComments = state.comments[byId];
            currentNewComments = currentNewComments.commentList;

            newComments = currentNewComments && currentNewComments.length &&
                                  currentNewComments.unshift(newComment) || newComments;
         
            
            payload['commentList'] = Array.isArray(newComments) && newComments;
            delete payload.comment;
            return updateStateEntyties('comments', { byId, payload })|| state; 



        case types.UPDATE_COMMENT.SUCCESS:
            
            let updatedComment = payload.comment;
            let comments = state.comments[byId];
            comments = comments.commentList
            payload['commentList'] = helper.updateReducerListEntynties(comments, updatedComment);
            delete payload.comment;
         
            return updateStateEntyties('comments', {byId, payload })|| state; 
      


        case  types.GET_REPLY_LIST.PENDING:
        case  types.GET_REPLY_CHILD_LIST.PENDING:
        case  types.GET_REPLY_CHILD_LIST.SUCCESS:
        case  types.GET_REPLY_CHILD_LIST.ERROR:
        case  types.CREATE_REPLY.PENDING:
        case  types.CREATE_REPLY.ERROR:
        case  types.UPDATE_REPLY.PENDING:
        case  types.UPDATE_REPLY.ERROR:
        case  'GET_REPLY_LINK_DATA':
        case  'GET_REPLY_CHILD_LINK_DATA':
            return updateStateEntyties('replies', action);

           


        case types.CREATE_REPLY.SUCCESS:
             
            let newReply            = payload.reply;
            let newReplies          = [newReply];
            let currentNewReplies   = state.replies[action.byId];
            currentNewReplies       = currentNewReplies.replyList;

            newReplies = currentNewReplies && currentNewReplies.unshift(newReply)
                                                  || newReplies;  
                       
            payload['replyList'] = Array.isArray(newReplies) && newReplies;
            delete payload.reply;
            return updateStateEntyties('replies', {byId, payload })|| state;    

      
        
      

        case types.UPDATE_REPLY.SUCCESS:
            
            let repliesToUpdate     = state.replies[action.byId]; 
            let updatedReply        = payload.reply;
        
           
            payload['commentList'] = helper.updateReducerListEntynties(
                                                                repliesToUpdate.replyList, 
                                                                updatedReply
                                                            );
            delete payload.reply;
         
            return updateStateEntyties('replies', {byId, payload})|| state
            
            

        default:
            return state; 
    }
}
