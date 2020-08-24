import React from 'react';
import { Link, useLocation, Router } from "react-router-dom";
import * as Icon from 'react-feather';
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
       
    let {currentUser,
         editUserProfileProps,
         editfollowersOrUpVoters } = props;

    let obj = editUserProfileProps?.obj;
    
    let btnText        =  obj?.user_is_following && "Following" || "Follow";
    var followers_text =  obj?.profile.followers > 1 && 'Followers' || 'Follower';  
    let styles         =  obj?.user_is_following && followedBtnStyles || unfollowedBtnStyles;
        
    
    return(
        <div className="follow-btn-box">
            {obj?.email !== currentUser?.email &&
                <button 
                    style={styles} type="button" 
                    className="btn-sm follow-user-btn"
                    onClick={() => editfollowersOrUpVoters(editUserProfileProps)}>  
                    
                    {btnText} {obj?.profile.followers }             
                </button>

                ||

                <button style={unfollowedBtnStyles} 
                        type="button" 
                        className="btn-sm num-followers-btn">
                    {obj?.profile.followers } {followers_text}
                </button>
            }
        </div>
    );
};

export const UnfollowUserBtn = props => {
    
    return(
        <button type="button"
                onClick={() => props.editfollowersOrUpVoters(props.editUserProfileProps)}
               className="unfollow-user">
            Follow 
      </button>
    
  )
}                           


export const FollowQuestionBtn = props => {
    //console.log(props.editQuestionProps)
    return(
        <button 
            type="button" 
            onClick={ () => props.editfollowersOrUpVoters(props.editQuestionProps)}
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
    <button type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editAnswerProps)}
            className="btn-sm icon-color upvote-answer" >
        Upvoted <span className=" fa fa-arrow-up upvote-icon"></span>
    </button>
  </div>
 )


             
export const UpVoteCommentBtn = props => (     
    <div>    
        <button  type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editCommentProps)}
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
        <button  
            type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editReplyProps)} 
            className="btn-sm  icon-color upvote-comment" >
            Upvoted 
        </button>
    </div>
)


export const ProfileOptsModalBtns = props => {
   
    return (
        <button type="button" id="logout" 
                onClick={props.logout}
                className="btn-sm logout" >
            Logout
        </button>
    )
}


export const QuestionOptsModalBtns = props => {
   console.log(props)
    return (
        <button type="button"
                className="btn-sm" >
            <Icon.Rss className="options-menu-icon" size={20}/> 
            Follow Question
        </button>
    )
}

export const OptionsMenuBtns = props => {
   
    return(
        <div className="options-menu">
            <ExtraBtns {...props}/>
            <Author {...props}/>
        </div>
    )
}

export const Author = props =>{
    let {currentUser, obj} = props;

    if(obj?.created_by?.id != currentUser?.id) return null

    return(
        <div className="options-menu">
            <OpenEditorBtn {...props}>
                <Icon.Edit className="options-menu-icon" size={20}/> 
            </OpenEditorBtn>
            <button type="button" className="btn-sm  option-delete-btn" >
                <Icon.Trash2 
                    className="options-menu-icon"
                    id="options-menu-icon" size={20}
                />
                Delete 
            </button>
        </div>
    )

} 

export const ExtraBtns = (props) =>{
    let {objName} = props
    if (objName == 'Question') return <QuestionOptsModalBtns {...props}/>
    if (objName === 'UserProfile') return <ProfileOptsModalBtns/>   

    return(
        <div>
            <button  type="button" className="btn-sm  bookmark" >
                <Icon.Bookmark className="options-menu-icon" size={20}/>
                Add to Bookmark 
            </button>
            <button  type="button" className="btn-sm  bookmark">
                <Icon.Share2 className="options-menu-icon" size={20}/>
                Share 
            </button>
        </div>
    )
}


export const ModalOptionsMenu = props => {
    return (
        <div className="modal-menu">
            <OptionsMenuBtns {...props}/>

            <ul className="modal-menu-dismiss-box">
                <ModalCloseBtn> 
                    Cancel
                </ModalCloseBtn>
            </ul>
        </div>
    )
}


export const ModalCloseBtn = props => {
    let styles = props.styles || {};

    return(
        <button type="button" 
              style={styles}
              onClick={()=>window.history.back()}
              className="nav-bar-back-bt btn-sm" >
           {props.children}
        </button>  
    )
}


export const SubmitBtn = props => {
  //console.log(props)
    return (
        <div className="submit-btn-box">
            <button type="button" 
                    onClick={props.handleSubmit} 
                    className="submit-btn ">
                Submit 
            </button>
        </div>
    )
}


export const OpenEditorBtn = props => {
        
    let { objName,
          isPut, 
          className,
          linkName } = props;
    let context = objName && objName.toLowerCase();
    
    let getButtonName =()=> {
        let Edit = isPut && "Edit " || "";
        return `${Edit}${objName}`;
    };
    linkName   = linkName?linkName: getButtonName();
    
    return(
        <button className={className}
                onClick={()=> OpenModalEditor(props)}>
           {props.children} {linkName} 
        </button>
    );
};

const OpenModalEditor=(props)=>{
    let {isAuthenticated, currentUser} = props;

    if (!isAuthenticated) {
        return history.push('/user/registration/');
    }
    
    let storeUpdate = store.getState();
    let {entities}  = storeUpdate;
    let {modal}     = entities;
    let optionsModal = modal && modal['optionsMenu'];

    if (currentUser && !currentUser.is_confirmed) {
        let error = 'Sorry, you must confirm your account to start posting and editting ';
        return store.dispatch(handleError(error));
    }

    let modalProps = {
        ...props,
        modalName : 'editor',
        isModal   : true, 
    };

    if (optionsModal && optionsModal.modalIsOpen) {
        window.history.back();

        return setTimeout(()=> {
            Modal(modalProps) ; 
        }, 500);
    }

    Modal(modalProps)
};

export const OptionsDropDownBtn = props => {
    return(
        <div>
            <button className="btn-sm options-btn" id="dropdown-menu-toggle"
                  data-toggle="dropdown" aria-haspopup="false"
                  aria-expanded="true" type="button" >
                <Icon.MoreHorizontal id="feather-more-horizontal" size={30}/>  

            </button>
            <div className="dropdown-menu drop-left dropdown-menu-box"
                 aria-labelledby="dropdown-menu-toggle">
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
             <Icon.MoreHorizontal id="feather-more-horizontal" size={30}/>  
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
                    let error = 'Sorry, you must confirm your account to to change photo.';
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
    let {linkName, isAuthenticated} = props;
        
    let modalProps = {
            ...props,
            modalName : 'userList', 
        }; 
           
    return(
        <button className="btn-sm "
                onClick={()=> {
                    if(!isAuthenticated) return history.push('/user/registration/');
                    
                    Modal(modalProps)
                } }>
            {linkName} 
            {props.children} 
        </button>
        
    );
};




export const SmsCodeModalBtn = props => {
    let {obj, linkName} = props
    
    let modalProps = {
            ...props,
            modalName : 'smsCodeForm', 
        }; 
          
    return(
        <button className="btn-sm text-highlight"
                onClick={()=> Modal(modalProps)}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};


export const PasswordConfirmModalBtn = props => {
    let {obj, linkName} = props
    
    let modalProps = {
            ...props,
            modalName : 'passwordConfirmForm', 
        }; 
          
    return(
        <button className="btn-sm text-highlight"
                onClick={()=> Modal(modalProps)}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};


