import React from 'react';

import Api from '../api';
import  * as types  from '../actions/types';


const api      = new Api();


export const CreateQuestionBtn = props => {
   let  createQuestionProps = {
      modalProps :{
        objName           : 'question',
        actionType        : types.CREATE_QUESTION,
        isPost            : true,
        editorPlaceHolder : 'Add Question...',
        apiUrl            : api.createQuestionApi(),
         
      },
      modalType : 'editor', 
          
   };

  return(
      <button type="button" onClick={ () => props.showModal(createQuestionProps)} 
                id="create-question" className="btn btn-sm  create-question">
           Ask
      </button>
   );
};


export const CreatePostBtn = props =>{
   //console.log(props)
   let createPostProps = {
      modalProps :{
         objName           : 'post',
         isPost            : true,
         actionType        : types.CREATE_POST,
         editorPlaceHolder : 'Write Post...',
         apiUrl            : api.createPostApi(),
                
      },
      modalType : 'editor', 
   };
        
   return(
      <button type="button" onClick={ () => props.showModal(createPostProps)}
            className="btn btn-sm  create-post">
         Post
      </button>
   );
}

export const UnfollowUserBtn = props => {
   
   return(
      <div className="f-box">
         <button type="button" onClick={ () => props.unfollowOrDownVote(props.followBtnProps) }  
                 className="unfollow-user" >
            Following             
         </button>
      </div>
   );
};

export const FollowUserBtn = props => (
  <div className="f-box">
      <button   type="button" onClick={ () => props.followOrUpVote(props.followBtnProps) }
                className="follow-user" >
       Follow 
      </button>
  </div> 
)                           


export const FollowQuestionBtn = props => {
   
   return(
      <div>
         <button  type="button" onClick={ () => props.followOrUpVote(props.followBtnProps)}
            className="btn-sm follow-question" >

            Follow <span className="fa fa-rss icon-color"></span>            
         </button>
      </div>
  )
}


export const UnfollowQuestionBtn = props => {
   let btnProps = {unFollowing : true};
   Object.assign(btnProps, props)

   return(
      <div>
         <button  type="button" onClick={() =>  props.unfollowOrDownVote(props.followBtnProps)}
                               className="btn-sm  follow-question" >
               Following <span className="fa fa-rss"></span>
         </button>
      </div>
   )
};


           
export const UpVotePostBtn = props => (     
<div>    
   <button  type="button" onClick={ () =>  props.followOrUpVote(props.upvoteBtnProps)}
                                          className="btn-sm  upvote-answer" >
     Upvote <span className="fa fa-arrow-up"></span>
  </button>
</div>

 )




         
export const DownVotePostBtn = props => (  
<div>       
    <button   type="button" onClick={ () =>  props.unfollowOrDownVote(props.upvoteBtnProps)}
                                         className="btn-sm icon-color upvote-answer" >
    Upvoted <span className=" fa fa-arrow-up icon-color"></span>
  </button>
  </div>
 )


            
export const UpVoteAnswerBtn = props => (     
<div>    
   <button  type="button" onClick={ () => props.followOrUpVote(props.upvoteBtnProps)}
                                          className="btn-sm  upvote-answer" >
     Upvote <span className="fa fa-arrow-up"></span>
  </button>
</div>

 )




         
export const DownVoteAnswerBtn = props => (  
<div>       
    <button   type="button" onClick={ () => props.unfollowOrDownVote(props.upvoteBtnProps)}
                                         className="btn-sm icon-color upvote-answer" >
    Upvoted <span className=" fa fa-arrow-up icon-color"></span>
  </button>
  </div>
 )





export const AnswerBtn = props => {
   //console.log(props)
   

return  (  
      <div>      
        <button type="button" onClick={ () => props.showModal(props.createAnswerProps) }
          className="btn-sm  create-answer" >
            <span className="fa fa-edit icon-color"></span>  Answer
         </button>
      </div>
   );
};

export const EditAnswerBtn = props => {
   //console.log(props)
   return(  
      <div>      
         <button type="button" onClick={ () => props.showModal(props.editAnswerProps) }
            className="btn-sm  create-answer" >
          <span className="fa fa-edit icon-color"></span>  Edit Answer
      </button>
  </div>
 )
};

export const CommentBtn = props =>{
 // console.log(props)
return (  
  <div>      
    <button type="button" onClick={ () => props.showModal(props.createCommentProps) } 
                    className="btn-sm answer-btn create-comment" >
    Comment
    </button>
  </div>
 )
}

export const ReplyBtn = props =>{
  //console.log(props)
return ( 

  <div>      
    <button type="button" onClick={ () => props.showModal(props.createReplyProps) } 
                    className="btn-sm comment-btn create-reply" >
    Reply
    </button>
  </div>
 )
}

             
export const UpVoteCommentBtn = props => (     
   <div>    
      <button  type="button" onClick={ () => props.followOrUpVote(props.upvoteBtnProps)}
               className="btn-sm comment-btn upvote-comment-btn upvote-comment" >
         Upvote 
      </button>
   </div>

)


export const DownVoteCommentBtn = props => (     
   <div>    
      <button  type="button" onClick={ () => props.unfollowOrDownVote(props.upvoteBtnProps)} 
                      className="btn-sm  icon-color upvote-comment" >
         Upvoted 
      </button>
   </div>

)


export const UpVoteReplyBtn = props => (     
<div>    
   <button  type="button" onClick={ () =>  props.followOrUpVote(props.upvoteBtnProps)}
                   className="btn-sm comment-btn upvote-comment-btn upvote-comment" >
     Upvote 
  </button>
</div>

 )


export const DownVoteReplytBtn = props => (     
<div>    
   <button  type="button" onClick={ () => props.unfollowOrDownVote(props.upvoteBtnProps)} 
                      className="btn-sm  icon-color upvote-comment" >
     Upvoted 
  </button>
</div>

 )




export const PostOptModalBtns = props => {
   //console.log(props)
   return (
      <div>
         { props.obj.created_by.id === props.currentUser.id?  
         <div>
            <button onClick={ () => props.showModal(props)} className="btn-sm edit-question">
                Edit Post
            </button>

            <button type="button" className="btn-sm  delete-question" >
              Delete 
            </button>
         </div>
         :""
         }
         
     </div>
   )
}



export const PostOptDropDownBtns = props => (
   
  <div >  
   { props.obj.created_by.id === props.currentUser.id?  
    <div>
  <button onClick={ () => props.editPost(props)} className="btn-sm edit-post">
    Edit Post
  </button>
  
  <button type="button" className="btn-sm  delete-question" >
     Delete 
  </button>
  </div>
  :""
  }

  <button  type="button" className="btn-sm  bookmark" >
    Bookmark 
  </button>
  <button  type="button" className="btn-sm  bookmark">
     Share 
  </button> 
</div>

)




export const QuestionOptDropDownBtns = props => (
   
  <div >  
   { props.obj.created_by.id === props.currentUser.id?  
    <div>
  <button onClick={ () => props.editQuestion(props)} className="btn-sm edit-question">
    Edit Question
  </button>
  
  <button type="button" className="btn-sm  delete-question" >
     Delete 
  </button>
  </div>
  :""
  }

  <button  type="button" className="btn-sm  bookmark" >
    Bookmark 
  </button>
  <button  type="button" className="btn-sm  bookmark">
     Share 
  </button> 
</div>

)

export const QuestionOptModalBtns = props => {
   let  updateQuestionProps = {
      modalProps :{
        objName           : 'question',
        objIndex          : props.index,
        objId             : props.obj.id,
        obj               : props.obj,
        isPut             : true,
        editorPlaceHolder : 'Add Question...',
        actionType        : types.UPDATE_QUESTION,
         
      },
      modalType : 'editor', 
          
   };

   return (
      <div>
         { props.obj.created_by.id === props.currentUser.id? 
         <div>
            <button onClick={ () => props.showModal(updateQuestionProps)} className="btn-sm edit-question">
                Edit Question
            </button>

            <button type="button" className="btn-sm  delete-question" >
              Delete 
            </button>
         </div>
        : 
        ""
      }
      </div>
   )
}



export const AnswerOptModalBtns = props => {
   
   return(
      <div>
         { props.obj.created_by.id === props.currentUser.id?
            <div>
               <button onClick={ () => props.showModal(props.editAnswerProps)}
                     className="btn-sm edit-question">
                  Edit Answer
               </button>
               <button type="button" className="btn-sm  delete-question" >
                  Delete 
               </button>
            </div>
            : ""
         }
      </div>
   );
};




export const CommentOptModalBtns = props => {
   var apiUrl = props.isAnswerBox?api.updateAnswerCommentApi(props.obj.id):
                                  api.updatePostCommentApi(props.obj.id);
   var  editCommentProps = {
            modalProps :{
              objName           : 'comment',
              objIndex          : props.index,
              objId             : props.obj.id,
              obj               : props.obj,
              isPut             : true,
              actionType        : types.UPDATE_COMMENT,
              editorPlaceHolder : 'Add Comment...',
              apiUrl            : apiUrl,
            },
            modalType : 'editor', 
         };
   return(
      <div>
         {props.obj.created_by.id === props.currentUser.id?
            <div>
               <button onClick={ () => props.showModal(editCommentProps)} className="btn-sm">
                  Edit Comment
               </button>
               <button type="button" className="btn-sm  delete-question" >
                  Delete 
               </button>
            </div>
            :""
         }
    
      </div>
   );
};



export const ReplyOptModalBtns = props => {
  // console.log(props)
  
   var   editReplyProps = {
            modalProps :{
              objName           : 'reply',
              objIndex          : props.index,
              objId             : props.objId,
              obj               : props.obj,
              isPut             : true,
              actionType        : props.actionType,
              editorPlaceHolder : 'Add Reply...',
              apiUrl            : props.apiUrl,
            },
            modalType : 'editor', 
   };

   return(
      <div>
         {props.obj.created_by.id === props.currentUser.id?
            <div>
               <button onClick={ () => props.showModal(editReplyProps)} className="btn-sm">
                  Edit Reply
               </button>
 
               <button type="button" className="btn-sm  delete-question" >
                  Delete 
               </button>
            </div>
            : ""
         }
      </div>
   );
};


export  const EditProfileButtons = props => (
<div>
  <button type="button" className="btn-sm edit-user-credentials" >
    Credentials
  </button> 
  <button  type="button" className="btn-sm edit-user-location">
    Location 
  </button>
  </div>
)
export const ProfileOptsModalBtns = props => {
   
   const pathToEditProfile = `/edit/profile/${props.obj.slug}/${props.obj.id}/`;
   let  state = {
            userProfile : props.obj, 
            byId        : props.byId,
        }

   console.log(props)

   return (
      <div>
         { props.currentUser.id === props.obj.id?      
            <button type="button" 
                onClick={()=>props.redirectToEdit({pathToEditProfile,state})} 
                                     className="btn-sm edit-user-profile">
               Edit Profile
            </button>
            :
            ""
         }
              
         <button type="button" id="logout"  onClick={props.logout} className="btn-sm logout" >
            Logout
         </button>
      </div>
   )
}


export const EditUserButtons = props => {
  console.log(props)
  const pathToEditProfile = `/edit/profile/${props.userProfile.slug}/`;
  let state = { userProfile : props.userProfile, currentUser : props.currentUser}
  

  return (
    <div>
      {props.currentUser.id === props.userProfile.id?      
      <button type="button" 
      onClick={()=>props.redirectToEdit({pathToEditProfile,state})} 
      className="btn-sm edit-user-profile">
           Edit Profile
      </button>
      :
      ""
      }
       
      <button  type="button" className="btn-sm  bookmark" data-url="">
         Bookmark 
      </button>
      <button  type="button" className="btn-sm  bookmark" >
         Share 
      </button> 
      <button type="button" id="logout"  onClick={props.logout} className="btn-sm logout" >
         Logout
      </button>
   
     
   </div>
  )
}

export const ModalOptionsMenu = props => {
   console.log(props)
   return(
      <div className="modal-menu  modal-body">
       <ModalCloseBtn {...props}/>
      { props.objName === 'userProfile'?
         <ProfileOptsModalBtns {...props}/>
         :
         
      <div>
      {props.objName === 'question'?
          <QuestionOptModalBtns {...props}/>
          :
          ""
       }
       
       {props.objName === 'answer'?
          <AnswerOptModalBtns {...props}/>
          :
          ""
       }

       {props.objName === 'comment'?
          <CommentOptModalBtns {...props}/>
          :
          ""
       }

       {props.objName === 'reply'?
          <ReplyOptModalBtns {...props}/>
          :
          ""
       }

       {props.objName === 'post'?
          <PostOptModalBtns {...props}/>
          :
          ""
       }

       {props.objName === 'postComment'?
          <PostOptModalBtns {...props}/>
          :
          ""
       }
      
         <button  type="button" className="btn-sm  bookmark" >
            Bookmark 
         </button>
         <button  type="button" className="btn-sm  bookmark">
            Share 
         </button>
         </div>
      }
 
   </div>  
   
   ); 
};



export const ModalCloseBtn = props => (
  <div className="menu-dismiss-box">
    <div className="menu-helper-text" >
        <p>Choose category</p>
     </div>
      <button  type="button" onClick={() => props.hideModal()} className="btn-sm menu-dismiss">
         <span className="dismiss">&times;</span>
    </button>
  </div>
)




export const OpenModalButton = props => {
  //console.log(props)
  return(
   <div >
      <button 
         style={props.btnStyles} 
         onClick={() => props.showModal(props.modalOptionsProps)} 
         className=" options-btn" 
         type="button"
      >
      {props.btnText}
      </button>
   </div>
  )
}

export const EditUserDropDownbutton = props => (
  <div>
    <button className="btn-sm profile-opt-btn options-btn" id="userMenuButton"
              data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
            <i className="material-icons ">more_horiz</i>
    </button>
  </div>
    
)

export const QuestionOptDropDownBtn = props => (
  <div>
    <button className="btn-sm answer-option options-btn " id="questionMenuButton"
      data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
      <i className="material-icons ">more_horiz</i>
    </button>
  </div>
    
)


export const EditProfileDropDownButton = props => (
  <div>
    <button className="btn-sm profile-opt-btn options-btn " id="profileMenuButton"
           data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
        <i className="material-icons ">more_horiz</i>
    </button>
  </div>

)







export const SubmitBtn = props => {
  //console.log(props)
 return (
    <div className="submit-btn-box">
      <button type="button" onClick={props.handleSubmit} className="submit-btn ">Submit </button>
    </div>
 )
}


