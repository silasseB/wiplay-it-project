import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { UpVoteCommentBtn, DownVoteCommentBtn  } from '../components/buttons';

import {EditorLink, OptionsModalLink,UsersModalLink} from "../components/modal-links"
import { GetModalLinkProps } from "../components/component-props";

import {ButtonsBox} from "../components/partial_components";
import Api from '../api';
import  * as types  from '../actions/types';

import RepliesBox from "../containers/replies/reply_page";
import { UserComponentSmall } from "../components/profile_components";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import {pageMediaBlockRenderer} from '../components/editor_components';


//const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
//const OptBtnBigScreen = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');
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
    const editorState = EditorState.createWithContent(contentState);


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
        
    };


    editCommentProps  = GetModalLinkProps.props( editCommentProps)
    editReplyProps    = GetModalLinkProps.props(editReplyProps)
    
    let EditorModalLink     = <EditorLink {...editReplyProps}/>; 
    let MenuModalLink       = <OptionsModalLink {...editCommentProps}/>;
    let CommentUpVotersLink = comment.upvotes !== 0 &&  <UsersModalLink {...commentUpvotersProps}/>; 
    


    
   let btnsProps = {
         editCommentProps,
         editReplyProps,
         btnStyles:optionsBtnStyles,
         btnText : 'More', 
      }; 

   Object.assign(btnsProps, props)
   
    let itemsCounter = <Link to={{pathname:pathToUpvoters,state }}>
                          { props.comment.upvotes }  Upvotes
                      </Link>;

   let upvoteBtn =  props.comment.upvoted? <DownVoteCommentBtn {...btnsProps}/>
               : <UpVoteCommentBtn {...btnsProps}/>

   
              
    const btnsList  = {
        itemsCounter :  CommentUpVotersLink,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalLink,
        btn3         :  MenuModalLink,
      } 

      const userProps  = {
              user        : comment.created_by,
              currentUser ,
            };

    

    return(
      
        <div  className="comment-box" id="comment-box">
            <div className="user-box">
                <UserComponentSmall {...userProps }/>
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

