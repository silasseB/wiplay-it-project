import  * as types  from '../actions/types';





export const createActionPending = (params) => {
   //console.log(actionType)
    return{
        type: params.actionType && params.actionType.PENDING,
        byId : params.byId,
        payLoad: {
           isCreating : true,
        }
    }
};



export const createActionSuccess = (params) => {
   //console.log(actionType)
   return{
      type: params.actionType && params.actionType.SUCCESS,
      byId: params.byId,
      payLoad: {
        ...params.data, 
        isCreating   : false,

      }
   };
};


export const createActionError = (params) => ({
  type: params.actionType && params.actionType.ERROR,
  byId : params.byId,
  payLoad: {
     error     : params.error.detail, 
     isCreating : false,
  }
});





export const updateActionPending = (params) => ({
  type:  params.actionType && params.actionType.PENDING,
  byId : params.byId,
  payLoad: {
    submitting : true,
    isUpdating : true,
  }
});




export const updateActionSuccess = (params)=> {
   console.log(params)

    return{
        type:  params.actionType && params.actionType.SUCCESS,
        byId : params.byId,
        payLoad: {
            ...params.data,
            submitting : false,
            isUpdating : false
      }
   };
};


export const updateActionError = (params) => ({
  type:  params.actionType && params.actionType.ERROR,
  byId : params.byId,
  payLoad: {
    error: params.error,
    submitting : false,
  }
});


export const ModalSubmitPending = (byId) => ({
    type: "MODAL_SUBMIT_PENDING",
    byId,
    payLoad: {
        submitting     : true,
        data           : null,
        successMessage : null,
    }
});


export const ModalSubmitSuccess = (params) => {

    let {objName, isUpdating, isCreating, modalType } = params;
    let action = isCreating &&'created' || isUpdating && 'edited';
    let successMessage = `${objName} successefully ${action}`

    return{
        type : "MODAL_SUBMIT_SUCESS",
        byId : modalType,
        payLoad : {
            ...params,
            submitting     : false,
            successMessage : successMessage,
        }
        
    };
};




export const ModalSubmitError = (params) => {

    return{
        type    : "MODAL_SUBMIT_ERROR",
        byId    : params.modalType, 
        payLoad : {
            error   : params.error,
            submitting : false,
            errorMessage: ``,
        }
    };
};



export const getIndexPending = () => {

    return{
    type    : types.GET_INDEX.PENDING,
        payLoad : {
            isLoading : true,
            isSuccess : false,
        }
    }
};





export const getIndexError = ( error) => ({
    type    : types.GET_INDEX.ERROR,
    payLoad : {
      error     : error, 
      isLoading : false,
      isSuccess : false,
    }
});


export const getIndexSuccess = (data) => {
        
    return {
        type         : types.GET_INDEX.SUCCESS,
   
        payLoad: {
            isLoading : false,
            isSuccess : true,
            ...data,
        }
    };
};


export const getQuestionPending = (byId) => {
   
    return{
        type: types.GET_QUESTION.PENDING,
        byId,
        payLoad: {
           isLoading : true,
        }
    }
};



export const getQuestionSuccess = ( byId, question) => {
    //@userAnswer is for what
    // 
    let userAnswer        = question.answers  && getUserAnswer(question.answers);
    let userHasAnswer     =     userAnswer?true:false;
    let questionHasAnswer = question.answers && question.answers.length && true ||false;
   
    return{
        type: types.GET_QUESTION.SUCCESS,
        byId,
        payLoad: {
            question, 
            questionHasAnswer,
            userAnswer,
            userHasAnswer,
            isLoading         : false,

      }
   };
};



export const getQuestionError = ( byId, error) => ({
    type         : types.GET_QUESTION.ERROR,
    byId ,
    payLoad: {
      error     : error, 
      isLoading : false,
    }
});





export const getPostPending = (postById) => {
   
    return{
        type : types.GET_POST.PENDING,
        byId : postById,
        payLoad: {
           isLoading          : true,
           post               : "",
           newObject          : "",
           commentList        : [],
           visited            : false,
           error              : '',
        }
    }
};



export const getPostSuccess = (postById ,post) => {
   
      
    return{
        type : types.GET_POST.SUCCESS,
        byId : postById,
        payLoad: {
            post, 
            isLoading : false,

        }
    };
};



export const getPostError = (postById, error) => ({
    type : types.GET_POST.ERROR,
    byId : postById,
    payLoad: {
       error     : error, 
       isLoading : false,
    }
});





export const getUserProfilePending = (byId) => {
   
    return{
        type: types.GET_USER_PROFILE.PENDING,
        byId,
        payLoad: {
            isLoading          : true,
        }
    };
};



export const getUserProfileSuccess = ( byId, userProfile ) => {
    //console.log(userProfile, byId)
    
    return{
        type: types.GET_USER_PROFILE.SUCCESS,
        byId,
        payLoad: {
            user      : userProfile,
            isLoading : false,
        }
    };
};



export const getUserProfileError = ( byId, error) => ({
    type : types.GET_USER_PROFILE.ERROR,
    byId,
    payLoad: {
       error     : error, 
       isLoading : false,
    }
});






export const deleteQuestionPending = id => ({
  type:  types.DELETE_QUESTION.PENDING,
  payLoad: {
    id
  }
});




export const deleteQuestionSuccess= ({ success }) => ({
  type:  types.DELETE_QUESTION.SUCCESS,
  payLoad: {
     success,
  }
});



export const deleteQuestionError = ({error}) => ({
  type:  types.DELETE_QUESTION.ERROR,
  payLoad: {
    error,
  }
});



export const getQuestionListSuccess = (byId, questionList) => {
    //console.log(questionList)
    return{
	   type: types.GET_QUESTION_LIST.SUCCESS,
      byId,
      payLoad: {
         questionList,
         isLoading   : false,
      }
   }
};



export const getQuestionListPending = (byId) => ({
	type: types.GET_QUESTION_LIST.PENDING,
    byId,
    payLoad: {
        isLoading    : true,
      
    }
});



export const getQuestionListError = (byId, error) =>({
	type: types.GET_QUESTION_LIST.ERROR,
   byId,
   payLoad: {
    error: error.detail,
    isLoading: false,
  }

});



export const getPostListSuccess = ( byId, postList) => {
    return{
      type: types.GET_POST_LIST.SUCCESS,
      byId,
      payLoad: {
         postList,
         isLoading : false,
      }
   }
};



export const getPostListPending = (byId) => ({
    type: types.GET_POST_LIST.PENDING,
    byId,
    payLoad: {
      isLoading  : true,
        
    }
});



export const getPostListError = ( byId, error) =>({
    type: types.GET_POST_LIST.ERROR,
    byId,
    payLoad: {
        error: error.detail,
        isLoading: false,
    }

});



export const getAnswerListSuccess = (byId, answerList) => {

    return{
        type: types.GET_ANSWER_LIST.SUCCESS,
        byId,
        payLoad: {
            answerList,
            isLoading : false,
        }
    };
};



export const getAnswerListPending = (byId) => ({
   type: types.GET_ANSWER_LIST.PENDING,
   byId,
   payLoad: {
      isLoading: true,
   }
});



export const getAnswerListError = (byId,error) =>({
   type: types.GET_ANSWER_LIST.ERROR,
   byId,
   payLoad: {
    error: error,
    isLoading: false,
  }

});




export const getCommentListSuccess = (byId, commentList) => {
   
    return{
        type: types.GET_COMMENT_LIST.SUCCESS,
        byId,
        payLoad: {
            comments : commentList,
            showLink : false,
        }
    };
};



export const getCommentListPending = (byId) => {
  
  return{
    type: types.GET_COMMENT_LIST.PENDING,
    byId,
    payLoad: {
        showLink    : false,
    }
  };
};



export const getCommentListError = (byId, error) =>({
   type: types.GET_COMMENT_LIST.ERROR,
   byId,
   payLoad: {
    error: error,
    isLoading: false,
  }

});





export const getReplyListPending = (actionType, byId) => ({
   type    : actionType.PENDING,
   byId,
   payLoad : {
      showLink    : false,
   },
   
});




export const getReplyListSuccess = (actionType, byId, replyList) => {
    return{
      type    : actionType.SUCCESS,
      byId,
      payLoad : {
         replyList  : replyList,
         isLoading  : false, 
      }
   };
};


export const getReplyListError = (actionType,byId, error) =>({
   type    : actionType.ERROR,
   byId,
   payLoad : {
      error       : error,
      isLoading   : false,
   }
});




export const getReplyChildListPending = (actionType, byId) => ({
   type: actionType.PENDING,
   byId,
   payLoad: {
      isLoading : true,
      showLink  : false,
   }
});




export const getReplyChildListSuccess = (actionType, byId, replyList) => {

    return{
      type: actionType.SUCCESS,
      byId,
      payLoad: {
         replyList,
         isLoading       : false,
         showLink        : false,

      }
   }
};


export const getReplyChildListError = (actionType, byId, error) =>({
   type: actionType,
   byId,
   payLoad : {
    error  : error,
    isLoading : false,
    showLink  : true,
  }

});




export const handleError  = (error) => {
    console.log(error)
    let _error = 'Something wrong happened, please try again.';
    error = error && error || _error; 

    return {
        type: types.SERVER.ERROR,
        payLoad: {
            error,
        }
    };
};



export const Redirected = () => ({
    type: 'VIEW_NEW_QUESTION',
    payLoad: {
        visited: true,  
    }
});




export const togglePasswordResetForm = (props) => {
    console.log(props)
    return{
        type: types.TOGGLE.PASSWORD_RESET_FORM,
        payLoad: {
            isOnPasswordResetForm     : props.value, 
        },
    };
};


export const toggleSignUpForm = (props) => {
    return {
        type: types.TOGGLE.SIGNUP_FORM,
        payLoad: {
            isOnSignUpForm          : props.value,
          
        }
    };
};



export const authenticationPending = () => ({
    type   : types.USER_AUTHENTICATION.PENDING,
    payLoad : {
        isLoading: true,      
    }
});


export const authenticationSuccess = (successResponse) => {
      console.log(successResponse)
      
      var isLoggedIn = successResponse && successResponse.key?true:false;

      let tokenKey = successResponse && successResponse.key?
                                        successResponse.key:null;  
    
      let successMessage = successResponse && successResponse.detail?
                                      successResponse.detail:null; 
      let email = successResponse && successResponse.email?
                                     successResponse.email:null;
      return {
         type   : types.USER_AUTHENTICATION.SUCCESS,
         payLoad : {
            auth :{
                tokenKey,
                isLoggedIn,
                successMessage,
            },

            isLoading  : false,
         }
      };
};


export const authenticationError = (error) => {
   console.log(error)
   return {
      type   : types.USER_AUTHENTICATION.ERROR,
      payLoad : {
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
      payLoad : {
           user : response,
           isLoading   : false,
      }
  };
};



export const getCurrentUserPending = () => {
    
   return {
      type    : types.GET_CURRENT_USER.SUCCESS,
      payLoad : {
            isLoading: true,
      }
  };
};



export const getUserListSuccess = (byId, users) => {
    
    return{
      type: types.GET_USER_LIST.SUCCESS,
      byId,
      payLoad: {
         userList    : users,
         isLoading   : false,
      }
   }
};



export const getUserListPending = (byId) => ({
   type: types.GET_USER_LIST.PENDING,
   byId,
   payLoad: {
      isLoading : true,
      userList  : [],
      error     : '',
   }
});



export const getUserListError = (byId, error) =>({
   type: types.GET_USER_LIST.ERROR,
   byId,
   payLoad: {
    error: error.detail,
    isLoading: false,
  }

});


export const getCurrentUserError = (error) => {
   console.log(error)
   return {
      type   :types.GET_CURRENT_USER.ERROR,
      payLoad : {
         error: error.data, 
         isLoading: false,
         
      }
  };
};

export const AddNewContents =(byId, contents) =>{
     return {
        type : 'ADD_NEW_CONTENTS',
        byId,
        payLoad : {
            comments,
        }
     }
};

export const getCommentLindData = (byId, comments) => {
      
    return {     
        type   : 'GET_COMMENT_LINK_DATA',
        byId,
        payLoad : {

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
      payLoad : {
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
   //console.log(props, reply)

   return {
      type        : props.actionType,
      byId,
      payLoad : {
      replyList    : reply.children,
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


export const showModal = (params) =>{
    let {background, modalType, boolValue} = params; 
       
    return {
      type : 'MODAL_ROUTER',
      byId : modalType,
      payLoad : {
        modalIsOpen  : boolValue,
        background ,
      }
   };
};








export const getUserAnswer = (answerList) => {
   let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities')); 
   let currentUser =  cacheEntities.currentUser;
   currentUser = currentUser.user;
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



