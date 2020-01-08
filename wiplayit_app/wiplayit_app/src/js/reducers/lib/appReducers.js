import Helper from '../../containers/utils/helpers';
import  * as types  from '../../actions/types';


const helper   = new Helper();
const CreateNewEntities = (stateEntintie, action)=>{
        let {byId, payload} = action;

        Object.defineProperty(
            stateEntintie, 
            byId,
            { value : payload,
              writable     : true,
              configurable : true,
              enumerable   : true,
            }
        );
};

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

    
    let updateStateEntyties = (stateEntintie, params )=>{

          if (!state[params.byId]) {
                CreateNewEntities(
                       stateEntintie,
                       {byId : params.byId, payload : params.payload}
                    ) 
            
            }else{
                Object.assign(stateEntintie[modalType], params.payload) ;  
            }

    };


    let { modalType, payload, byId, type } = action;

    var currentTimeStamp = new Date();
    if ( payload) {
        payload['timeStamp'] = currentTimeStamp.getTime();


    }

    switch (type){

        case 'MODAL_ROUTER':
            updateStateEntyties(state.modal, {byId : modalType, payload} )

            return state;


        case "SUBMIT_PENDING":
            updateStateEntyties(state.modal, {byId : modalType, payload} )
            return state;

        case "SUBMIT_SUCESS":
            updateStateEntyties(state.modal, {byId : modalType, payload} )
            return state;

        case "SUBMIT_ERROR":
            updateStateEntyties(state.modal, {byId : modalType, payload} )
            return state;
            

           return state;
    
        case types.USER_AUTHENTICATION.PENDING :
            Object.assign(state.userAuth, action.payload)
            console.log(state.userAuth, action)
            return state; 

        case types.USER_AUTHENTICATION.SUCCESS:
            Object.assign(state.userAuth, action.payload);
            console.log(state, action.payload)
            return state;              

        case types.USER_AUTHENTICATION.ERROR:
            Object.assign(state.userAuth, action.payload)
            console.log(state)
            return state;
          

      

        case types.GET_CURRENT_USER.SUCCESS:
            Object.assign(state.currentUser, action.payload)
            return state;   
                  

        case types.GET_CURRENT_USER.ERROR:
            Object.assign(state.currentUser, action.payload)
            return state;    

        case types.GET_CURRENT_USER.PENDING:
            Object.assign(state.currentUser, action.payload)
            return state;    


        case types.GET_USER_PROFILE.PENDING:
            updateStateEntyties(state.userProfile, {byId , payload} )

            return state;


        case types.GET_USER_PROFILE.SUCCESS:
            console.log(action, state)
            updateStateEntyties(state.userProfile, {byId , payload} )

            return state;

        case types.GET_USER_PROFILE.ERROR:
            updateStateEntyties(state.userProfile, {byId , payload} )
            return state;
              

        case types.GET_USER_LIST.PENDING:
            //console.log(state, action)
            updateStateEntyties(state.users, {byId , payload} )
            return state;

        case types.GET_USER_LIST.SUCCESS:
             updateStateEntyties(state.users, {byId , payload} );
            return state;

      case types.GET_USER_LIST.ERROR:
          updateStateEntyties(state.users, {byId , payload} );
         return state;


      case types.GET_INDEX.PENDING:
         Object.assign(state.index, action.payload);
         return state;       

        case types.GET_INDEX.SUCCESS:
            //console.log(state, action)
            Object.assign(state.index, action.payload);   
            return state;    

        case types.GET_INDEX.ERROR:
            Object.assign(state.index, action.payload);
            return state;           


        case types.GET_QUESTION_LIST.PENDING:
            //console.log(state, action)
            updateStateEntyties(state.questions, {byId , payload} )
            return state;       

        case types.GET_QUESTION_LIST.SUCCESS:
            updateStateEntyties(state.userProfile, {byId , payload} )
            return state;    

        case types.GET_QUESTION_LIST.ERROR:
            updateStateEntyties(state.questions, {byId , payload} );
            return state;            
       



        case types.GET_QUESTION.PENDING:
            updateStateEntyties(state.question, {byId , payload} )
            return state;      
      
        case types.GET_QUESTION.SUCCESS:
            updateStateEntyties(state.question, {byId , payload} );
            return state; 

        case types.GET_QUESTION.ERROR:
            updateStateEntyties(state.question, {byId , payload} )
         return state;


        case types.GET_POST_LIST.PENDING:
            updateStateEntyties(state.posts, {byId , payload} )
            return state;       

        case types.GET_POST_LIST.SUCCESS:
            updateStateEntyties(state.posts, {byId , payload} );   
            return state;    

        case types.GET_POST_LIST.ERROR:
            updateStateEntyties(state.posts, {byId , payload} );
            return state;              


        case types.GET_POST.PENDING:
            updateStateEntyties(state.post, {byId , payload} )
            return state;

        case types.GET_POST.SUCCESS:
            updateStateEntyties(state.post, {byId , payload} )
            return state;

        case types.GET_POST.ERROR:
            updateStateEntyties(state.post, {byId , payload} )
            return state; 


        case types.GET_ANSWER_LIST.PENDING:
           updateStateEntyties(state.answers, {byId , payload} )
           return state;


        case types.GET_ANSWER_LIST.SUCCESS:
            updateStateEntyties(state.answers, {byId , payload} )
            return state; 

        case types.GET_ANSWER_LIST.ERROR:
            updateStateEntyties(state.answers, {byId , payload} ) 
            return state;     

        case 'GET_COMMENT_LINK_DATA':
            updateStateEntyties(state.comments, {byId , payload} )
            return state; 

        case 'GET_REPLY_LINK_DATA':
        case 'GET_REPLY_CHILD_LINK_DATA':
           updateStateEntyties(state.replies, {byId , payload} )
           return state; 

     
        case types.CREATE_QUESTION.PENDING:
            updateStateEntyties(state.question, {byId , payload} );
            return state;

        case types.CREATE_QUESTION.SUCCESS:
            updateStateEntyties(state.question, {byId , payload} );
            return state;
      
        case types.CREATE_QUESTION.ERROR:
           updateStateEntyties(state.question, {byId , payload} );;
           return state;  

        case 'VIEW_NEW_QUESTION':
            Object.assign(state.question[action.byId], action.payload);
            return state;  

        case types.CREATE_ANSWER.PENDING:
            updateStateEntyties(state.answers, {byId , payload} );
            return state;

        case types.CREATE_ANSWER.SUCCESS:
            let newAnswer           =  payload.answer;
            let newAnswerList       = [newAnswer];
            let currentNewAnswers = state.answers[byId];
            newAnswerList = currentNewAnswers && currentNewAnswers.unshift(newAnswer)
                                                  || newAnswerList;

            Array.isArray(newAnswerList) && updateStateEntyties(
                                                state.answers,
                                                { byId, payload:{answerList: newAnswerList} }
                                            );  
            return state;
      
        case types.CREATE_ANSWER.ERROR:
            updateStateEntyties(state.answers, {byId , payload} );  
            return state;     
      
        case types.CREATE_COMMENT.PENDING:
            updateStateEntyties(state.comments, {byId , payload} );   
            return state;


        case types.CREATE_COMMENT.SUCCESS:
       
        let newComment      = action.payload.comment;
        let newComments     = [newComment];  

        let currentNewComments = state.comments[action.byId];
        currentNewComments = currentNewComments.commentList;

        newComments = currentNewComments && currentNewComments.unshift(newComment)
                                                  || newComments;
        
        Array.isArray(newComments) &&   updateStateEntyties(
                                            state.comments,
                                            { byId, payload:{answerList: newAnswerList} }
                                        );
          
        return state;

      
        case types.GET_COMMENT_LIST.PENDING:
        case types.CREATE_COMMENT.ERROR:
        case types.GET_COMMENT_LIST.SUCCESS:
            updateStateEntyties(state.comments, {byId , payload} );  
            return state; 
      

        case types.GET_REPLY_LIST.PENDING:
        case  types.GET_REPLY_CHILD_LIST.PENDING:
        case  types.GET_REPLY_CHILD_LIST.SUCCESS:
        case  types.GET_REPLY_CHILD_LIST.ERROR:
            updateStateEntyties(state.replies, {byId , payload} );  
            return state;    

        
              
        case types.CREATE_REPLY.PENDING:
        case types.CREATE_REPLY.ERROR:
            updateStateEntyties(state.replies, {byId , payload} );   
            return state;

        case types.CREATE_REPLY.SUCCESS:
            let newReply = action.payload.reply;
            let newReplies     = [newReply];
            let currentNewReplies = state.replies[action.byId];
            currentNewReplies     = currentNewReplies.replyList;

            newReplies = currentNewReplies && currentNewReplies.unshift(newReply)
                                                  || newReplies;  
            Array.isArray(newReplies)  &&   updateStateEntyties(
                                                    state.replies,
                                                    { byId , payload : {replyList:newReplies}}
                                            );           
            return state;
      
          
      
        case types.UPDATE_USER_PROFILE.PENDING:
        case types.UPDATE_USER_PROFILE.ERROR:
            updateStateEntyties(state.userProfile, {byId , payload} );
            return state;

        case types.UPDATE_USER_PROFILE.SUCCESS:
            let profileToUpdate    = state.userProfile[byId];
            let updatedUserProfile = action.payload.user;
            profileToUpdate = profileToUpdate.user;

            let user = {...profileToUpdate, ...updatedUserProfile}
            action.payload.user = user;

            updateStateEntyties(state.userProfile, action );
            return state;  

          


        case types.UPDATE_USER_LIST.PENDING:
            updateStateEntyties(state.users, action );
            return state;

        case types.UPDATE_USER_LIST.SUCCESS:
             var  updatedUser     = action.payload && action.payload.user;

            if (state.users[action.byId]) {
               var usersToUpdate = state.users[action.byId];
               usersToUpdate = usersToUpdate.userList
               console.log(usersToUpdate)
               helper.updateReducerListEntynties(usersToUpdate, updatedUser);
            }
                  
            return state;  

        case types.UPDATE_USER_LIST.ERROR:
            Object.assign(state.users[action.byId], {error: action.payload});
            return state;  
      
      
       case types.UPDATE_POST.PENDING:
       case types.UPDATE_POST.ERROR:

            !state.post[byId]  && updateStateEntyties(state.post, action );
            !state.posts[byId] && updateStateEntyties(state.posts, action );
            return state;

        case types.UPDATE_POST.SUCCESS:
   
        if (state.post[action.byId]) {
            let post = state.post[action.byId]
            post     = post.post;
           
            action = {
                isUpdating : false,
                post   : Object.assign(post, action.payload.post),
            
            } 
        
           updateStateEntyties(state.post, action) 

        }else if(state.posts[action.byId]){
            let post = payload.post;
            
            var posts = state.posts[action.byId];
            let postList = posts && posts.postList;
            
            helper.updateReducerListEntynties(postList, post);

        };
        return state;                  
      

        case types.UPDATE_QUESTION.PENDING:
        case types.UPDATE_QUESTION.ERROR:

            !state.question[byId] &&  updateStateEntyties(state.question, action );
            !state.questions[byId] && updateStateEntyties(state.questions, action );
            return state;

    case types.UPDATE_QUESTION.SUCCESS:
        let updatedQuestion = action.payload && action.payload.question

        if (state.question[action.byId]) {
            let question = state.question[action.byId]
            question     = question.question;
           
            let updatedQuestionState = {
                isUpdating : false,
                question   : Object.assign(question, updatedQuestion),
            
            } 
        
           Object.assign(state.question[action.byId], updatedQuestionState);

        }else if(state.questions[action.byId]){
            
            var questions = state.questions[action.byId];
            let questionList = questions && questions.questionList;
            helper.updateReducerListEntynties(questionList, updatedQuestion);

        };
        return state;                  
      

    case types.UPDATE_QUESTION.ERROR:
        let { error } = action.payload

        if (state.question[action.byId]) {
           Object.assign(state.question[action.byId], action.payload);

        }else if(state.questions[action.byId]){
            Object.assign(state.questions[action.byId], action.payload);
        };

        return state;   


      case types.UPDATE_ANSWER.PENDING:
         Object.assign(state.answers[action.byId], action.payload);
         return state;

      case types.UPDATE_ANSWER.SUCCESS:
         let updatedAnswer = action.payload.answer;
         var answers = state.answers[action.byId];
         helper.updateReducerListEntynties(answers.answerList, updatedAnswer);
         
         return state;                  
      

      case types.UPDATE_ANSWER.ERROR:
         Object.assign(state.answers[action.byId], action.payload);
         return state;     
                      
      
      case types.UPDATE_COMMENT.PENDING:
          console.log(state,action)
          Object.assign(state.comments[action.byId], action.payload );
          return state

      case types.UPDATE_COMMENT.SUCCESS:

         let updatedComment = action.payload.comment;
         var comments = state.comments[action.byId];
         comments = comments.commentList
         helper.updateReducerListEntynties(comments, updatedComment);
         console.log(action, updatedComment, comments)
         return state
      
      case types.UPDATE_COMMENT.ERROR:
         Object.assign(state.comments[action.byId], action.payload );
         return state       
      


      case types.UPDATE_REPLY.PENDING:
         Object.assign(state.replies[action.byId], action.payload );
         return state

      case types.UPDATE_REPLY.SUCCESS:
         var repliesToUpdate = state.replies[action.byId]; 
         let updatedReply = action.payload.reply;
        
         helper.updateReducerListEntynties(repliesToUpdate.replyList, updatedReply);
         return state
    
      case types.UPDATE_REPLY.ERROR:
         Object.assign(state.replies[action.byId], action.payload );
         return state
       

      default:
         return state; 
   }
}

   
