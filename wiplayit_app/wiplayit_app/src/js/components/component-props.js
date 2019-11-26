import  * as types  from '../actions/types';
import Api from '../api';


export const GetModalLinkProps = {
	props(props){
		let linkProps = {...props};
		let {
			objName,
			obj,
			isPost,
			isPut,
			apiUrl,
			actionType,

        } = props;

		isPost  = isPost || false;
		isPut  =  isPut || false;

		linkProps['actionType'] = actionType || GetActionTypesProps(objName, isPut, isPost);
		linkProps['apiUrl']     = apiUrl || GetRestApiProps(objName, obj, isPut, isPost);
		linkProps['editorPlaceHolder'] = `Create ${objName}...`;

		return linkProps;
    },

}


export const GetActionTypesProps = (actionName, isPut=false, isPost=false) => {
    let actionType; 
    
    switch(actionName){
        case 'UserProfile':
 	        actionType = isPut? types.UPDATE_USER_PROFILE:null;
 	 	    return actionType; 

 	 	case 'UsersList':
 	        actionType = isPut? types.UPDATE_USER_LIST:null;
 	 	    return actionType;   

    	case 'Question':
 	        actionType = isPut? types.UPDATE_QUESTION: types.CREATE_QUESTION;
 	        return actionType;

 	    case 'Post':
 	        actionType = isPut? types.UPDATE_POST: types.CREATE_POST;
 	 	    return actionType;

 	    case 'Answer':
 	        actionType = isPut? types.UPDATE_ANSWER: types.CREATE_ANSWER;
 	 	    return actionType;

        case 'Comment':
 	        actionType = isPut? types.UPDATE_COMMENT: types.CREATE_COMMENT;
 	 	    return actionType;

        case 'Reply':
 	        actionType = isPut? types.UPDATE_REPLY: types.CREATE_REPLY;
 	 	    return actionType;


 	    default:
            return actionType;
    };
};



export const GetRestApiProps = (actionName, obj=null, isPut=false, isPost=false)=>{
    const api      = new Api();
    let id = obj && obj.id;

	let apiUrl;
	switch(actionName){
		case 'UserProfile':
		case 'UsersList':       
		    apiUrl    = api.updateProfileApi(id);
			return apiUrl
    	case 'Question':
 	        apiUrl = isPut? api.updateQuestionApi(id): api.createQuestionApi();
 	        return apiUrl;

 	    case 'Answer':
 	        apiUrl = isPut? api.updateAnswerApi(id): api.createAnswerApi(id);
 	        return apiUrl;

 	    case 'Post':
 	        apiUrl = isPut? api.updatePostApi(id): api.createPostApi(id);
 	        return apiUrl;


 	    case 'Comment':
 	       
 	        if (isPut) {

               apiUrl = obj.post || obj.add_post? 
                            api.updatePostCommentApi(id)
                            :
                            api.updateAnswerCommentApi(id);

 	        }else {
 	        	apiUrl = obj.post || obj.add_post?
 	        	            api.createPostCommentApi(id)
 	        	            :
 	        	            api.createAnswerCommentApi(id);
 	        }

 	        return apiUrl;


 	    case 'Reply':
 	        apiUrl = isPost && obj.post && api.createPostReplyApi(id);
 	        apiUrl = !apiUrl && isPost? api.createAnswerReplyApi(id):apiUrl;
 	         	        
 	        return apiUrl;


 	    

 	    default:
 	    	return apiUrl;
 	}

};


