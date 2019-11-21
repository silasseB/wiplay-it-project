import  * as types  from '../actions/types';
import Api from '../api';


export const GetModalLinkProps = {
	props(props){
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

		return {
            objName           : objName,
            actionType        : actionType || GetActionTypesProps(objName, isPut, isPost),
            apiUrl            : apiUrl || GetRestApiProps(objName, obj, isPut, isPost),
            obj               : obj,
            isPost            : isPost,
            isPut             : isPut,
            editorPlaceHolder : `Create ${objName}...`,
            
         
        }
    },

}


export const GetActionTypesProps = (actionName, isPut=false, isPost=false) => {
    let actionType; 
    
    switch(actionName){
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
    console.log(obj)

	let apiUrl;
	switch(actionName){
    	case 'Question':
 	        apiUrl = isPut? api.updateQuestionApi(id): api.createQuestionApi();
 	        return apiUrl;

 	    case 'Answer':
 	        apiUrl = isPut? api.updateAnswerApi(id): api.createAnswerApi(id);
 	        return apiUrl;

 	    case 'Post':
 	        apiUrl = isPut? api.updatePostApi(id): api.createPostCommentApi(id);
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
 	        if (isPost) {
	           	apiUrl = obj.post? api.createPostReplyApi(id)
 	        	            :
 	        	            api.createAnswerReplyApi(id);
 	        }
 	        return apiUrl;


 	    

 	    default:
 	    	return apiUrl;
 	}

};


