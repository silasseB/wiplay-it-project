import  * as types  from 'actions/types';





export const createActionPending = (params) => {
   //console.log(actionType)
   let {byId, actionType} = params;

    return{
        type : actionType && actionType.PENDING,
        byId,
        payLoad: {
           isCreating : true,
        }
    }
};



export const createActionSuccess = (params) => {
   //console.log(actionType)
   let {byId, actionType, data} = params;
 
    return{
        type : actionType && actionType.SUCCESS,
        byId,
        payLoad: {
            ...data, 
            isCreating   : false,
        }
    };
};


export const createActionError = (params) => {
    let {byId, actionType, error} = params;
    error = error && error.detail; 

    return {
        type : actionType && actionType.ERROR,
        byId,
        payLoad: {
           error,
           isCreating : false,
           created    : true,
        }
    }
};





export const updateActionPending = (params) => {
    let {byId, actionType} = params;

    return {
        type : actionType && actionType.PENDING,
        byId,
        payLoad : {
            submitting : true,
            isUpdating : true,
        }
    }
};




export const updateActionSuccess = (params)=> {
   //console.log(params)
   let {byId, actionType, data} = params

    return{
        type : actionType && actionType.SUCCESS,
        byId,
        payLoad: {
            ...data,
            submitting : false,
            updated    : true,
      }
   };
};


export const updateActionError = (params) => {
    let {byId, actionType, error} = params
    console.log(params)

    return {
        type : actionType && actionType.ERROR,
        byId,
        payLoad: {
           error,
           submitting : false,
        }
    }
};


export const ModalSubmitPending = (modalName) => ({
    type : "MODAL_SUBMIT_PENDING",
    byId : modalName,
    payLoad: {
        submitting     : true,
    }
});


export const ModalSubmitSuccess = (params) => {
    let {objName, isUpdating, isCreating, modalName, data } = params;
    let action         = isCreating &&'created' || isUpdating && 'edited';
    let successMessage = `${objName} successefully ${action}`
    console.log(params)

    return{
        type : "MODAL_SUBMIT_SUCESS",
        byId : modalName,
        payLoad : {
            successMessage,
            ...params,
            submitting : false,
            updated    : isUpdating || false,
            created    : isCreating || false,
        }
        
    };
};




export const ModalSubmitError = (params) => {
    let {byId, modalName, error} = params;
    
    return{
        type    : "MODAL_SUBMIT_ERROR",
        byId    : modalName, 
        payLoad : {
            error,
            submitting : false,
            errorMessage: ``,
        }
    };
};


export const getAboutInfoPending = () => {

    return{
        type    : 'ABOUT_PENDING',
        payLoad : {
            isLoading : true,
        }
    }
};


export const getAboutInfoSuccess = (data) => {

    return{
        type    : 'ABOUT_SUCCESS',
        payLoad : {
            isLoading : false,
            info      : data
        }
    }
};


export const getAboutInfoError = (error) => {

    return{
        type    : 'ABOUT_ERROR',
        payLoad : {
            isLoading : false,
            error
        }
    }
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





export const getIndexError = ( error) => {
    console.log(error)
    return{
        type    : types.GET_INDEX.ERROR,
        payLoad : {
            error, 
            isLoading : false,
            isSuccess : false,
        }
    }
};


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



export const getQuestionError = (byId, error) => ({
    type         : types.GET_QUESTION.ERROR,
    byId ,
    payLoad: {
      error, 
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
       error, 
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



export const getUserProfileSuccess = (byId, userProfile) => {
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



export const getUserProfileError = (byId, error) => ({
    type : types.GET_USER_PROFILE.ERROR,
    byId,
    payLoad: {
       error, 
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
    error,
    isLoading: false,
  }

});



export const getPostListSuccess = (byId, postList) => {
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



export const getPostListError = (byId, error) =>({
    type: types.GET_POST_LIST.ERROR,
    byId,
    payLoad: {
        error,
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
    error,
    isLoading: false,
  }

});




export const getCommentListSuccess = (byId, comments) => {
   
    return{
        type: types.GET_COMMENT_LIST.SUCCESS,
        byId,
        payLoad: {
            comments,
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
    error,
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
      error,
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
        error,
        isLoading : false,
        showLink  : true,
    }

});




export const handleError  = (error) => {
    console.log(error)
    error = error || 'Something wrong happened, please try again.'; 

    return {
        type: types.SERVER.ERROR,
        payLoad: {
            error,
        }
    };
};



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



export const authenticationPending = (isSocialAuth=false) => ({
    type   : types.USER_AUTHENTICATION.PENDING,
    payLoad : {
        isLoading : true,
        error     : undefined,  
        isSocialAuth,    
    }
});


export const authenticationSuccess = (data={}, isSocialAuth=false) => {
    console.log(data)
    
    return {
        type   : types.USER_AUTHENTICATION.SUCCESS,
        payLoad : {
            ...data,
            isLoading  : false,
            isSocialAuth,
        }
    };
};


export const authenticationError = (error, isSocialAuth=false) => {
    console.log(error)
    return {
        type   : types.USER_AUTHENTICATION.ERROR,
        payLoad : {
            error,
            isLoading : false,
            isSocialAuth,
        }
    };
};




export const getCurrentUserSuccess = (user) => {
    //console.log('current user is this: ', user)
    return {
        type    : types.GET_CURRENT_USER.SUCCESS,
        payLoad : {
            user,
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
    }
});



export const getUserListError = (byId, error) =>({
    type: types.GET_USER_LIST.ERROR,
    byId,
    payLoad: {
        error,
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


export const showModal = (modalName, isOpening) =>{
    
    return {
        type : 'MODAL_ROUTER',
        byId : modalName,
        payLoad : {
        modalIsOpen  : isOpening,
        
      }
   };
};


export const getAdminPending = () => {
    
    return {
        type    : 'ADMIN_PENDING',
        payLoad : {
            isLoading: true,
        }
    };
};


export const getAdminSuccess = (data) => {

    
    return {
        type    : 'ADMIN_SUCCESS',
        payLoad : {
            ...data,
            isLoading: false,
        }
    };
};


export const getAdminError = (error) => {
    
    return {
        type    : 'ADMIN_ERROR',
        payLoad : {
            error,
            isLoading: false,
        }
    };
};


export const getUserAnswer = (answerList) => {
    let cacheEntities = JSON.parse(localStorage.getItem('@@CacheEntities')); 
    let currentUser =  cacheEntities.currentUser;
    currentUser = currentUser.user;
    var answer  = ''; 
      
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



