import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';


import { ReplyBtn,UpVoteCommentBtn, CommentOptModalBtns, DownVoteCommentBtn,
         OpenModalButton, QuestionOptDropDownBtn, ModalCloseBtn  } from "components/buttons";
import {ButtonsBox} from "components/partial_components";
import Api from 'api';
import  * as types  from 'actions/types';

import RepliesBox from "containers/replies/reply_page";
import { UserComponentSmall } from "components/profile_components";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import {pageMediaBlockRenderer} from 'components/editor_components';


const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
const OptBtnBigScreen = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');
const api      = new Api();






export const CommentsComponent = props => {
  let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
   }

   let { isAnswerBox, comment, index} = props;
   
   let storedState = JSON.parse(comment.comment)
   const contentState = convertFromRaw(storedState);
   const editorState = EditorState.createWithContent(contentState);


    let pathToUpvoters =  `/comment/${comment.id}/upvoters/`;

   
    
   let state = {
            comment,
            usersIsFor : isAnswerBox? 'answerCommentUpVoters' : 'postCommentUpVoters', 
        }

   
   var createApiUrl = '';
   var updateUrl    = ''; 
   if (isAnswerBox) {
      updateUrl    = api.updateAnswerCommentApi(comment.id);
      createApiUrl = api.createAnswerCommentReplyApi(comment.id);
   }else{
      updateUrl    = api.updatePostCommentApi(comment.id);
      createApiUrl = api.createPostCommentReplyApi(comment.id);
   }

   let  modalOptionsProps = {
      modalProps : {
        objName     : 'comment',
        actionType  : types.UPDATE_COMMENT,
        isPut       : true,
        obj         : comment, 
        objId       : comment.id,
        objIndex    : index, 
        apiUrl      : updateUrl,
      },

      modalType : 'optionsMenu', 
    };
   
   let upvoteBtnProps = {
      objName     : 'comment',
      actionType  : types.UPDATE_COMMENT,
      isPut       : true,
      obj         : props.comment, 
      objId       : props.comment.id,
      objIndex    : props.index,
      apiUrl      : updateUrl,
      byId        : props.commentById,
   };
   

   let  createReplyProps = {
      modalProps : {
        objName           : 'reply',
        actionType        : types.CREATE_REPLY,
        obj               : props.comment,
        objId             : props.comment.id,
        isPost            : true,
        objIndex          : props.index,
        editorPlaceHolder : 'Add Reply...',
        apiUrl            : createApiUrl,
         
      },
      modalType : 'editor', 
          
   };

   let btnsProps = {
         createReplyProps,
         upvoteBtnProps,
         modalOptionsProps,
         btnStyles:optionsBtnStyles,
         btnText : 'More', 
      }; 

   Object.assign(btnsProps, props)
   
    let itemsCounter = <Link to={{pathname:pathToUpvoters,state }}>
                          { props.comment.upvotes }  Upvotes
                      </Link>;

   let upvoteBtn =  props.comment.upvoted? <DownVoteCommentBtn {...btnsProps}/>
               : <UpVoteCommentBtn {...btnsProps}/>

   let replyBtn =  <ReplyBtn {...btnsProps}/>;
   let optionsBtn =  <div>
                        <OptBtnSmallScreen {...btnsProps}/> 
                        <OptBtnBigScreen {...props}/>
                     </div>;
                         
              
    const btnsList  = {
        itemsCounter :  itemsCounter,
        btn1         :  upvoteBtn,
        btn2         :  replyBtn,
        btn3         :  optionsBtn,
      } 

      const userProps  = {
              user        : props.comment.created_by,
              currentUser : props.currentUser,
            };

    

   return(
      
      <div  className="comment-box" id="comment-box">
         <div className="user-box">

            <UserComponentSmall {...userProps }
            />
           
          </div>
    
         <div className="comment">
            <Editor
              blockRendererFn={pageMediaBlockRenderer}
              editorState={editorState} 
              readOnly={true} />
         </div>
         <ButtonsBox {...btnsList}/>
          { props.comment.replies.length?
            <RepliesBox {...props}/>
            :
            ""
          }
      </div>
                               
   )
}





export const CommentDropDownMenu = props => (
   <BrowserRouter>
      <div>
         <button className="btn-sm answer-option options-btn " id="questionMenuButton"
              data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
              <i className="material-icons ">more_horiz</i>
    </button>
  <div className="dropdown-menu" aria-labelledby="questionMenuButton">
    <CommentOptModalBtns {...props} />
  </div>
  </div>
  </BrowserRouter>
 
)

export const CommentModalMenu = props => (
   <BrowserRouter>
    <div className="modal-menu ">
      <ModalCloseBtn/>
      <CommentOptModalBtns {...props} />      
   </div>
   </BrowserRouter>
) 

