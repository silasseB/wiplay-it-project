
 
import Api from '../api';
import Axios from '../axios_instance';
import  * as action  from '../actions/actionCreators';


const axiosApi = new Axios(true);  
const api = new Api();



export function getIndex(options) {
    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();  
    let apiUrl     = api.getIndexApi(); 

    

    return dispatch => {
       dispatch(action.getIndexPending());
       instance.get(apiUrl)
       .then(response => {
            console.log(response)  
            dispatch(action.getIndexSuccess(response.data)); 

           
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
    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();
  
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
    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();
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

    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();
     
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

    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();
      
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
     const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();
    let apiUrl = api.getPostApi(id);

    return dispatch => {
      dispatch(action.getPostPending(id))
	   instance.get(apiUrl)
      .then(response => dispatch(action.getPostSuccess(response.data)))
      .catch(error => dispatch(action.getPostError(id, error))) 
   }
};




export function getUserProfile(id, apiUrl) {
    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance();

    if (!apiUrl) {
        apiUrl    =   api.getProfileApi(id);
    }

    console.log(apiUrl, id)

    return dispatch => {

        dispatch(action.getUserProfilePending(id))
	    instance.get(apiUrl)
        .then(response => {
        	console.log(response.data.profile)
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
    const axiosInstance = new Axios(true);
    const instance = axiosInstance.axiosInstance(); 
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
    const axiosInstance = new Axios(true);
    const instance      = axiosInstance.axiosInstance();
    let { actionType, byId, objName, formData, apiUrl } = props;


   
    byId = byId?byId:"newObject"; 
    let updateProps = {
        actionType,
        byId,
        isUpdating:true,
        }
    let createProps = {
        actionType,
        byId,
        isCreating: true, 
    } 
         
    if (props.isPut) {
   	return dispatch => {

     	dispatch(action.updateActionPending(updateProps))

		instance.put(apiUrl, formData)
		.then(response => {
		 
            updateProps['data'] = prepPayLoad(objName, response.data);
			dispatch(action.updateActionSuccess(updateProps));
			
		})
		.catch(error => {
			console.log(error)
			dispatch(action.hideModal())

			if (error.response && error.response.data) {
               createProps['error'] = error.response.data;
			   dispatch(action.updateActionError(updateProps));
			}else{
      		dispatch(action.handleError(error.request))
      	}
	   })

	}
   }else if (props.isPost) {
        return dispatch => {
     	    dispatch(action.createActionPending(createProps ))

		    instance.post(props.apiUrl, props.formData)
		    .then(response => {
			    createProps['data'] = response.data; 
			    dispatch(action.createActionSuccess(createProps));
                
		    })
		    .catch(error => {
                console.log(error)
				
			    if (error.response && error.response.data) {
                    createProps['error'] = error.response.data;
				    dispatch(action.createActionError(createProps));
      		
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
	
	if(objName === "Question"){
	   data = { question : data };
	}
	else if(objName === "Answer"){
      data = { answer : data };
	}
	else if(objName === "Comment"){
		data = { comment : data };
	}
	else if(objName === "Reply"){
		data = { reply : data };
	}
	else if(objName === "Post"){
		data = { postObj : data };
	}

	else if(objName === "UserProfile"){
		data = {user : data};
	}

	else if(objName === "UsersList"){
		data = {user : data};
	}


   return data;
};  





