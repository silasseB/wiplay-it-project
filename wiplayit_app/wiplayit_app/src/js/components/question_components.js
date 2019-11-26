import React from 'react';
import { GetModalLinkProps } from "../components/component-props";
import {EditorLink, OptionsModalLink} from "../components/modal-links"
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { FollowQuestionBtn, UnfollowQuestionBtn} from '../components/buttons';

import {ButtonsBox, Styles } from "../components/partial_components";
//import AnswersBox from "containers/answer/answer_page";
import  * as types  from '../actions/types';

//const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
//const OptBtnBigScreen = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');





export const QuestionComponent = props => {
    
    let { question, questionById, isQuestionBox, currentUser }    = props;



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
            var questionEntytie = props.entyties.question;
            questionEntytie = questionEntytie.byId[questionById];

            return questionEntytie.userAnswer;
        }
        return null;
    }


    let editQuestionProps = {
        objName     : 'Question',
        isPut       : true,
        obj         : question, 
        byId        : questionById,
        currentUser,
    };



    let editAnswerProps = {
        objName           : 'Answer',
        obj               : getObj(),
        isPost            : !question.user_has_answer,
        isPut             : question.user_has_answer, 
        currentUser,  
       
    };


    editAnswerProps = GetModalLinkProps.props(editAnswerProps)
    editQuestionProps = GetModalLinkProps.props(editQuestionProps)
 
    let EditorModalLink = <EditorLink {...editAnswerProps}/>; 
    let MenuModalLink   = <OptionsModalLink {...editQuestionProps}/>
    


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
            itemsCounter : questionFollowers,
            btn1         : EditorModalLink,
            btn2         : unfollowOrFollowQuestionBtn,
            btn3         : MenuModalLink,
            Styles       : Styles,
        }

   let QuestionProps = { questionPath, state, btnsList };
   Object.assign(QuestionProps, props)

   let styles = {
     questionBox:{
        border     : '1px solid  #D5D7D5',
        margin     : '12px  5px 7px',
        paddingTop : '8px'

     },

     questionContents : {
        borderTop     : '3px solid  #D5D7D5',
        
     }
  }

   return(
      <div key={question.id}>
         <div>
         <div style={styles.questionContents} className="question-content">

            <div style={styles.questionBox} className="question-bo ">
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






