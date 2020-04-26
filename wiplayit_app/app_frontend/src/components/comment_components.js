import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import {
         UpVoteCommentBtn,
         DownVoteCommentBtn,
         OptionsDropDownBtn,
         OpenEditorBtn,
         OpenOptionsModalBtn,
         ChangeImageBtn,
         OpenUsersModalBtn, } from 'components/buttons';


import { GetModalLinkProps } from "components/component-props";

import {ButtonsBox, Styles} from "components/partial_components";
import Api from 'utils/api';
import  * as types  from 'actions/types';

import RepliesBox from "containers/replies/reply_page";
import { UserComponentSmall } from "components/profile_components";
import { Editor, EditorState, convertFromRaws } from "draft-js";
import {pageMediaBlockRenderer} from 'components/editor_components';
import {decorator} from 'containers/editor'


const OptBtnSmallScreen = MatchMediaHOC(OpenOptionsModalBtn, '(max-width: 980px)');
const OptBtnBigScreen   = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');
const api      = new Api();




export const CommentsComponent = props => {
    //console.log(props)
    let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }

    let { 
        isAnswerBox,
        post,
        answer,
        comment, 
        newCommentsById, 
        commentsById, 
        currentUser, 
        isNewComments, } = props;
   
    let storedState = JSON.parse(comment.comment)
    const contentState = convertFromRaw(storedState);
    const editorState = EditorState.createWithContent(contentState, decorator);


    let pathToUpvoters;

    let commentRepliesById = isAnswerBox && `answerReplies${comment.id}` || `postReplies${comment.id}`;
    
    let state = {
            comment,
            usersIsFor : isAnswerBox? 'answerCommentUpVoters' : 'postCommentUpVoters', 
        }
    if (comment.answer) {
        pathToUpvoters =  `/answer/comment/${comment.id}/upvoters/`;
        
    }

    else{
        
       pathToUpvoters =  `/post/comment/${comment.id}/upvoters/`;
    }
    let usersById =  comment && isAnswerBox && `answerCommentUpVoters${comment.id}` ||
                    comment &&  `postCommentUpVoters${comment.id}`;

    let apiUrl    = comment && isAnswerBox && api.getAnswerCommentUpVotersListApi(comment.id) ||
                    comment && api.getPostCommentUpVotersListApi(comment.id);
    let linkName  = comment.upvotes > 1 && `${comment.upvotes} Upvoters` || `${comment.upvotes} Upvoter`;

    let byId = isNewComments && newCommentsById || commentsById;

    let commentUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : comment,
            currentUser,
            linkName,
        };
   
    let editCommentProps = {
        objName     : 'Comment',
        isPut       : true,
        obj         : comment, 
        byId,
        currentUser,
    };



    let editReplyProps = {
        objName           : 'Reply',
        obj               : comment,
        isPost            : true,
        currentUser,
        byId              : `newCommentsReplies${comment.id}`,
        className         : 'btn-sm edit-reply-btn',
        
    };


    editCommentProps  = GetModalLinkProps.props( editCommentProps)
    editReplyProps    = GetModalLinkProps.props(editReplyProps)
    
    let EditorModalBtn     = <OpenEditorBtn {...editReplyProps}/>; 
    let MenuModalBtn       = <OptBtnSmallScreen {...editCommentProps}/>;
    let MenuDropdownBtn    = <OptBtnBigScreen {...editCommentProps}/>;

    let optionsBtn = ()=>(
        <div>
            {MenuModalBtn}
            {MenuDropdownBtn}
        </div>
        )

    let CommentUpVotersBtn = comment.upvotes !== 0 &&  <OpenUsersModalBtn {...commentUpvotersProps}/>; 
    


    
   let btnsProps = {
         editCommentProps,
         editReplyProps,
         btnStyles:optionsBtnStyles,
         btnText : 'More', 
      }; 

   Object.assign(btnsProps, props)
      
   let upvoteBtn =  props.comment.upvoted? <DownVoteCommentBtn {...btnsProps}/>
               : <UpVoteCommentBtn {...btnsProps}/>

   
              
    const btnsList  = {
        itemsCounter :  CommentUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  optionsBtn(),
        Styles       : Styles,
      } 

      const userProps  = {
                obj    : comment,
                time   : 'Commented',
                currentUser ,

            };

    

    return(
      
        <div  className="comment-box" id="comment-box">
            <div className="autor-details-box comment-detail-box">
                <UserComponentSmall {...userProps}/>
            </div>
    
            <div className="comment">
                <Editor
                   blockRendererFn={pageMediaBlockRenderer}
                   editorState={editorState} 
                   readOnly={true}

                />
            </div>

            <ButtonsBox {...btnsList}/>
            <RepliesBox {...props}/>
            
        </div>
                               
    );
};





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

