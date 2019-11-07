import  * as types  from '../actions/types';





export const createActionPending = (byId, actionType) => {
   //console.log(actionType)
    return{
        type: actionType.PENDING,
        byId,
        payload: {
           isLoading : true,
        }
    }
};



export const createActionSuccess = (byId, actionType, response) => {
   //console.log(actionType)
   return{
      type: actionType.SUCCESS,
      byId,
      payload: {
         newObject   : response, 
         isLoading   : false,

      }
   };
};


export const createActionError = (byId, actionType, error) => ({
  type: actionType.ERROR,
  byId,
  payload: {
     error     : error.detail, 
     isLoading : false,
  }
});




export const getIndexSuccess = (options) => {
    
    return {
        type         : types.GET_INDEX.SUCCESS,
   
        payload: {
            isLoading : false,
            isSuccess : true,
        }
    };
};




export const getIndexPending = () => {

    return{
    type    : types.GET_INDEX.PENDING,
        payload : {
            isLoading : true,
            isSuccess : false,
        }
    }
};





export const getIndexError = ( error) => ({
    type    : types.GET_INDEX.ERROR,
    payload : {
      error     : error, 
      isLoading : false,
      isSuccess : false,
    }
});


export const getQuestionPending = (id) => {
  // console.log(actionType)
  var questionById = `question${id}`;
   return{
      type: types.GET_QUESTION.PENDING,
      questionById,
      payload: {
         isLoading : true,
         question           : "",
         newObject          : "",
         answerList         : [],
         answer             : "",  
         questionHasAnswer  : false,
         userHasAnswer      : false,
         userAnswer         : '',
         visited            : false,
         error              : '',
      }
   }
};



export const getQuestionSuccess = (question) => {
   //@userAnswer is for what
   // 
   var userAnswer = getUserAnswer(question.answers);
   var id = question.id;
   var questionById = `question${id}`;
   var answerById = `answer${id}`;


   return{
      type: types.GET_QUESTION.SUCCESS,
      questionById,
      payload: {
         question, 
         answerList        : [answerById],
         userAnswer        : userAnswer,
         userHasAnswer     : userAnswer?true:false,
         questionHasAnswer : question.answers.length?true:false,
         isLoading         : false,

      }
   };
};



export const getQuestionError = (id, error) => ({
   type         : types.GET_QUESTION.ERROR,
   questionById : `question${id}`,
   payload: {
      error     : error, 
      isLoading : false,
   }
});





export const getPostPending = (id) => {
   var postById = `post${id}`;
   return{
      type: types.GET_POST.PENDING,
      postById,
      payload: {
         isLoading          : true,
         post               : "",
         newObject          : "",
         commentList        : [],
         visited            : false,
         error              : '',
      }
   }
};



export const getPostSuccess = (post) => {
   var id = post.id;
   var postById = `post${id}`;
   var commentById = `commentsPost${id}`;
   
   return{
      type: types.GET_POST.SUCCESS,
      postById,
      payload: {
         post              : post, 
         commentList       : [commentById],
         isLoading         : false,

      }
   };
};



export const getPostError = (id, error) => ({
  type: types.GET_POST.ERROR,
  postById : `post${id}`,
  payload: {
     error     : error, 
     isLoading : false,
  }
});





export const getUserProfilePending = (id) => {
   var profileById = `userProfile${id}`;
   return{
      type: types.GET_USER_PROFILE.PENDING,
      profileById,
      payload: {
         isLoading          : true,
         user               : "",
         questions          : [],
         answers            : [],
         posts              : [],
         followers          : [],
         followings         : [],
         error              : '',
      }
   }
};



export const getUserProfileSuccess = (userProfile) => {
   var id = userProfile.id;
   var profileById = `userProfile${id}`;

    return{
        type: types.GET_USER_PROFILE.SUCCESS,
        profileById,
        payload: {
            user         : userProfile, 
            questions    : userProfile.questions,
            answers      : userProfile.answers,
            posts        : userProfile.posts,
            followers    : userProfile.followers,
            followings   : userProfile.followings,
            isLoading    : false,
        }
    };
};



export const getUserProfileError = (id, error) => ({
  type: types.GET_USER_PROFILE.ERROR,
  profileById : `userProfile${id}`,
  payload: {
     error     : error, 
     isLoading : false,
  }
});






export const deleteQuestionPending = id => ({
  type:  types.DELETE_QUESTION.PENDING,
  payload: {
    id
  }
});




export const deleteQuestionSuccess= ({ success }) => ({
  type:  types.DELETE_QUESTION.SUCCESS,
  payload: {
     success,
  }
});



export const deleteQuestionError = ({error}) => ({
  type:  types.DELETE_QUESTION.ERROR,
  payload: {
    error,
  }
});







export const updateActionPending = (actionType, byId) => ({
  type:  actionType.PENDING,
  byId,
  payload: {
    isLoading: false,
  }
});




export const updateActionSuccess = (actionType, byId, data)=> {
   console.log(actionType, data)

    return{
        type:  actionType.SUCCESS,
        byId,
        payload: {
            ...data,
            isLoading : false,
      }
   };
};


export const updateActionError = (actionType, byId, error) => ({
  type:  actionType.ERROR,
  byId,
  payload: {
   error,
   isLoading : false,
  }
});


export const getQuestionListSuccess = (byId, questionList) => {
    return{
	   type: types.GET_QUESTION_LIST.SUCCESS,
      byId,
      payload: {
         questionList,
         isLoading   : false,
      }
   }
};



export const getQuestionListPending = (byId) => ({
	type: types.GET_QUESTION_LIST.PENDING,
   byId,
   payload: {
      isLoading    : true,
      questionList : [],
      error        : "",
   }
});



export const getQuestionListError = (byId, error) =>({
	type: types.GET_QUESTION_LIST.ERROR,
   byId,
   payload: {
    error: error.detail,
    isLoading: false,
  }

});



export const getPostListSuccess = (byId, postList) => {
    return{
      type: types.GET_POST_LIST.SUCCESS,
      byId,
      payload: {
         postList,
         isLoading : false,
      }
   }
};



export const getPostListPending = (byId) => ({
    type: types.GET_POST_LIST.PENDING,
    byId,
    payload: {
      isLoading  : true,
      postList   : [],
      error      : "",  
    }
});



export const getPostListError = ( byId, error) =>({
    type: types.GET_POST_LIST.ERROR,
    byId,
    payload: {
        error: error.detail,
        isLoading: false,
    }

});



export const getAnswerListSuccess = (byId, answerList) => {

    return{
        type: types.GET_ANSWER_LIST.SUCCESS,
        byId,
        payload: {
            answerList,
            isLoading : false,
        }
    };
};



export const getAnswerListPending = (byId) => ({
   type: types.GET_ANSWER_LIST.PENDING,
   byId,
   payload: {
      isLoading: true,
   }
});



export const getAnswerListError = (byId,error) =>({
   type: types.GET_ANSWER_LIST.ERROR,
   byId,
   payload: {
    error: error,
    isLoading: false,
  }

});




export const getCommentListSuccess = (byId, commentList) => {
    return{
        type: types.GET_COMMENT_LIST.SUCCESS,
        byId,
        payload: {
            comments        : commentList,
            isLoading       : false,
            hasCommentsLink : false,
        }
    };
};



export const getCommentListPending = (byId) => ({
    type: types.GET_COMMENT_LIST.PENDING,
    byId,
    payload: {
        showLink    : false,
    }
});



export const getCommentListError = (byId, error) =>({
   type: types.GET_COMMENT_LIST.ERROR,
   byId,
   payload: {
    error: error,
    isLoading: false,
  }

});





export const getReplyListPending = (actionType, byId) => ({
   type    : actionType.PENDING,
   byId,
   payload : {
      showLink    : false,
   },
   
});




export const getReplyListSuccess = (actionType, byId, replyList) => {
    return{
      type    : actionType.SUCCESS,
      byId,
      payload : {
         replyList  : replyList,
         isLoading  : false, 
      }
   };
};


export const getReplyListError = (actionType,byId, error) =>({
   type    : actionType.ERROR,
   byId,
   payload : {
      error       : error,
      isLoading   : false,
   }
});




export const getReplyChildListPending = (actionType, byId) => ({
   type: actionType.PENDING,
   byId,
   payload: {
      isLoading : true,
      showLink  : false,
   }
});




export const getReplyChildListSuccess = (actionType, byId, replyList) => {

    return{
      type: actionType.SUCCESS,
      byId,
      payload: {
         replyList,
         isLoading       : false,
         showLink        : false,

      }
   }
};


export const getReplyChildListError = (actionType, byId, error) =>({
   type: actionType,
   byId,
   payload : {
    error  : error,
    isLoading : false,
    showLink  : true,
  }

});




export const handleError  = () => ({
  type: types.DEBUG.ERROR,
  payload: {
    error: 'Some thing wrong happened into the code.',
  }
})



export const Redirected = () => ({
    type: 'VIEW_NEW_QUESTION',
    payload: {
        visited: true,  
    }
});




export const togglePasswordResetForm = (props) => {
    console.log(props)
    return{
        type: types.TOGGLE.PASSWORD_RESET_FORM,
        payload: {
            isOnPasswordResetForm     : props.value, 
        },
    };
};


export const toggleSignUpForm = (props) => {
    return {
        type: types.TOGGLE.SIGNUP_FORM,
        payload: {
            isOnSignUpForm          : props.value,
          
        }
    };
};



export const authenticationPending = () => ({
    type   : types.USER_AUTHENTICATION.PENDING,
    payload : {
        isLoading: true,      
    }
});


export const authenticationSuccess = (successResponse) => {
      
      var isLoggedIn = successResponse && successResponse.key?true:false;

      let tokenKey = successResponse && successResponse.key?
                                        successResponse.key:null;  

      let detail = successResponse && successResponse.detail?
                                      successResponse.detail:null; 
      return {
         type   : types.USER_AUTHENTICATION.SUCCESS,
         payload : {
            auth :{
                tokenKey,
                isLoggedIn,
                detail,
            },

            isLoading  : false,
         }
      };
};


export const authenticationError = (error) => {
   console.log(error)
   return {
      type   : types.USER_AUTHENTICATION.ERROR,
      payload : {
        auth:{
          error     : error.data || error,
        },

        isLoading : false,
      }
  };
};




export const getCurrentUserSuccess = (response) => {
   return {
      type    : types.GET_CURRENT_USER.SUCCESS,
      payload : {
           user : response,
           isLoading   : false,
      }
  };
};



export const getCurrentUserPending = () => {
 console.log('is loading the current user...')
   return {
      type    : types.GET_CURRENT_USER.SUCCESS,
      payload : {
            isLoading: true,
      }
  };
};



export const getUserListSuccess = (byId, users) => {
    console.log(users)
    return{
      type: types.GET_USER_LIST.SUCCESS,
      byId,
      payload: {
         userList    : users,
         isLoading   : false,
      }
   }
};



export const getUserListPending = (byId) => ({
   type: types.GET_USER_LIST.PENDING,
   byId,
   payload: {
      isLoading : true,
      userList  : [],
      error     : '',
   }
});



export const getUserListError = (byId, error) =>({
   type: types.GET_USER_LIST.ERROR,
   byId,
   payload: {
    error: error.detail,
    isLoading: false,
  }

});


export const getCurrentUserError = (error) => {
   console.log(error)
   return {
      type   :types.GET_CURRENT_USER.ERROR,
      payload : {
         error: error.data, 
         isLoading: false,
         
      }
  };
};


export const getCommentLindData = (byId,comments) => {
      
    return {     
        type   : 'GET_COMMENT_LINK_DATA',
        byId,
        payload : {

            showLink         : true,
            commentList      : comments,
            isLoading        : false,
            error            : '',
            linkData : {
                comment         : comments[0],
                numOfComments   : comments.length,
            
            },
        }
    };
};




export const getRepliesLindData = (props) => {
   var replies = props.replies;
   var reply = replies[0];
   var byId = props.byId;
   return {
      type      : props.actionType,
      byId,
      payload : {
         replyList  : replies,
         error      : '',
         showLink   : true,
         isLoading  : false,
         linkData   : {
            reply        : reply,
            totalReplies : replies.length,
         }
      },
   };
};




export const getReplyChildLindData = (props) => {
   var reply = props.reply;
   var byId = props.byId;
   console.log(props, reply)

   return {
      type        : props.actionType,
      byId,
      payload : {
      replyList    : [],
      error        : '',
      showLink     : reply.has_children,
      isLoading    : false,
      linkData  : {
         reply        : reply,
         totalReplies : reply.child_count,
         },
      },
   };
};


export const showModal = (props) =>{
   console.log(props)

   return {
      type: 'SHOW_MODAL',
      payload : {
         modalProps : props.modalProps,
         modalType  : props.modalType,
         isOpen     : true,
      }
   };
};




export const hideModal = () =>({
   type: 'HIDE_MODAL',
   payload : {
      isOpen    : false,
      modalType : null,
      modalProps : {},
   }
 });




export const getUserAnswer = (answerList) => {
   let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties')); 
   let currentUser =  cachedEntyties.currentUser;
   var answer = '' 
      
   if (answerList.length) {
      answerList.map( (item, index) => {
         if (item.created_by.id === currentUser.id) {
           answer = item;
         }
         return answer;
      });
   }

   return answer;
   
   };



