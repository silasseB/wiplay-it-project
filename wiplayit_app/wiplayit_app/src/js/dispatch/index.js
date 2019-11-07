
 
import Api from '../api';
import Axios from '../axios_instance';
import  * as action  from '../actions/actionCreators';


const axiosApi = new Axios(true);  
const api = new Api();



export function getIndex(options) {
    const instance = axiosApi.axiosInstance();  
    let apiUrl     = api.getIndexApi(); 

    

    return dispatch => {
       dispatch(action.getIndexPending());
       instance.get(apiUrl)
       .then(response => {
             console.log(response)          
            let {posts, questions, answers } = response.data;
            var { questionListById, answerListById, postListById} = options;

            dispatch(action.getAnswerListSuccess(answerListById, answers));
            dispatch(action.getQuestionListSuccess(questionListById, questions));
            dispatch(action.getPostListSuccess(postListById, posts));

            dispatch(action.getIndexSuccess(options));

            
       })
       .catch(error => {
            if (error.response) {
               var { errors } =  error.response.data
               dispatch(action.getIndexError( errors ));

            }else{
                dispatch(action.handleError());
         }
      }); 
   };
};



export function getUserList(props) {
  const instance = axiosApi.axiosInstance();  
  var { apiUrl, usersById } = props;  
  return dispatch => {
      dispatch(action.getUserListPending(usersById))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getUserListSuccess(usersById, response.data)))
      .catch(error => {
      	if (error.response) {
      	   dispatch(action.getUserListError(usersById, error.response.data));
         }else{
         	dispatch(action.handleError());
         }
      }); 
   };
};



export function getQuestionList(questionListById) {
	console.log(questionListById)
    const instance = axiosApi.axiosInstance();  
    let apiUrl     = api.getQuestionListApi(); 

    return dispatch => {
      dispatch(action.getQuestionListPending(questionListById))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getQuestionListSuccess(questionListById, response.data)))
      .catch(error => {
      	if (error.response) {
      		var { errors } =  error.response.data
      	   dispatch(action.getQuestionListError(questionListById, errors ));
         }else{
         	dispatch(action.handleError());
         }
      }); 
   };
};




export function getPostList(postListById) {
  const instance = axiosApi.axiosInstance();  
  let   apiUrl     = api.getPostListApi();  
  return dispatch => {
      dispatch(action.getPostListPending(postListById))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getPostListSuccess(postListById, response.data)))
      .catch(error => {
      	if (error.response) {
      	   dispatch(action.getPostListError(postListById, error.response.data));
         }else{
         	dispatch(action.handleError());
         }
      }); 
   };
};



export function getQuestion(id) {
  const instance = axiosApi.axiosInstance();  
  let apiUrl = api.getQuestionApi(id);
  return dispatch => {
      dispatch(action.getQuestionPending(id))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getQuestionSuccess(response.data)))
      .catch(error => {
           console.log(error)
           dispatch(action.getQuestionError(id, error));
       })
   }
};



export function getPost(id) {
  const instance = axiosApi.axiosInstance();  
  let apiUrl = api.getPostApi(id);
  return dispatch => {
      dispatch(action.getPostPending(id))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getPostSuccess(response.data)))
      .catch(error => dispatch(action.getPostError(id, error))) 
   }
};




export function getUserProfile(id) {
    const instance = axiosApi.axiosInstance();  
    let apiUrl    =   api.getProfileApi(id);

    return dispatch => {

        dispatch(action.getUserProfilePending(id))
	    instance.get(apiUrl)
        .then(response => {
        	console.log(response.data)
            dispatch(action.getUserProfileSuccess(response.data));
        })
        .catch(error => {
      	
      	    if (error.response) {
      		    console.log(error.response.data)
      	        dispatch(action.getUserProfileError(id, error.response.data));
            }else{
         	    console.log(error)
         	    dispatch(action.handleError(error.request));
            }
        });
    }
};


export function getCommentList(byId) {
    return dispatch => {
        dispatch(action.getCommentListPending(byId))
	}
};



export function getReplyList(props) {
   return dispatch => {
      dispatch(action.getReplyListPending(props.actionType, props.byId ))
   }
};



export function getReplyChildrenList(props) {
    let {actionType, byId, apiUrl, children } = props;
    const instance = axiosApi.axiosInstance();

    console.log(props)

    if (children && children.length) {
        return dispatch => {
            dispatch(action.getReplyChildListPending(actionType, byId));
            dispatch(action.getReplyChildListSuccess(actionType, byId, children));
        }
        
    }

    return dispatch => {
       dispatch(action.getReplyChildListPending(actionType, byId))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getReplyChildListSuccess(actionType, byId, response.data)))
      .catch(error => dispatch(action.getReplyChildListError(actionType, byId, error))) 
   }
};


export function getCurrentUser(tokenKey) {
	let instance = axiosApi.axiosInstance();
    console.log(tokenKey)
	
	return dispatch => {
	  	dispatch(action.getCurrentUserPending());

		instance.get(`/api/current/user/`)
      .then(response => {
      	console.log(response)
      	dispatch(action.getCurrentUserSuccess(response.data)) })
      .catch(error =>{
      	if (error.response && error.response.data) {
      		dispatch(action.getCurrentUserError(error.response.data))
      	}else{
      		dispatch(action.handleError(error.request))
      	}
      });
	}
}




export function handleSubmit(props) {
   console.log(props)
   let { actionType, byId, objName, formData, apiUrl } = props;
   
   byId = byId?byId:"newObject"; 
   const instance = axiosApi.axiosInstance();
      
   if (props.isPut) {
   	return dispatch => {
     	dispatch(action.updateActionPending(actionType,byId))

		instance.put(apiUrl, formData)
		.then(response => {
			var payLoad = prepPayLoad(objName, response.data);
			console.log(payLoad, props) 
			dispatch(action.updateActionSuccess(actionType, byId, payLoad));
			dispatch(action.hideModal())
		})
		.catch(error => {
			console.log(error)
			dispatch(action.hideModal())
			if (error.response && error.response.data) {
			   dispatch(action.updateActionError(actionType, byId, error.response.data));
			}else{
      		dispatch(action.handleError(error.request))
      	}
	   })

	}
   }else if (props.isPost) {
        return dispatch => {
     	    dispatch(action.createActionPending(byId, props.actionType ))

		    instance.post(props.apiUrl, props.formData)
		    .then(response => {
			
			    dispatch(action.createActionSuccess(byId, props.actionType, response.data));
                dispatch(action.hideModal());
		    })
		    .catch(error => {
				
			    if (error.response && error.response.data) {
				    dispatch(action.createActionError(byId ,props.actionType, error.response.data));
      		
         	    }else{
      	        	dispatch(action.handleError(error.request))
      	        }

			    dispatch(action.hideModal())
	        })
   	}

   }else{

      return dispatch =>{
 		   dispatch(action.handleError())
 	   }
 	}
};


export function authenticate(apiUrl='', values={}, dispatch=function(){}){

    const axiosApi = new Axios(false);
    const instance = axiosApi.axiosInstance();
     
    
    return  instance.post(apiUrl, values)
            .then(response => {

               console.log(response)
               dispatch(action.authenticationSuccess(response.data));
            }
        )
        .catch(error =>{
            let { response, request } = error
                
            if ( response && response.data) {
                console.log(response.data)
                console.log(typeof response.data )
                dispatch(action.authenticationError(response.data));
            }
            else if (request) {
                console.log(request)
                dispatch(action.handleError(request))
            }
        });
   
}; 


const prepPayLoad = (objName, data)=>{
	
	if(objName === "question"){
	   data = { questionObj : data };
	}
	else if(objName === "answer"){
      data = { answer : data };
	}
	else if(objName === "comment"){
		data = { comment : data };
	}
	else if(objName === "reply"){
		data = { reply : data };
	}
	else if(objName === "post"){
		data = { postObj : data };
	}

	else if(objName === "userProfile"){
		data = {user : data};
	}

	else if(objName === "usersList"){
		data = {user : data};
	}


   return data;
};  





