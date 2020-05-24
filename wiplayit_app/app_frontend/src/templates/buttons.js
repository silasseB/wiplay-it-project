import React from 'react';
import { Link, useLocation, Router } from "react-router-dom";
import {history} from "App" 
import { MatchMediaHOC } from 'react-match-media';
import { ModalManager, Modal }   from  "components/modal/modal-container";
import { store } from "store/index";
import {showModal, handleError} from 'actions/actionCreators';


 let unfollowedBtnStyles = {
        backgroundColor : '#E3EBF2', 
        color           : '#288FF0',
        border          : '1px solid #B7D5F0'
    };

    let  followedBtnStyles = {
        backgroundColor : '#EFEEEE', 
        color           : '#999999',
        border          : '1px solid #CFCFCF'
    };





export const FollowUserBtn = props => {
    //console.log(props)
    
    let {currentUser, editUserProfileProps,editfollowersOrUpVoters } = props;
    let { obj } = editUserProfileProps && editUserProfileProps;
    
    let btnText        =  obj && obj.user_is_following && "Following" || "Follow";
    var followers_text =  obj && obj.profile && obj.profile.followers > 1? 'Followers' : 'Follower';  
    let styles         =  obj && obj.user_is_following && followedBtnStyles || unfollowedBtnStyles;
    
    currentUser = currentUser && currentUser || {};
    
    return(
        <div className="follow-btn-box">
            { obj && obj.email !== currentUser.email?
                <button style={styles} type="button" 
                        className="btn-sm follow-user-btn"
                        onClick={ () => editfollowersOrUpVoters(editUserProfileProps) }  
                    >
                    {btnText} {obj && obj.profile &&  obj.profile.followers }             
                </button>
                :
                <button style={unfollowedBtnStyles} type="button" className="btn-sm num-followers-btn">
                    {obj && obj.profile &&  obj.profile.followers } {followers_text}
                </button>
            }
        </div>
    );
};

export const UnfollowUserBtn = props => {
    
    return(
        <button   type="button" onClick={ () => props.editfollowersOrUpVoters(props.editUserProfileProps) }
               className="unfollow-user">
            Follow 
      </button>
    
  )
}                           


export const FollowQuestionBtn = props => {
    //console.log(props.editQuestionProps)
    return(
        <button  type="button" onClick={ () => props.editfollowersOrUpVoters(props.editQuestionProps)}
            className="btn-sm follow-question-btn" >

            Follow <span className="fa fa-rss icon-color"></span>            
        </button>
    )
}


export const UnfollowQuestionBtn = props => {
    //console.log(props.editQuestionProps)
    return(
        <button  type="button" onClick={() =>  props.editfollowersOrUpVoters(props.editQuestionProps)}
                               className="btn-sm  follow-question-btn" >
               Following <span className="fa fa-rss"></span>
         </button>
      )
};


           
export const UpVotePostBtn = props => (     
<div>    
   <button  type="button" onClick={ () =>  props.editfollowersOrUpVoters(props.editPostProps)}
                                          className="btn-sm  upvote-answer" >
     Upvote <span className="fa fa-arrow-up"></span>
  </button>
</div>

 )




         
export const DownVotePostBtn = props => (  
      
    <button   type="button" onClick={ () =>  props.editfollowersOrUpVoters(props.editPostProps)}
                                         className="btn-sm icon-color upvote-answer" >
    Upvoted <span className=" fa fa-arrow-up upvote-icon"></span>
  </button>
);


            
export const UpVoteAnswerBtn = props => (     
      
        <button  type="button" onClick={ () => props.editfollowersOrUpVoters(props.editAnswerProps)}
                                          className="btn-sm  upvote-answer" >
            Upvote <span className="fa fa-arrow-up"></span>
        </button>
   
);




         
export const DownVoteAnswerBtn = props => (  
<div>       
    <button   type="button" onClick={ () => props.editfollowersOrUpVoters(props.editAnswerProps)}
                                         className="btn-sm icon-color upvote-answer" >
    Upvoted <span className=" fa fa-arrow-up upvote-icon"></span>
  </button>
  </div>
 )





             
export const UpVoteCommentBtn = props => (     
   <div>    
      <button  type="button" onClick={ () => props.editfollowersOrUpVoters(props.editCommentProps)}
               className="btn-sm upvote-comment-btn" >
         Upvote 
      </button>
   </div>

)


export const DownVoteCommentBtn = props => (     
   <div>    
      <button  type="button" onClick={ () => props.editfollowersOrUpVoters(props.editCommentProps)} 
                      className="btn-sm upvote-comment-btn" >
         Upvoted 
      </button>
   </div>

)


export const UpVoteReplyBtn = props => (     
<div>    
   <button  type="button" onClick={ () =>  props.editfollowersOrUpVoters(props.editReplyProps)}
                   className="btn-sm upvote-reply-btn" >
     Upvote 
  </button>
</div>

 )


export const DownVoteReplytBtn = props => (     
<div>    
   <button  type="button" onClick={ () => props.editfollowersOrUpVoters(props.editReplyProps)} 
                      className="btn-sm  icon-color upvote-comment" >
     Upvoted 
  </button>
</div>

 )




export const PostOptModalBtns = props => {
   //console.log(props)
   let {background} = props
    let modalPath = `/compose/${'post'}/${props.obj.id }/`
    let modalProps = getModalProps(props);
    let state = { background, modalProps} 
   return (
      <div>
         { props.obj.created_by.id === props.currentUser.id?  
         <div>
            <button className="btn-sm edit-question" onClick={()=>{
                        ModalManager.close(props.background) 
                        
                        setTimeout(()=> {
                           history.push({ pathname: modalPath, state} ); 
                        }, 1000);

                    }}>
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
        <button className="btn-sm edit-post" onClick={()=>{
                        ModalManager.close(props.background) 
                        setTimeout(()=> {
                           history.push(`/compose/${'post'}/${props.obj.id}/`); 
                        }, 1000);
                        }}>
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
  <button className="btn-sm edit-question" onClick={()=>{
                        ModalManager.close(props.background) 
                        setTimeout(()=> {
                           history.push(`/compose/${'question'}/${props.obj.id}/`); 
                        }, 3000);
                        }}>
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

const getModalProps = (props)=>{
    return {
            editorProps : {...props},
            modalName   : 'editor', 
        };

}

export const QuestionOptModalBtns = props => {
    //console.log(props)
    let {background} = props
    let modalPath = `/compose/${'question'}/${props.obj.id }/`
    let modalProps = getModalProps(props);
    let state = { background, modalPath, modalProps};


    return (
        <div>
           { props.obj.created_by.id === props.currentUser.id? 
           <div>
            <OpenEditorBtn {...props}/>
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
    let {currentUser, obj} = props
   
    return(
      <div>
         { obj.created_by.id === currentUser.id?
            <div>
               <OpenEditorBtn {...props}/>
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
    //console.log(props);
    let {background} = props
    let modalPath = `/compose/${'comment'}/${props.obj.id }/`
    let modalProps = getModalProps(props);
    let state = { background, modalPath, modalProps} 
   
    return(
        <div>
            { props.obj.created_by.id === props.currentUser.id?
                <div>
                    <OpenEditorBtn {...props}/>
                    <button type="button" className="btn-sm  delete-question" >
                       Delete 
                    </button>
               </div>

               :
               ""
            }
    
        </div>
    );
};



export const ReplyOptModalBtns = props => {
    let {background} = props
    let modalPath = `/compose/${'reply'}/${props.obj.id }/`
    let modalProps = getModalProps(props);
    let state = { background, modalPath, modalProps}; 

    return(
        <div>
            {props.obj.created_by.id === props.currentUser.id?
                <div>
                    <OpenEditorBtn {...props}/> 
                    <button type="button" className="btn-sm  delete-question" >
                        Delete 
                    </button>
                </div>

               :
               ""
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

    //console.log(props)

    return (
      <div>
          <button type="button" id="logout"  onClick={props.logout} className="btn-sm logout" >
            Logout
         </button>
      </div>
   )
}


export const EditUserButtons = props => {
  //console.log(props)
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


export const OptionsMenuBtns = props => {
  
    return(
        <div>
            { props.objName === 'UserProfile'?
                <ProfileOptsModalBtns {...props}/>
                :
         
                <div>
                    { props.objName === 'Question'?
                        <QuestionOptModalBtns {...props}/>
                        :
                        ""
                    }
       
                    { props.objName === 'Answer'?
                        <AnswerOptModalBtns {...props}/>
                        :
                        ""
                    }

                    {props.objName === 'Comment'?
                        <CommentOptModalBtns {...props}/>
                        :
                        ""
                    }

                    { props.objName === 'Reply'?
                        <ReplyOptModalBtns {...props}/>
                        :
                        ""
                    }

                    {props.objName === 'Post'?
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



export const ModalMenuHeader = props => (
 
   <div className="menu-header-box">
      <ul className="modal-menu-title" >
         <li className="header-text">Choose category</li>
      </ul>

      <ul className="modal-menu-dismiss-box">
         <ModalCloseBtn> 
            <span className="modal-dismiss-icon">&times;</span>
         </ModalCloseBtn>
      </ul>
        
    </div>
)


export const ModalOptionsMenu = props => {
    return (
        <div className="modal-menu  modal-body">
            <ModalMenuHeader {...props}/>
            <OptionsMenuBtns {...props}/>
        </div>
    );
};




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

);





export const ModalCloseBtn = props => {
    let styles = props.styles || {};

   return(
      <button type="button" 
              style={styles}
              onClick={()=>window.history.back()}
              className="nav-bar-back-btn btn-sm" >
         {props.children}
      </button>  
  );
}


export const SubmitBtn = props => {
  //console.log(props)
 return (
    <div className="submit-btn-box">
        <button type="button" onClick={props.handleSubmit} className="submit-btn ">
            Submit 
        </button>
    </div>
 )
}


export const OpenEditorBtn = props => {
        
    let {objName,
         isPut, 
         className,
         linkName} = props;
    let context   = objName && objName.toLowerCase();
    
    let getButtonName =()=> {
        let Edit = isPut && "Edit " || "";
        return `${Edit}${objName}`;
    };
    linkName   = linkName?linkName:getButtonName();
    
    return(
        <button className={className}  onClick={()=> OpenModalEditor(props)}>
            { linkName } 
        </button>
    );
};

const OpenModalEditor=(props)=>{
    let { currentUser} = props ;
    
    let storeUpdate  = store.getState();
    let { entities } = storeUpdate;
    let { modal }    = entities;
    let optionsModal = modal && modal['optionsMenu'];

    if (currentUser && !currentUser.is_confirmed) {
        let error = 'Sorry, you must confirm your account to start posting and editting ';
        store.dispatch(handleError(error));
        return;   
    }

    let modalProps = {
        ...props,
        modalName   : 'editor',
        isModal     :  true, 
    };

    if (optionsModal && optionsModal.modalIsOpen ) {

        window.history.back()
        return setTimeout(()=> {
            Modal(modalProps) ; 
        }, 500);
    }

    Modal(modalProps)
};

export const OptionsDropDownBtn = props => {
    return(
        <div>
            <button className="btn-sm options-btn" id="options-menu"
                  data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
                <i className="material-icons ">more_horiz</i>
            </button>
            <div className="dropdown-menu dropdown-menu-box" aria-labelledby="options-menu">
                <OptionsMenuBtns {...props}/>
            </div>
        </div>
    )
}



export const  OptionModal = props => {
    let  modalProps = {
            ...props,
            modalName : 'optionsMenu', 
        };

    return(
        <button className="btn-sm options-btn"    onClick={()=> {  Modal(modalProps) }}>
             <i className="material-icons ">more_horiz</i>  
        </button>
    )
}


export const OpenOptionlBtn  = props => {
             
    return(
        <div>
            <OptBtnSmallScreen {...props}/>
            <OptBtnBigScreen {...props}/>
        </div>
    );
  
};

const OptBtnSmallScreen = MatchMediaHOC(OptionModal, '(max-width: 980px)');
const OptBtnBigScreen = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');

export const ChangeImageBtn = props => {
    let {currentUser} = props && props;
    
    let modalProps = {
            ...props,
            modalName : 'dropImage', 
            isModal   : true, 
        }; 
    
    let linkName = props.linkName || `Edit`;

    return(
       
        <button 
            className="edit-img-btn btn" 
            onClick={()=> {
                if (!currentUser.is_confirmed) {
                    let error = 'Sorry, you must confirm your account to to change photo ';
                    store.dispatch(handleError(error));
                        return;   
                    }
                    Modal(modalProps)
                  }}>
            {linkName}  
        </button>
    );
};





export const OpenUsersModalBtn = props => {
    let {obj, linkName} = props
        
    let modalProps = {
            ...props,
            modalName : 'userList', 
        }; 
        
        
    return(
        <button className="btn-sm "    onClick={()=> {
                        Modal(modalProps)

                    }}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};



