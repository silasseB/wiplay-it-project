import Helper from 'utils/helpers';
import  * as types  from 'actions/types';


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
        errors      : {},
        about       : {},
        admin       : {},
        message     : {},
    };
};


export function entities(state=InitialState(), action) {

    var currentTimeStamp = new Date();
    if ( action.payLoad) {
        action.payLoad['timeStamp'] = currentTimeStamp.getTime();
    }


    const CreateNewEntities = ( action)=>{
        let {byId, payLoad} = action;

        let key = byId;
        let value =  {
                value        : payLoad, 
                writable     : true,
                configurable : true,
                enumerable   : true,
            }
        
        return  Object.defineProperty({}, key,value  );
    };
    

    const updateStateEntyties = (stateEntintieKey,  params )=>{
            let {byId, payLoad} = params
            let oldState = state;
            let newState = {};
            let stateEntintie = oldState[stateEntintieKey]
                                      
            if (byId) {
                        
                if(stateEntintie[byId]){
                    stateEntintie[byId] = {...stateEntintie[byId], ...payLoad};
                    
                }else {
                    let newEntitie = CreateNewEntities(params);
                    stateEntintie = {...stateEntintie, ...newEntitie}
                }

            }else{
                stateEntintie = {...stateEntintie,...payLoad}
            }

            newState[stateEntintieKey] =  stateEntintie;
            return {...oldState, ...newState};
    };
   
    let newStateEntintie;
    let {byId, payLoad} = action;
    let updateAction    = {byId};
    let createAction    = {byId};

    switch (action.type){
        case 'SERVER_ERROR':
            return updateStateEntyties('errors', action);

       
        case 'ABOUT_SUCCESS':
        case 'ABOUT_ERROR':
        case 'ABOUT_PENDING':
        case 'CREATE_ABOUT_SUCCESS':
        case 'CREATE_ABOUT_PENDING':
        case 'CREATE_ABOUT_SUCCESS':
            return updateStateEntyties('about', action);

        case "ADMIN_SUCCESS":
        case "ADMIN_ERROR":
        case "ADMIN_PENDING":
            return updateStateEntyties('admin', action);

        case "SEND_MESSAGE_SUCCESS":
        case "SEND_MESSAGE_ERROR":
        case "SEND_MESSAGE_PENDING":
            return updateStateEntyties('message', action);

        case 'MODAL_ROUTER':
        case "MODAL_SUBMIT_PENDING":
        case "MODAL_SUBMIT_SUCESS":
        case "MODAL_SUBMIT_ERROR":
            return updateStateEntyties('modal', action);

            
    
        case types.USER_AUTHENTICATION.PENDING :
        case types.USER_AUTHENTICATION.SUCCESS:
        case types.USER_AUTHENTICATION.ERROR:
            return updateStateEntyties('userAuth', action);
      

        case types.GET_CURRENT_USER.SUCCESS:
        case types.GET_CURRENT_USER.ERROR:
        case types.GET_CURRENT_USER.PENDING:
            return updateStateEntyties('currentUser', action);
          

              
       
        case types.GET_USER_PROFILE.PENDING: 
        case types.GET_USER_PROFILE.SUCCESS:
        case types.GET_USER_PROFILE.ERROR:
        case types.UPDATE_USER_PROFILE.PENDING:
        case types.UPDATE_USER_PROFILE.ERROR:
            return updateStateEntyties('userProfile', action);
            
            

        case types.UPDATE_USER_PROFILE.SUCCESS:
            let profileToUpdate    = state.userProfile[byId];
            let updatedUserProfile = payLoad && payLoad.user;
            profileToUpdate        = profileToUpdate && profileToUpdate.user;
            let user =  {...profileToUpdate || {}, ...updatedUserProfile || {}}
            console.log(profileToUpdate, updatedUserProfile)
            action.payLoad.user = user;

            return updateStateEntyties('userProfile', action);  


        case types.GET_USER_LIST.SUCCESS:
        case types.GET_USER_LIST.PENDING:
        case types.GET_USER_LIST.ERROR:
        case types.UPDATE_USER_LIST.PENDING:
        case types.UPDATE_USER_LIST.ERROR:
            return updateStateEntyties('users', action);

            



        case types.UPDATE_USER_LIST.SUCCESS:
                        
            if (state.users[byId]) {

                let updatedUser    = payLoad.user;
                let usersToUpdate  = state.users[byId];
                usersToUpdate      = usersToUpdate.userList
                 
                action.payLoad['userList'] = helper.updateReducerListEntynties(usersToUpdate, updatedUser);
                delete action.payLoad.user
            }
                  
            return updateStateEntyties('users', action);  

      
        
        case types.GET_INDEX.PENDING:
        case types.GET_INDEX.SUCCESS:
        case types.GET_INDEX.ERROR:
            return updateStateEntyties('index', action); 
                       

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
            let updatedQuestion = payLoad && payLoad.question;
            
            if (state.question[byId]) {

                let question        = state.question[byId]
                question            = question.question;
                payLoad['question'] = {...question, ...updatedQuestion}
              
                return updateStateEntyties('question', {byId, payLoad});

            }else if(state.questions[byId]){
            
                let questions = state.questions[byId];
                let questionList = questions && questions.questionList || [];
                payLoad['questionList'] = helper.updateReducerListEntynties(questionList, updatedQuestion);
                delete payLoad.question;

                return updateStateEntyties('questions', {byId, payLoad});

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
            let updatedPost = payLoad.post;
           
            if (state.post[byId]) {

                let post        = state.post[byId]
                post            = post.post;
                payLoad['post'] = {...post, ...updatedPost}
              
                return updateStateEntyties('post', {byId, payLoad});

            }else if(state.posts[byId]){
            
                let posts           = state.posts[byId];
                let postList        = posts && posts.postList || [];
                payLoad['postList'] = helper.updateReducerListEntynties(postList, updatedPost);
                delete payLoad.post;

                return updateStateEntyties('posts', {byId, payLoad});

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
          
            
     //64663847882540464253     


        case types.CREATE_ANSWER.SUCCESS:
               
            let newAnswer      =  payLoad.answer;
            let newAnswerList  =  [newAnswer];
            let currentAnswers =  state.answers[byId];
            currentAnswers     =  currentAnswers && currentAnswers.answerList;

            newAnswerList      =  currentAnswers && currentAnswers.length &&
                                  currentAnswers.unshift(newAnswer) || newAnswerList;
            console.log(newAnswerList)

            payLoad['answerList'] = Array.isArray(newAnswerList) && newAnswerList || currentAnswers;
            delete payLoad.answer; 
            return  updateStateEntyties('answers', {byId, payLoad})|| state;  
            


        case types.UPDATE_ANSWER.SUCCESS:
            
            let updatedAnswer = payLoad.answer;
            var answers = state.answers[action.byId];
            answers = answers.answerList;
            delete updatedAnswer.question;

            payLoad['answerList'] = helper.updateReducerListEntynties(answers, updatedAnswer);
            delete payLoad.answer;
            return  updateStateEntyties('answers',  {byId, payLoad })|| state;


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
             
            let newComment           = payLoad.comment;
            let newComments          = [newComment];  

            let currentNewComments = state.comments[byId];
            currentNewComments = currentNewComments.commentList;

            newComments = currentNewComments && currentNewComments.length &&
                                  currentNewComments.unshift(newComment) || newComments;
         
            
            payLoad['commentList'] = Array.isArray(newComments) && newComments;
            delete payLoad.comment;
            return updateStateEntyties('comments', { byId, payLoad }) || state; 



        case types.UPDATE_COMMENT.SUCCESS:
            
            let updatedComment = payLoad.comment;
            let comments = state.comments[byId];
            comments = comments.commentList
            payLoad['commentList'] = helper.updateReducerListEntynties(comments, updatedComment);
            delete payLoad.comment;
         
            return updateStateEntyties('comments', {byId, payLoad })|| state; 
      


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
             
            let newReply            = payLoad.reply;
            let newReplies          = [newReply];
            let currentNewReplies   = state.replies[action.byId];
            currentNewReplies       = currentNewReplies.replyList;

            newReplies = currentNewReplies && currentNewReplies.unshift(newReply)
                                                  || newReplies;  
                       
            payLoad['replyList'] = Array.isArray(newReplies) && newReplies;
            delete payLoad.reply;
            return updateStateEntyties('replies', {byId, payLoad }) || state;    

      
        
      

        case types.UPDATE_REPLY.SUCCESS:
            
            let repliesToUpdate     = state.replies[action.byId]; 
            let updatedReply        = payLoad.reply;
        
           
            payLoad['commentList'] = helper.updateReducerListEntynties(
                                                                repliesToUpdate.replyList, 
                                                                updatedReply
                                                            );
            delete payLoad.reply;
         
            return updateStateEntyties('replies', {byId, payLoad})|| state
            
            

        default:
            return state; 
    }
}
