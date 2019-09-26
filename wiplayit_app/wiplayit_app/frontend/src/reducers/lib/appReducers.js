import Helper from 'containers/utils/helpers';
import  * as types  from 'actions/types';


const helper   = new Helper();
/*
const populateInitialState = (params)=> {
    

   var questions = {
         isLoading          : false,
         question           : "",
         newObject          : "",
         answerList         : [],
         answer             : "",  
         questionHasAnswer  : false,
         userHasAnswer      : false,
         visited            : false,
         error              : '',
      }
}*/

const InitialState = () => {
  
    return {
    
        userAuth : {
            isOnSignUpForm         : false,
            isOnPasswordResetForm  : false,
            isLoading              : false,

            auth : {
                tokenKey    : "",
                isLoggedIn  : false,
            },
        },

        currentUser : {
            user: "",
        },

        userProfile : {
            byId   : {},
            allIds : []
        },

        users : {
            byId   : {},
            allIds : [] 
        },

        index : {
            isLoading : false,
            error     : '',
        },

        questions : {
            byId   : {},
            allIds : []
        },

        posts     : {
            byId   : {},
            allIds : []
        },

        question  : {
            byId   : {},
            allIds : [],
        },

        post      : {
            byId   : {},
            allIds : []
        },

        answers  : {
            byId   : {},
            allIds : []
        },

        comments : {
            byId   : {},
            allIds : []
        },

        replies : {
            byId   : {},
            allIds : []
        },
    };
};


export function entyties(state=InitialState(), action) {
   switch (action.type){

       case types.USER_AUTHENTICATION.PENDING :
       alert(action.type)
         Object.assign(state, action.payload)
         return state; 

      case types.USER_AUTHENTICATION.SUCCESS:
         Object.assign(state.userAuth, action.payload);
         return state;              

      case types.USER_AUTHENTICATION.ERROR:
         Object.assign(state.userAuth, action.payload)
         return state;
          

      case types.TOGGLE.SIGNUP_FORM:
         Object.assign(state.userAuth, action.payload)
         return state;   

      case types.TOGGLE.PASSWORD_RESET_FORM:
         Object.assign(state.userAuth, action.payload)
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
         //console.log(action.payload) 
         if (!state.userProfile.byId[action.profileById]) {
            Object.defineProperty(state.userProfile.byId, action.profileById, {value : action.payload});
         }
         return state;

      case types.GET_USER_PROFILE.SUCCESS:
         //console.log(action.payload) 
         Object.assign(state.userProfile.byId[action.profileById], action.payload);
         return state;

      case types.GET_USER_PROFILE.ERROR:
         Object.assign(state.userProfile.byId[action.profileById], action.payload);
         return state;
              

      case types.GET_USER_LIST.PENDING:
         console.log(state, action)
         if (!state.users.byId[action.byId]) {
            Object.defineProperty(state.users.byId, action.byId, {value : action.payload});
         }
         return state;

      case types.GET_USER_LIST.SUCCESS:
         Object.assign(state.users.byId[action.byId], action.payload);
         return state;

      case types.GET_USER_LIST.ERROR:
         Object.assign(state.users.byId[action.byId], action.payload);
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
         if (!state.questions.byId[action.byId]) {
            Object.defineProperty(state.questions.byId, action.byId, {value : action.payload});
         }
         return state;       

      case types.GET_QUESTION_LIST.SUCCESS:
         Object.assign(state.questions.byId[action.byId], action.payload);   
         return state;    

      case types.GET_QUESTION_LIST.ERROR:
         Object.assign(state.questions.byId[action.byId], action.payload);
         return state;            
       



      case types.GET_QUESTION.PENDING:

         if (!state.question.byId[action.questionById]) {
            Object.defineProperty(state.question.byId, action.questionById, {value : action.payload});
         }
         return state;      
      
      case types.GET_QUESTION.SUCCESS:
         var question = action.payload.question;
         var answerById = `answer${question.id}`;
         var answerState = {
            answerList    : question.answers,
            newObject     : "",
            isLoading     : false,
            visited       : false,
            error         : '',
         }

         Object.assign(state.question.byId[action.questionById], action.payload);
         if (question.answers.length) {
             Object.defineProperty(state.answers.byId, answerById, {value : answerState});
         }
         return state; 

      case types.GET_QUESTION.ERROR:
         if (state.question.byId[action.questionById]) {
            Object.assign(state.question.byId[action.questionById], action.payload);
         }
         return state;


      case types.GET_POST_LIST.PENDING:
         //console.log(state, action)
         if (!state.posts.byId[action.byId]) {
            Object.defineProperty(state.posts.byId, action.byId, {value : action.payload});
         }
         return state;       

      case types.GET_POST_LIST.SUCCESS:
         //console.log(state, action)
         Object.assign(state.posts.byId[action.byId], action.payload);   
         return state;    

      case types.GET_POST_LIST.ERROR:
         Object.assign(state.posts.byId[action.byId], action.payload);
         return state;              


      case types.GET_POST.PENDING:
         if (!state.post.byId[action.postById]) {
            Object.defineProperty(state.post.byId, action.postById, {value : action.payload});
         }
         return state;

      case types.GET_POST.SUCCESS:
         var post = action.payload.post;
         //var commentById = `commentsPost${post.id}`;
         console.log(state, post)
         /*
         var commentsState = {
            commentList      : post.comments,
            showLink         : post.comments.length?true:false,
            isLoading        : false,
            error            : '',
            linkData : {
               comment       : post.comments[0],
               numOfComments : post.comments.length,
            },
         };*/

         Object.assign(state.post.byId[action.postById], action.payload);
         if (post.comments.length) {
            //Object.defineProperty(state.comments.byId, commentById, {value : commentsState});
         }
         return state;

      case types.GET_POST.ERROR:
         Object.assign(state.post.byId[action.postById], action.payload);
         return state; 


      case types.GET_ANSWER_LIST.PENDING:
         if (!state.answers.byId[action.byId]) {
            Object.defineProperty(state.answers.byId, action.byId, {value : action.payload});
         }
         return state;


      case types.GET_ANSWER_LIST.SUCCESS:
         //console.log(state.answers, action)
         Object.assign(state.answers.byId[action.byId],action.payload);
         return state; 

      case types.GET_ANSWER_LIST.ERROR:
         Object.assign(state.answers.byId[action.byId],action.payload);
         return state;     

      case 'GET_COMMENT_LINK_DATA':
         if (!state.comments.byId[action.byId]) {
            Object.defineProperty(state.comments.byId, action.byId,
                                                           { value :action.payload});
             Object.defineProperty(state.comments.allIds, action.byId ,
                       { value : state.comments.byId[action.byId] });   
         } 
         return state; 

      case 'GET_REPLY_LINK_DATA':
         //console.log(action)
         if (!state.replies.byId[action.byId]) {
            Object.defineProperty(state.replies.byId, action.byId, { value :action.payload});  
            Object.defineProperty(state.replies.allIds, action.byId,
                         { value : state.replies.byId[action.byId] });
         }

         return state; 

      case 'GET_REPLY_CHILD_LINK_DATA':
         //console.log(action, state.replies)
         if (!state.replies.byId[action.byId]) {
           Object.defineProperty(state.replies.byId, action.byId, {value : action.payload});
           Object.defineProperty(state.replies.allIds, action.byId,
                                   { value : state.replies.byId[action.byId] });
         }
         return state;

      case types.CREATE_QUESTION.PENDING:
         console.log(action)
         var questionById = action.ById? action.ById:
                                                   "creatingNewQuestion";
         if (!state.question.byId[questionById]) {
            Object.defineProperty(state.question.byId, action.ById, {value:action.payload} );
         }

         return state;

      case types.CREATE_QUESTION.SUCCESS:
         Object.assign(state.question.byId[action.ById], state, action.payload);
         return state;
      
      case types.CREATE_QUESTION.ERROR:
        console.log(action)
        //Object.assign(state.question.byId[action.ById], action.payload);
        return state;  

      case 'VIEW_NEW_QUESTION':
         Object.assign(state.question.byId[action.questionById], action.payload);
         return state;  

      case types.CREATE_ANSWER.PENDING:
         if (!state.answers.byId[action.ById]) {
            Object.defineProperty(state.answers.byId, action.ById, {value:action.payload} );
         }
         return state;

      case types.CREATE_ANSWER.SUCCESS:
         Object.assign(state.answers.byId[action.ById], action.payload)
         return state;
      
      case types.CREATE_ANSWER.ERROR:
        Object.assign(state.answers.byId[action.ById], action.payload)
        return state;     
     /* 
      case types.CREATE_COMMENT.PENDING:
         Object.assign(state.comments.byId[action.commentById], action.payload)
         return state;

      case types.CREATE_COMMENT.SUCCESS:
         Object.assign(state.comments.byId[action.commentById], action.payload)
         return state;
      
      case types.CREATE_COMMENT.ERROR:
        Object.assign(state.comments.byId[action.commentById], action.payload)
        return state;  
        */

      case types.GET_COMMENT_LIST.PENDING:
         //console.log(action)
         Object.assign(state.comments.byId[action.byId], action.payload)
         return state;    

      case types.GET_REPLY_LIST.PENDING:
         //console.log(action)
         Object.assign(state.replies.byId[action.byId], action.payload)
         return state;    

      case  types.GET_REPLY_CHILD_LIST.PENDING:
         Object.assign(state.replies.byId[action.byId],action.payload);
         return state; 

      case  types.GET_REPLY_CHILD_LIST.SUCCESS:
         Object.assign(state.replies.byId[action.byId],action.payload);
         return state;
      
      case  types.GET_REPLY_CHILD_LIST.ERROR:
         Object.assign(state.replies.byId[action.byId],action.payload);
         return state;     
         /*
      case types.CREATE_REPLY.PENDING:
         Object.assign(state.replies.byId[action.replyById], action.payload)
         return state;

      case types.CREATE_REPLY.SUCCESS:
         Object.assign(state.replies.byId[action.replyById], state, action.payload)
         return state;
      
      case types.CREATE_REPLY.ERROR:
         Object.assign(state.replies.byId[action.replyById], action.payload)
         return state;  
      */
      case types.UPDATE_USER_PROFILE.PENDING:
         if (state.userProfile.byId[action.byId]) {
            var userProfile =state.userProfile.byId[action.byId];
           
            if (userProfile.user && userProfile.user.user_is_following) {
               userProfile.user.user_is_following = false
            }else{
               userProfile.user.user_is_following = true
            }
           
            Object.assign(state.userProfile.byId[action.byId], userProfile);
         }
        return state;

      case types.UPDATE_USER_PROFILE.SUCCESS:
         Object.assign(state.userProfile.byId[action.byId], action.payload);
        return state;  

      case types.UPDATE_USER_PROFILE.ERROR:
         var profileToUpdate =state.userProfile.byId[action.byId];
         
         if (profileToUpdate && profileToUpdate.user && profileToUpdate.user.user_is_following) {
            profileToUpdate.user.is_following = true

         }else{
            profileToUpdate.user.is_following = false
         }

        Object.assign(state.userProfile.byId[action.byId], { ...profileToUpdate, error: action.payload});
        return state;  


      case types.UPDATE_USER_LIST.PENDING:
         if (state.users.byId[action.byId]) {
            Object.assign(state.users.byId[action.byId], action.payload);
         }
        return state;

      case types.UPDATE_USER_LIST.SUCCESS:
         var userUpdate    = action.payload.user;
         var usersToUpdate =state.users.byId[action.byId];
         helper.updateReducerListEntynties(usersToUpdate.userList, userUpdate);
                  
         return state;  

      case types.UPDATE_USER_LIST.ERROR:
         Object.assign(state.users.byId[action.byId], {error: action.payload});
        return state;  


      case types.UPDATE_QUESTION.PENDING:
         Object.assign(state.question.byId[action.byId], action.payload);
         return state;

      case types.UPDATE_QUESTION.SUCCESS:
         Object.assign(state.question.byId[action.byId], action.payload);
         return state;                  
      

      case types.UPDATE_QUESTION.ERROR:
         Object.assign(state.question.byId[action.byId], action.payload);
         return state;   


      case types.UPDATE_ANSWER.PENDING:
         Object.assign(state.answers.byId[action.byId], action.payload);
         return state;

      case types.UPDATE_ANSWER.SUCCESS:
         let updatedAnswer = action.payload.answer;
         var answers = state.answers.byId[action.byId];
         helper.updateReducerListEntynties(answers.answerList, updatedAnswer);
         
         return state;                  
      

      case types.UPDATE_ANSWER.ERROR:
         Object.assign(state.answers.byId[action.byId], action.payload);
         return state;     
                      
      
      case types.UPDATE_COMMENT.PENDING:
         Object.assign(state.comments.byId[action.byId], action.payload );
         return state

      case types.UPDATE_COMMENT.SUCCESS:
         let updatedComment = action.payload.comment;
         var comments = state.comments.byId[action.byId];

         helper.updateReducerListEntynties(comments.commentList, updatedComment);
         return state
      
      case types.UPDATE_COMMENT.ERROR:
         Object.assign(state.comments.byId[action.byId], action.payload );
         return state       
      


      case types.UPDATE_REPLY.PENDING:
         Object.assign(state.replies.byId[action.byId], action.payload );
         return state

      case types.UPDATE_REPLY.SUCCESS:
         var repliesToUpdate = state.replies.byId[action.byId]; 
         let updatedReply = action.payload.reply;
        
         helper.updateReducerListEntynties(repliesToUpdate.replyList, updatedReply);
         return state
    
      case types.UPDATE_REPLY.ERROR:
         Object.assign(state.replies.byId[action.byId], action.payload );
         return state
       

      default:
         return state; 
   }
}

   

const modalState = {
   isOpen     : false,
   modalType  : null,
   modalProps : {},  
};



export  function modal(state=modalState, action) {
   switch (action.type){
      case 'SHOW_MODAL':
      console.log(state, action)
          let newModal  = Object.assign({}, state, action.payload)
         console.log(newModal, state);   
         return newModal;  

       case 'HIDE_MODAL':
          let hideModal  = Object.assign({}, state, action.payload)
          return hideModal;    
         
      default:
         return state;
   }
}




