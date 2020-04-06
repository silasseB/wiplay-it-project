import React from 'react';
import { Link, BrowserRouter  } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';

import {EditorLink, OptionsModalLink, UsersModalLink} from "components/modal-links"
import { GetModalLinkProps } from "components/component-props";
import { UpVoteAnswerBtn, DownVoteAnswerBtn, OptionsDropDownBtn} from 'components/buttons';

import { Editor, EditorState, convertFromRaw } from "draft-js";
import  * as types  from 'actions/types';
import CommentsBox from "containers/comment/comment_page";
import {pageMediaBlockRenderer} from 'components/editor_components';

import {ButtonsBox, Styles } from "components/partial_components";
import Api from 'utils/api';

import { UserComponentSmall } from "components/profile_components";



const OptBtnSmallScreen = MatchMediaHOC(OptionsModalLink, '(max-width: 980px)');
const OptBtnBigScreen = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');
const api      = new Api();




export const AnswersComponent = props => {
    //console.log(props)
    var {
        answer, 
        answerListById,
        newAnswerListById,
        isNewAnswers, 
        currentUser } = props;
   
    let pathToUpvoters =  `/answer/${answer.id}/upvoters/`;

    let optionsBtnStyles = {
         fontSize   : '8px',
         background : 'white',
         fontFamily : 'Mukta',
         fontWeight : 'bold',
         color      : '#4A4A4A',
         margin     : '0 0 2px'
    };
  

    let storedState = JSON.parse( answer.add_answer);
   
    const contentState = convertFromRaw(storedState);
    const editorState = EditorState.createWithContent(contentState);

    let usersById =  answer && `answerUpVoters${answer.id}`;
    let apiUrl    = answer && api.getAnswerUpVotersListApi(answer.id);
    let linkName = answer.upvotes > 1 && `${answer.upvotes} Upvoters` || `${answer.upvotes} Upvoter`;
   
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
        };

    let editAnswerProps = {
        objName     : 'Answer',
        linkName    : 'Edit Answer',
        isPut       : true,
        obj         : answer, 
        byId        : isNewAnswers && newAnswerListById || answerListById,
        currentUser,
    };



    let editCommentProps = {
        objName           : 'Comment',
        obj               : answer,
        isPost            : true,
        currentUser,
        byId              : `newAnswerComments${answer.id}`,
        
    };


    editAnswerProps = GetModalLinkProps.props(editAnswerProps);
    editCommentProps = GetModalLinkProps.props(editCommentProps);
    

    let EditorModalLink = <EditorLink {...editCommentProps}/>; 
    let MenuModalLink   = <OptBtnSmallScreen {...editAnswerProps}/>;
    let MenuDropdownLink = <OptBtnBigScreen {...editAnswerProps}/>;

    let optionsBtn = ()=>(
        <div>
            {MenuModalLink}
            {MenuDropdownLink}
        </div>
        )

    let AnswerUpVotersLink =  answer.upvotes !== 0 && <UsersModalLink {...answerUpvotersProps}/> 
   
    

    let btnsProps = {
         editAnswerProps,
         editCommentProps, 
      }; 

    Object.assign(btnsProps, props)
    let itemsCounter = <Link to={{pathname:pathToUpvoters,state }}>
                         { props.answer.upvotes }  Upvotes
                     </Link>;
    
    let UpVoteBtn =  props.answer.upvoted? <DownVoteAnswerBtn {...btnsProps}/>
               : <UpVoteAnswerBtn {...btnsProps}/>
          
   
    const btnsList   = { 
            itemsCounter : AnswerUpVotersLink,
            btn1   : UpVoteBtn,
            btn2   : EditorModalLink,
            btn3   : optionsBtn(),
            Styles : Styles
         };

    const userProps  = {
              user        : props.answer.created_by,
              currentUser,
            };

    return (
        <div className="answer-box">     
            <div className="answer-detail-box">
                {props.isProfileBox?
                    ""
                    :
                    <UserComponentSmall {...userProps}/>
                }
            
            </div>

            <div className="answer">
                <Editor
                    blockRendererFn={pageMediaBlockRenderer}
                    editorState={editorState}
                    readOnly={true}
                />
            </div>
            <div>
               <ButtonsBox {...btnsList}/>   
               <CommentsBox {...props}/>
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


