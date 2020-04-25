
 
import Api from 'utils/api';
import Axios from 'utils/axios_instance';
import  * as action  from 'actions/actionCreators';
import * as checkType from 'helpers/check-types'; 


const api = new Api();

export const _GetApi =(useToken=true) =>{
    const axios     = new Axios({useToken});
    return axios.instance()

} 


export function getIndex(options) {
    let useToken=true
    const Api  = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl = api.getIndexApi(); 
    
    return dispatch => {
        dispatch(action.getIndexPending());

        Api.get(apiUrl)
            .then(response => {
                console.log(response)  
                dispatch(action.getIndexSuccess(response.data)); 
    
            })
            .catch(error => {
                
                if (error.response) {
                    console.log(error.response)
                    dispatch(action.getIndexError(error.response.data ));

                }else{
                    console.log(error.request)
                    dispatch(action.handleError(error.request));
                }
           }); 
        
    };
};




export function getUserList(props) {
    let useToken=true
    const Api  = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let { apiUrl, usersById } = props;
    apiUrl = !apiUrl && api.getUserListApi() || apiUrl; 

    return dispatch => {

        dispatch(action.getUserListPending(usersById))

	    Api.get(apiUrl)
        .then(response => dispatch(action.getUserListSuccess(usersById, response.data)))
        .catch(error => {

      	    if (error.response) {
      	        dispatch(action.getUserListError(usersById, error.response.data));
            }else{
         	   dispatch(action.handleError(error.request));
            }
        }); 
    };
};



export function getQuestionList(questionListById) {
    let useToken=true
    const Api  = _GetApi(useToken);  
    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = api.getQuestionListApi(); 

    return dispatch => {
      dispatch(action.getQuestionListPending(questionListById))
	   Api.get(apiUrl)
      .then(response => dispatch(action.getQuestionListSuccess(questionListById, response.data)))
      .catch(error => {
      	if (error.response) {
      		dispatch(action.getQuestionListError(questionListById, error.response.data));

         }else{
         	dispatch(action.handleError(error.request));
         }
      }); 
   };
};




export function getPostList(postListById) {

    let useToken=true
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let   apiUrl  = api.getPostListApi();

    return dispatch => {
      dispatch(action.getPostListPending(postListById))
	   Api.get(apiUrl)
       .then(response => dispatch(action.getPostListSuccess(postListById, response.data)))
       .catch(error => {
      	    if (error.response) {
      	        dispatch(action.getPostListError(postListById, error.response.data));

            }else{
         	  dispatch(action.handleError(error.request));
         }
      }); 
   };
};



export function getQuestion(id) {
    let useToken=true
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    } 
      
    let apiUrl = api.getQuestionApi(id);
    let questionById = `question${id}`;

    return dispatch => {
        dispatch(action.getQuestionPending(questionById))
	    Api.get(apiUrl)
            .then(response =>{
                dispatch(action.getQuestionSuccess( questionById, response.data))

            })
            .catch(error => {
                console.log(error)
                dispatch(action.getQuestionError( questionById, error));
            })
    }
};



export function getPost(id) {
    let useToken=true
    const Api  = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    let apiUrl     = id && api.getPostApi(id);
    let postById   = id && `post${id}`

    return dispatch => {
        dispatch(action.getPostPending(postById))

	    Api.get(apiUrl)
       .then(response =>{
        console.log(response)
            dispatch(action.getPostSuccess(postById, response.data));
        })
       .catch(error => {
            dispatch(action.getPostError(postById ,error));
       }) 
   };
};




export function getUserProfile(id, apiUrl) {
    let useToken=true
    const Api  = _GetApi(useToken);

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    apiUrl    = !apiUrl && api.getProfileApi(id) || apiUrl;
    
    let profileById = `userProfile${id}`;
    

    return dispatch => {

        dispatch(action.getUserProfilePending(profileById))
	    Api.get(apiUrl)
        .then(response => {
        	//console.log(response.data.profile)
            dispatch(action.getUserProfileSuccess( profileById ,response.data));
        })
        .catch(error => {
            console.log(error)
      	
      	    if (error.response) {
      		    dispatch(action.getUserProfileError( profileById, error.response.data));

            }else{
         	    
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
    //const instance = axiosApi.axiosInstance();

    //console.log(props)

    if (children && children.length) {
        return dispatch => {
            dispatch(action.getReplyChildListPending(actionType, byId));
            dispatch(action.getReplyChildListSuccess(actionType, byId, children));
        }
        
    }
    let useToken = true
    const Api    = _GetApi(useToken);  

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }

    return dispatch => {
       dispatch(action.getReplyChildListPending(actionType, byId))
	   Api.get(apiUrl)
      .then(response => dispatch(action.getReplyChildListSuccess(actionType, byId, response.data)))
      .catch(error => dispatch(action.getReplyChildListError(actionType, byId, error))) 
   }
};


export function getCurrentUser(tokenKey) {
    let useToken=true
    const Api  = _GetApi(useToken); 

    if(!Api){
        return  dispatch =>{ 
            dispatch(action.handleError());
        };
    }   

    return dispatch => {
	    dispatch(action.getCurrentUserPending());

		Api.get(`/api/current/user/`)
            .then(response => {
      	        console.log(response)
      	        dispatch(action.getCurrentUserSuccess(response.data)) 
            })
            .catch(error =>{
                //console.log(error)
      	        if (error.response && error.response.data) {
                    console.log(error.response)
      		        dispatch(action.getCurrentUserError(error.response.data));

      	        }else{
                    console.log(error.request)
      		        dispatch(action.handleError(error.request))
      	        }
            });
    };
	
};




export function handleSubmit(props) {
    console.log(props)
    let useToken=true
    const Api  = _GetApi(useToken); 
    if (!Api) {
        return dispatch =>{ dispatch(action.handleError()) };
    }

    let { currentUser } = props;
    if (currentUser && !currentUser.is_confirmed) {
        let error = 'Sorry, you must confirm your account to post or edit ';
        
        return dispatch => {
            dispatch(action.handleError(error));
        }
         
    }
     
    let { 
        actionType, 
        byId,
        objName,  
        formData,
        apiUrl,
        IsModal,
        modalName } = props;


   
    byId = byId?byId:"newObject"; 
    IsModal = IsModal || false;

    let updateProps = {
            actionType,
            byId,
            objName,
            modalName,
            isUpdating:true,
        };

    let createProps = {
            actionType,
            byId,
            objName,
            modalName,
            isCreating: true, 
        }; 
         
    if (props.isPut) {
   	    return dispatch => {
            dispatch(action.updateActionPending(updateProps))

		    Api.put(apiUrl, formData)
		    .then(response => {
		        console.log(response)
                updateProps['data'] = prepPayLoad(objName, response.data);
                IsModal && dispatch(action.ModalSubmitSuccess(updateProps))
			    dispatch(action.updateActionSuccess(updateProps));
			
		    })
		    .catch(error => {
			    console.log(error)
			
			    if (error.response && error.response.data) {
                   createProps['error'] = error.response.data;
                   IsModal && dispatch(action.ModalSubmitError(updateProps))
			       dispatch(action.updateActionError(updateProps));
			    }else {
      		       dispatch(action.handleError(error.request))
      	        }
	        })
        }

	}else if (props.isPost) {
        return dispatch => {
     	    dispatch(action.createActionPending(createProps ))

		    Api.post(props.apiUrl, props.formData)
		    .then(response => {
			    createProps['data'] = prepPayLoad(objName, response.data); 
                IsModal && dispatch(action.ModalSubmitSuccess(createProps))
			    dispatch(action.createActionSuccess(createProps));
                
		    })
		    .catch(error => {
                console.log(error)
				
			    if (error.response && error.response.data) {
                    createProps['error'] = error.response.data;
                    IsModal && dispatch(action.ModalSubmitError(createProps))
				    dispatch(action.createActionError(createProps));
      		
         	    }else{
      	        	dispatch(action.handleError(error.request))
      	        }

			   
	        })
   	    }

    }else{

        return dispatch =>{
 		   dispatch(action.handleError())
 	    }
 	}
};


export function authenticate(params={}){
    let useTokenIsBolean = checkType.isBoolean(useToken)
    useToken  = useTokenIsBolean &&  useToken || false;

    const Api = _GetApi(useToken);   
    if (!Api) {
        console.log(Api)
        return dispatch =>{ dispatch(action.handleError()) };
    }

    let {apiUrl, form, useToken} = params;
    
    console.log(params)    
    
    return dispatch => {
        dispatch(action.authenticationPending());

        Api.post(apiUrl, form)
            .then(response => {
                console.log(response)

                let { data }  = response
                let auth      = {};
                let response_data = {};
                let user      = data.user;

                let isLoggedIn = data.key && true || data.token && true || false;
                let tokenKey   = data.token || data.key  || null;

                let successMessage = data.detail || null;

                if (isLoggedIn) {
                   auth = {isLoggedIn, tokenKey}
                   response_data = {auth}

                }else if(successMessage){
                    response_data = {successMessage}
                }  
               
                dispatch(action.authenticationSuccess(response_data));

                if (user) {
                    dispatch(action.getCurrentUserSuccess(user))
                }
            }
        )
        .catch(error =>{
            let { response, request } = error
                
            if ( error.response) {
                console.log(response.data)
                console.log(typeof response.data )
                dispatch(action.authenticationError(error.response.data));
            }
            else if (error.request)  {
                console.log(error.request)
                dispatch(action.authenticationError(error.request));

            }else{
                console.log(error)
                dispatch(action.handleError());
            }
        });
    }
   
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
		data = { post : data };
	}

	else if(objName === "UserProfile"){
		data = {user : data};
	}

	else if(objName === "UsersList"){
		data = {user : data};
	}


   return data;
};  





