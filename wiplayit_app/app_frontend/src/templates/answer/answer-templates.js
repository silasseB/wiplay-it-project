import React from 'react';
import { Link, BrowserRouter  } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';

import { GetModalLinkProps } from "templates/component-props";
import { 
        UpVoteAnswerBtn,
        DownVoteAnswerBtn,
        OpenEditorBtn,
        OpenOptionlBtn,
        OpenUsersModalBtn} from 'templates/buttons';

import { Editor } from "draft-js";
import  * as types  from 'actions/types';
import {pageMediaBlockRenderer} from 'templates/editor/editor-templates';
import Helper from 'utils/helpers';
import {ButtonsBox, Styles } from "templates/partial-components";
import Api from 'utils/api';
import { UserComponentSmall } from "templates/author/profile-templates";


const api      = new Api();
const helper   = new Helper(); 


export const AnswersComponent = props => {
    //console.log(props)

    var {
        answer, 
        answerListById,
        newAnswerListById,
        isNewAnswers,
        isQuestionBox,
        isProfileBox, 
        isAuthenticated,
        currentUser } = props;

    if(!answer) return null;
   
   
    let optionsBtnStyles = {
         fontSize   : '8px',
         background : 'white',
         fontFamily : 'Mukta',
         fontWeight : 'bold',
         color      : '#4A4A4A',
         margin     : '0 0 2px'
    };
  
   const editorState  = helper.convertFromRaw(answer.add_answer);

    let usersById =  `answerUpVoters${answer.id}`;
    let apiUrl    =  api.getAnswerUpVotersListApi(answer.id);
    let linkName  =  answer.upvotes > 1 && `${answer.upvotes} Upvoters` || `${answer.upvotes} Upvoter`;
   
    let state = {
          answer,
          usersIsFor : 'answerUpVoters', 
        }
  
    let answerUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : answer,
            currentUser,
            linkName,
            isAuthenticated,
        };

    let editObjProps = {
        objName     : 'Answer',
        linkName    : 'Edit Answer',
        isPut       : true,
        obj         : answer, 
        byId        : answerListById,
        currentUser,
        isAuthenticated,
    };



    let createObjProps = {
        objName           : 'Comment',
        obj               : answer,
        isPost            : true,
        byId              : `newAnswerComments${answer.id}`,
        className         : 'btn-sm edit-comment-btn',
        currentUser,
        isAuthenticated,
    };
  
    let createBookmarkProps = {
        objName           : `AnswerBookmark`,
        bookmarkType      : 'answers',
        obj               : answer,
        byId              : `bookmarkedAnswers`,
        isPost            : true,
        currentUser,  
        isAuthenticated
    };

    createBookmarkProps = GetModalLinkProps.props(createBookmarkProps)
    editObjProps = GetModalLinkProps.props(editObjProps);
    createObjProps = GetModalLinkProps.props(createObjProps);

    let EditorModalBtn     = <OpenEditorBtn {...createObjProps}/>; 
    
    let AnswerUpVotersBtn = answer.upvotes !== 0 &&
                            <OpenUsersModalBtn {...answerUpvotersProps}/> 
   
    

    let btnsProps = {
            ...props,
            editObjProps,
            createObjProps, 
            createBookmarkProps,
    }; 
   
    
    let UpVoteBtn = answer.upvoted? <DownVoteAnswerBtn {...btnsProps}/>
               : <UpVoteAnswerBtn {...btnsProps}/>
          
   
    const btnsList   = { 
            itemsCounter : AnswerUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
            Styles : Styles
        };

    const userProps  = {
            obj   : answer,
            time   : 'Answered',
            currentUser,
        };


    let question = answer.question;
    let questionPath = question && `/question/${question.slug}/${question.id}/`;
   
                                        
    return (
        <div className="answer-box">     
            <div className="autor-details-box answer-detail-box">
                <UserComponentSmall {...userProps}/>
            </div>

            { !isQuestionBox  &&
                <ul className="answer-question-box">
                <li className="question">
                    <Link to={{pathname: questionPath, state : {question} }} 
                          className="question-link">
                        { question.add_question }
                    </Link>
                </li>
                </ul>
            }

            <div className="answer">
                <Editor
                    blockRendererFn={pageMediaBlockRenderer}
                    editorState={editorState}
                    readOnly={true}
                />
            </div>
            <div className="">
               <ButtonsBox {...btnsList}/>   
               
            </div>
        </div>
    );       
};



export const AnswerDropDownMenu = props => (
   <BrowserRouter>
      <div>
         <button className="btn-sm answer-option options-btn " id="questionMenuButton"
              data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
              <i className="material-icons ">more_horiz</i>
    </button>
  <div className="dropdown-menu" aria-labelledby="questionMenuButton">
    <AnswerOptModalBtns {...props} />
  </div>
  </div>
  </BrowserRouter>
 
)






export const PartialAnswerComp = props => {

   let optionsBtnStyles = {
              fontSize   : '8px',
              border     : '1px solid red',
              background : 'white',
              fontFamily : 'Mukta',
              fontWeight : 'bold',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
   }

   let upvoteBtnProps  = {
      upVoteAnswer   : props.props.upVoteAnswer,
      downVoteAnswer : props.props.downVoteAnswer,
      answer         : props.answer,
      index          : props.index, 
   }

   return (
      <div className="answer-box" >
         <div className="answer">
            <p>{ props.answer.add_answer }</p>
         </div>

         <div className="answer-relation">
            <div className="inline">
               <Link to="/" className="answer-upvotes">{ props.answer.upvotes }  Upvotes
               </Link>
            </div>

            <div className="answer-nav-box">

               <div className="upvote-answer-btn-box">

                  { props.answer.user_has_upvoted ? 
                    <DownVoteAnswerBtn {...upvoteBtnProps} />

                     :
                    <UpVoteAnswerBtn {...upvoteBtnProps}/>
                  }
                 
               </div>

               <div className="comment-btn-box">
                  <CommentBtn {...props }
                  />
              
                </div>

                <div className="options-box answer-optios-box">
                  <OptBtnSmallScreen {...{
                                 modalContents : <AnswerModalMenu {...props}/>,
                                  props     : props,
                                  answer    : props.answer,
                                  btnStyles : optionsBtnStyles,
                                  openOptionsModal : props.props.openOptionsModal,
                                  btnText: <i className="material-icons ">more_horiz</i>, 
                       }
                      }
                  />

                  <OptBtnBigScreen {...props}/>

               </div>

            </div>

               
         </div>

      </div>    
   )
}



export const AnswerModalMenu = props => (
   <BrowserRouter>
    <div className="modal-menu ">
      <ModalCloseBtn/>
      <AnswerOptModalBtns {...props} />      
   </div>
   </BrowserRouter>
) 


