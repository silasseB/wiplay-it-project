import React from 'react';
import { GetModalLinkProps } from "templates/component-props";
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { OpenOptionlBtn,
         FollowQuestionBtn,
         UnfollowQuestionBtn,
         OpenEditorBtn,
         OpenUsersModalBtn, } from 'templates/buttons';

import {ButtonsBox, Styles } from "templates/partial-components";

import  * as types  from 'actions/types';
import Api from 'utils/api';


const api      = new Api();

export const QuestionComponent = props => {
    
    let { question,
          questionById,
          questionListById, 
          isQuestionBox, 
          currentUser, 
          isAuthenticated}    = props;



    let optionsBtnStyles = {
        fontSize   : '8px',
        background : 'white',
        fontWeight : 'bold',
        width      : '40px',
        color      : '#4A4A4A',
        margin     : '0 0 2px'
    }

    let questionPath = question && `/question/${question.slug}/${question.id}/`;
    let pathToFollowers =  question && `/followers/${question.id}/${question.slug}/`;

    let state = {
        question,
        usersIsFor : 'questionFollowers', 
    }

    

    let getQuestion = ()=>{

        if (isQuestionBox && question.user_has_answer) {
            let questionEntitie  = props.entities.question;
            questionEntitie  = questionEntitie[questionById];

            return questionEntitie.userAnswer;
        }
        return question;
    }


    let usersById =  question && `questionFollowers${question.id}`;
    let apiUrl    = question && api.getQuestionFollowersListApi(question.id);
    let linkName  = question.followers > 1 && `${question.followers} Followers` || `${question.followers} Follower`;
    //console.log(linkName) 

    let questionFollowersProps = {
            apiUrl,
            byId      : usersById,
            obj       : question,
            currentUser,
            linkName  : linkName,
           
        };


    let editQuestionProps = {
        objName     : 'Question',
        isPut       : true,
        obj         : question, 
        byId        : questionById || questionListById,
        currentUser,
        isAuthenticated,
    };



    let editAnswerProps = {
        objName           : 'Answer',
        obj               : getQuestion(),
        byId              : `newAnswers${question.id}`,
        isPost            : !question.user_has_answer,
        isPut             : question.user_has_answer, 
        className         : 'btn-sm edit-answer-btn', 
        currentUser,  
        isAuthenticated
       
    };


    editAnswerProps = GetModalLinkProps.props(editAnswerProps)
    editQuestionProps = GetModalLinkProps.props(editQuestionProps)
 
    let EditorModalBtn = <OpenEditorBtn {...editAnswerProps}/>; 

    let optionsBtn = ()=>(
        <div>
           <OptBtnBigScreen {...editQuestionProps}/>
           <OptBtnSmallScreen {...editQuestionProps}/>
        </div>
        )

    let questionFollowersBtn = question.followers !== 0 && 
               <OpenUsersModalBtn {...questionFollowersProps}/> || null;
    
  

   let btnsProps = {
            editAnswerProps,
            editQuestionProps
        }

   Object.assign(btnsProps, props)

   let unfollowOrFollowQuestionBtn =  question.user_is_following? 
                                         <UnfollowQuestionBtn {...btnsProps} />
                                       :
                                         <FollowQuestionBtn {...btnsProps}/>;


   const btnsList  = {
            itemsCounter : questionFollowersBtn,
            btn1         : EditorModalBtn,
            btn2         : unfollowOrFollowQuestionBtn,
            btn3         : <OpenOptionlBtn {...editQuestionProps}/>,
            Styles       : Styles,
        }

   let QuestionProps = { questionPath, state, btnsList };
   Object.assign(QuestionProps, props)

   
    return(
        <div key={question.id}>
            <div className="question-contents">

                <div className="question-box ">
                    <div className="question">
                        {props.isQuestionBox?
                            <b className="">
                                { question.add_question }
                            </b>
                            :
                            <b className="">
                                <Link className="question-link"  to={{pathname: questionPath,  state:{...state}}}>
                                    { question.add_question }
                                </Link>
                            </b>
                        }
                        <ButtonsBox {...btnsList}/>

                    </div>
             

                </div>
                
            </div>
        </div>
    );
};



export const UserQuestion = props => {
   
   return (
      <div className="question-content">
         <div className="user-question-box">

            <div className="question">  
               <b className="">
                  <Link to={{pathname: props.questionPath, state: props.state }} className="question-link">
                     { props.questionObj.add_question }
                  </Link>
               </b>
            </div>
            <ButtonsBox {...props.btnsProps}/>
         </div>
      </div>

   )
} 

export const QuestionDropDownMenu = props => (
  <BrowserRouter>
  <div>
   <button className="btn-sm answer-option options-btn " id="questionMenuButton"
      data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
      <i className="material-icons ">more_horiz</i>
    </button>
  <div className="dropdown-menu" aria-labelledby="questionMenuButton">
    <QuestionOptDropDownBtns {...props} />
  </div>
  </div>
  </BrowserRouter>
 
)

export const QuestionModalMenu = props => (
   <BrowserRouter>
    <div className="modal-menu  modal-body">
      <ModalCloseBtn/>
      <QuestionOptModalBtns {...props} />      
   </div>
   </BrowserRouter>
) 






