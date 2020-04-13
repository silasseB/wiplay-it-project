import React from 'react';
import { GetModalLinkProps } from "../components/component-props";
import {EditorLink, OptionsModalLink, UsersModalLink} from "components/modal-links"
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { FollowQuestionBtn, UnfollowQuestionBtn, OptionsDropDownBtn} from 'components/buttons';

import {ButtonsBox, Styles } from "components/partial_components";
//import AnswersBox from "containers/answer/answer_page";
import  * as types  from 'actions/types';
import Api from 'utils/api';


const OptBtnSmallScreen = MatchMediaHOC(OptionsModalLink, '(max-width: 980px)');
const OptBtnBigScreen = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');

const api      = new Api();



export const QuestionComponent = props => {
    
    let { question, questionById,questionListById, isQuestionBox, currentUser }    = props;



    let optionsBtnStyles = {
        fontSize   : '8px',
        background : 'white',
        fontWeight : 'bold',
        width      : '40px',
        color      : '#4A4A4A',
        margin     : '0 0 2px'
    }

    let questionPath = `/question/${question.slug}/${question.id}/`;
    let pathToFollowers =  `/followers/${question.id}/${question.slug}/`;

    let state = {
        question,
        usersIsFor : 'questionFollowers', 
    }

    

    let getObj = ()=>{

        if (isQuestionBox && question.user_has_answer) {
            let questionEntitie  = props.entities.question;
            questionEntitie  = questionEntitie[questionById];

            return questionEntitie.userAnswer;
        }
        return question;
    }


    let usersById =  question && `questionFollowers${question.id}`;
    let apiUrl    = question && api.getQuestionFollowersListApi(question.id);
    let linkName = question.followers > 1 && `${question.followers} Followers` || `${question.followers} Follower`;
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
    };



    let editAnswerProps = {
        objName           : 'Answer',
        obj               : getObj(),
        byId              : `newAnswers${question.id}`,
        isPost            : !question.user_has_answer,
        isPut             : question.user_has_answer, 
        className         : 'btn-sm edit-answer', 
        currentUser,  
       
    };


    editAnswerProps = GetModalLinkProps.props(editAnswerProps)
    editQuestionProps = GetModalLinkProps.props(editQuestionProps)
 
    let EditorModalLink = <EditorLink {...editAnswerProps}/>; 

    let MenuModalLink    = <OptBtnSmallScreen {...editQuestionProps}/>;
    let MenuDropdownLink = <OptBtnBigScreen {...editQuestionProps}/>;

    let optionsBtn = ()=>(
        <div>
            {MenuModalLink}
            {MenuDropdownLink}
        </div>
        )

    let questionFollowersLink = question.followers !== 0 &&  <UsersModalLink {...questionFollowersProps}/> 
    
  

   let btnsProps = {
            editAnswerProps,
            editQuestionProps
        }

   Object.assign(btnsProps, props)


   let questionFollowers = <Link to={{ pathname : pathToFollowers,state }}>
                             { question.followers} Followers
                           </Link>;
   
   let unfollowOrFollowQuestionBtn =  question.user_is_following? 
                                         <UnfollowQuestionBtn {...btnsProps} />
                                       :
                                         <FollowQuestionBtn {...btnsProps}/>;


   const btnsList  = {
            itemsCounter : questionFollowersLink,
            btn1         : EditorModalLink,
            btn2         : unfollowOrFollowQuestionBtn,
            btn3         : optionsBtn(),
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

                    </div>

                    <ButtonsBox {...btnsList}/>

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






