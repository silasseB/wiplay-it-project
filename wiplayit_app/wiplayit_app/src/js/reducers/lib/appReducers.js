import Helper from '../../containers/utils/helpers';
import  * as types  from '../../actions/types';


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
            isLoading  : false,
            error      : null,

            auth : {
                tokenKey    : null,
                isLoggedIn  : false,
                successMessage      : null,
                error       : null,
               
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
        modal : {
            submitting     : false,
            error          : null,
            successMessage : null,
        },
    };
};


export function entyties(state=InitialState(), action) {
    switch (action.type){
        case "SUBMIT_PENDING":
            console.log(action, state)
            Object.assign(state.modal, action.payload)

           return state;

        case "SUBMIT_SUCESS":
            console.log(action, state)
            Object.assign(state.modal, action.payload)

           return state;

        case "SUBMIT_ERROR":
            Object.assign(state.modal, action.payload)

           return state;
    
        case types.USER_AUTHENTICATION.PENDING :
            Object.assign(state.userAuth, action.payload)
            console.log(state.userAuth, action)
            return state; 

        case types.USER_AUTHENTICATION.SUCCESS:
         Object.assign(state.userAuth, action.payload);
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


          if (!state.userProfile.byId[action.profileById]) {
              Object.defineProperty(state.userProfile.byId, action.profileById, {value : action.payload});
          }
          return state;

      case types.GET_USER_PROFILE.SUCCESS:
            console.log(action, state)
            let newState = state;
            if (state.userProfile.byId[action.profileById]) {
                console.log(newState ,action) 
               newState.userProfile.allIds.push(action.profileById)
               Object.assign(newState.userProfile.byId[action.profileById], action.payload);
            }
        return newState;

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
            Object.assign(state.question.byId[action.questionById], action.payload);
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
         console.log(state.answers, action)
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
         
         Object.assign(state.comments.byId[action.byId], action.payload)
         console.log(action, state.comments)
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
           
        console.log(state, action)
        let payload = action.payload;

        if (!state.userProfile.byId[action.byId]) {
            Object.defineProperty(
                   state.userProfile.byId, 
                   action.byId, {value : payload} 
                );
        }
        console.log(state,action)

        return state;

      case types.UPDATE_USER_PROFILE.SUCCESS:
           console.log(state)

           if (!state.userProfile.byId[action.byId]) {
                Object.defineProperty(
                   state.userProfile.byId, 
                   action.byId, {value : action.payload} 
                );

            }else{
                Object.assign(state.userProfile.byId[action.byId], action.payload);
            }

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
         var  updatedUser     = action.payload && action.payload.user;

        if (state.users.byId[action.byId]) {
            var usersToUpdate = state.users.byId[action.byId];
            usersToUpdate = usersToUpdate.userList
            console.log(usersToUpdate)
            helper.updateReducerListEntynties(usersToUpdate, updatedUser);
        }
                  
        return state;  

      case types.UPDATE_USER_LIST.ERROR:
         Object.assign(state.users.byId[action.byId], {error: action.payload});
        return state;  


      case types.UPDATE_QUESTION.PENDING:
        console.log(action, state.question)
        if (state.question.byId[action.byId]) {
           Object.assign(state.question.byId[action.byId], action.payload);

        }else if(state.questions.byId[action.byId]){
            Object.assign(state.questions.byId[action.byId], action.payload);
        }
        return state;

    case types.UPDATE_QUESTION.SUCCESS:
        let updatedQuestion = action.payload && action.payload.question

        if (state.question.byId[action.byId]) {
            let question = state.question.byId[action.byId]
            question     = question.question;
           
            let updatedQuestionState = {
                isUpdating : false,
                question   : Object.assign(question, updatedQuestion),
            
            } 
        
           Object.assign(state.question.byId[action.byId], updatedQuestionState);

        }else if(state.questions.byId[action.byId]){
            
            var questions = state.questions.byId[action.byId];
            let questionList = questions && questions.questionList;
            helper.updateReducerListEntynties(questionList, updatedQuestion);

        };
        return state;                  
      

    case types.UPDATE_QUESTION.ERROR:
        let { error } = action.payload

        if (state.question.byId[action.byId]) {
           Object.assign(state.question.byId[action.byId], action.payload);

        }else if(state.questions.byId[action.byId]){
            Object.assign(state.questions.byId[action.byId], action.payload);
        };

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
         comments = comments.commentList
         helper.updateReducerListEntynties(comments, updatedComment);
         console.log(action, updatedComment, comments)
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

   
