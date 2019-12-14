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
    switch (action.type){

        case 'MODAL_ROUTER':
            Object.assign(state.modal, action.payload) ;  
            return state;


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


          if (!state.userProfile[action.profileById]) {
              Object.defineProperty(state.userProfile, action.profileById,
                                         {  value : action.payload,
                                            writable     : true,
                                            configurable : true,
                                            enumerable   : true,
                                         });
          }
          return state;

      case types.GET_USER_PROFILE.SUCCESS:
            console.log(action, state)

            if (state.userProfile[action.profileById]) {
                //console.log(newState ,action) 
              
               Object.assign(state.userProfile[action.profileById], action.payload);
            }

        return state;

      case types.GET_USER_PROFILE.ERROR:
         Object.assign(state.userProfile[action.profileById], action.payload);
         return state;
              

      case types.GET_USER_LIST.PENDING:
         //console.log(state, action)
         if (!state.users[action.byId]) {
            Object.defineProperty(state.users, action.byId,
                                             {value : action.payload,
                                                writable    : true,
                                               configurable : true,
                                               enumerable   : true,
                                             });
         }
         return state;

      case types.GET_USER_LIST.SUCCESS:
         Object.assign(state.users[action.byId], action.payload);
         return state;

      case types.GET_USER_LIST.ERROR:
         Object.assign(state.users[action.byId], action.payload);
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
         console.log(state, action)
         if (!state.questions[action.byId]) {
            Object.defineProperty(state.questions, action.byId, 
                                                {value : action.payload,
                                                    writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                                });
         }
         return state;       

      case types.GET_QUESTION_LIST.SUCCESS:
            Object.assign(state.questions[action.byId], action.payload);  

            return state;    

      case types.GET_QUESTION_LIST.ERROR:
         Object.assign(state.questions[action.byId], action.payload);
         return state;            
       



      case types.GET_QUESTION.PENDING:

         if (!state.question[action.questionById]) {
            Object.defineProperty(state.question, action.questionById, 
                                                {value : action.payload,
                                                    writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                                });
         }
         return state;      
      
      case types.GET_QUESTION.SUCCESS:
            Object.assign(state.question[action.questionById], action.payload);
         return state; 

      case types.GET_QUESTION.ERROR:
         if (state.question[action.questionById]) {
            Object.assign(state.question[action.questionById], action.payload);
         }
         return state;


      case types.GET_POST_LIST.PENDING:
         //console.log(state, action)
         if (!state.posts[action.byId]) {
            Object.defineProperty(state.posts, action.byId, 
                                          {value : action.payload,
                                            writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                          });
         }
         return state;       

      case types.GET_POST_LIST.SUCCESS:
         //console.log(state, action)
         Object.assign(state.posts[action.byId], action.payload);   
         return state;    

      case types.GET_POST_LIST.ERROR:
         Object.assign(state.posts[action.byId], action.payload);
         return state;              


      case types.GET_POST.PENDING:
         if (!state.post[action.postById]) {
            Object.defineProperty(state.post, action.postById,
                                  {value : action.payload,
                                    writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                  });
         }
         return state;

      case types.GET_POST.SUCCESS:
         var post = action.payload.post;
         //var commentById = `commentsPost${post.id}`;
         //console.log(state, post)
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

         Object.assign(state.post[action.postById], action.payload);
         if (post.comments.length) {
            //Object.defineProperty(state.comments.byId, commentById, {value : commentsState});
         }
         return state;

      case types.GET_POST.ERROR:
         Object.assign(state.post[action.postById], action.payload);
         return state; 


      case types.GET_ANSWER_LIST.PENDING:
         if (!state.answers[action.byId]) {
            Object.defineProperty(state.answers, action.byId, 
                                             {value : action.payload,
                                                writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                             });
         }
         return state;


      case types.GET_ANSWER_LIST.SUCCESS:
         //console.log(state.answers, action)
         Object.assign(state.answers[action.byId],action.payload);
         return state; 

      case types.GET_ANSWER_LIST.ERROR:
         Object.assign(state.answers[action.byId],action.payload);
         return state;     

      case 'GET_COMMENT_LINK_DATA':
         if (!state.comments[action.byId]) {
            Object.defineProperty(state.comments, action.byId,
                                               {value :action.payload,
                                                writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                               });
                
         } 
         return state; 

      case 'GET_REPLY_LINK_DATA':
         //console.log(action)
         if (!state.replies[action.byId]) {
            Object.defineProperty(state.replies, action.byId,
                                       { value :action.payload,
                                         writable     : true,
                                         configurable : true,
                                         enumerable   : true,
                                       });  
            
         }

         return state; 

      case 'GET_REPLY_CHILD_LINK_DATA':
         //console.log(action, state.replies)
         if (!state.replies.byId[action.byId]) {
           Object.defineProperty(state.replies, action.byId,
                        {   value : action.payload,
                            writable     : true,
                            configurable : true,
                            enumerable   : true,
                        });
           
         }
         return state;

      case types.CREATE_QUESTION.PENDING:
         //console.log(action)
         var questionById = action.ById? action.ById:
                                                   "creatingNewQuestion";
         if (!state.question[questionById]) {
            Object.defineProperty(state.question, action.ById,
                                {value:action.payload,
                                    writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                } );
         }

         return state;

      case types.CREATE_QUESTION.SUCCESS:
         Object.assign(state.question[action.ById], state, action.payload);
         return state;
      
      case types.CREATE_QUESTION.ERROR:
        //console.log(action)
        //Object.assign(state.question.byId[action.ById], action.payload);
        return state;  

      case 'VIEW_NEW_QUESTION':
         Object.assign(state.question[action.questionById], action.payload);
         return state;  

      case types.CREATE_ANSWER.PENDING:
         if (!state.answers[action.ById]) {
            Object.defineProperty(state.answers.byId, action.ById,
                                       {value:action.payload,
                                        writable     : true,
                                        configurable : true,
                                        enumerable   : true,
                                       } );
         }
         return state;

      case types.CREATE_ANSWER.SUCCESS:
         Object.assign(state.answers[action.ById], action.payload)
         return state;
      
      case types.CREATE_ANSWER.ERROR:
        Object.assign(state.answers[action.ById], action.payload)
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
         
         Object.assign(state.comments[action.byId], action.payload)
         console.log(action, state.comments)
         return state;    

      case types.GET_REPLY_LIST.PENDING:
         //console.log(action)
         Object.assign(state.replies[action.byId], action.payload)
         return state;    

      case  types.GET_REPLY_CHILD_LIST.PENDING:
         Object.assign(state.replies[action.byId],action.payload);
         return state; 

      case  types.GET_REPLY_CHILD_LIST.SUCCESS:
         Object.assign(state.replies[action.byId],action.payload);
         return state;
      
      case  types.GET_REPLY_CHILD_LIST.ERROR:
         Object.assign(state.replies[action.byId],action.payload);
         return state;     
         
      case types.CREATE_REPLY.PENDING:
         Object.assign(state.replies[action.replyById], action.payload)
         return state;

      case types.CREATE_REPLY.SUCCESS:
         Object.assign(state.replies[action.replyById], state, action.payload)
         return state;
      
      case types.CREATE_REPLY.ERROR:
         Object.assign(state.replies[action.replyById], action.payload)
         return state;  
      
      case types.UPDATE_USER_PROFILE.PENDING:
           
        console.log(state, action)
        let payload = action.payload;

        if (!state.userProfile[action.byId]) {
            Object.defineProperty(
                   state.userProfile, 
                   action.byId,
                   { value : payload,
                     writable     : true,
                     configurable : true,
                     enumerable   : true,} 
                );
        }
        console.log(state,action)

        return state;

      case types.UPDATE_USER_PROFILE.SUCCESS:
           console.log(state)

           if (!state.userProfile[action.byId]) {
                Object.defineProperty(
                   state.userProfile, 
                   action.byId,
                   {value : action.payload,
                    writable     : true,
                    configurable : true,
                    enumerable   : true,} 
                );

            }else{
                Object.assign(state.userProfile[action.byId], action.payload);
            }

        return state;  

      case types.UPDATE_USER_PROFILE.ERROR:
         var profileToUpdate =state.userProfile[action.byId];
         
         if (profileToUpdate && profileToUpdate.user && profileToUpdate.user.user_is_following) {
            profileToUpdate.user.is_following = true

         }else{
            profileToUpdate.user.is_following = false
         }

        Object.assign(state.userProfile[action.byId], { ...profileToUpdate, error: action.payload});
        return state;  


      case types.UPDATE_USER_LIST.PENDING:
         if (state.users[action.byId]) {
            Object.assign(state.users[action.byId], action.payload);
         }
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
        console.log(action, state.post)
        if (state.post[action.byId]) {
           Object.assign(state.post[action.byId], action.payload);

        }else if(state.posts[action.byId]){
            Object.assign(state.posts[action.byId], action.payload);
        }
        return state;

    case types.UPDATE_POST.SUCCESS:
   
        if (state.post[action.byId]) {
            let post = state.post[action.byId]
            post     = post.post;
           
            post = {
                isUpdating : false,
                post   : Object.assign(post, action.payload.post),
            
            } 
        
           Object.assign(state.post[action.byId], post);

        }else if(state.posts[action.byId]){
            let post = action.payload.post;
            
            var posts = state.posts[action.byId];
            let postList = posts && posts.postList;
            
            helper.updateReducerListEntynties(postList, post);

        };
        return state;                  
      

    case types.UPDATE_POST.ERROR:
        
        if (state.post[action.byId]) {
           Object.assign(state.post[action.byId], action.payload);

        }else if(state.posts[action.byId]){
            Object.assign(state.posts[action.byId], action.payload);
        };

        return state;   





      case types.UPDATE_QUESTION.PENDING:
        console.log(action, state.question)
        if (state.question[action.byId]) {
           Object.assign(state.question[action.byId], action.payload);

        }else if(state.questions[action.byId]){
            Object.assign(state.questions[action.byId], action.payload);
        }
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

   
