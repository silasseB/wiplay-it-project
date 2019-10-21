import React from 'react';
import Api from 'api';

import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { EditAnswerBtn, AnswerBtn, FollowQuestionBtn,UnfollowQuestionBtn, 
          QuestionOptDropDownBtn, OpenModalButton,
          ModalCloseBtn,QuestionOptDropDownBtns,QuestionOptModalBtns  } from "components/buttons";
import {ButtonsBox, Styles } from "components/partial_components";
//import AnswersBox from "containers/answer/answer_page";
import  * as types  from 'actions/types';

const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
const OptBtnBigScreen = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');


const api      = new Api();




export const QuestionComponent = props => {
    //console.log(props)
    var questionById = props.questionById;
    var questionEntytie = props.entyties.question;
    questionEntytie = questionEntytie.byId[questionById]

   var question     = props.question;
   

   
   let optionsBtnStyles = {
         fontSize   : '8px',
         background : 'white',
         fontWeight : 'bold',
         width      : '40px',
         color      : '#4A4A4A',
         margin     : '0 0 2px'
   }

   let questionPath = `/question/${question.slug}/`;
   let pathToFollowers =  `/${question.slug}/followers/`;
  
        let state = {
            question,
            usersIsFor : 'questionFollowers', 
        }

     
   let  modalOptionsProps = {
      modalProps : {
        objName    : 'question',
        actionType : types.UPDATE_QUESTION,
        isPut      : true,
        obj        : question, 
        
      },
      modalType : 'optionsMenu', 
   };
   
   let followBtnProps = {
      objName     : 'question',
      actionType  : types.UPDATE_QUESTION,
      isPut       : true,
      obj         : question, 
      objId       : question.id,
      index       : props.index,
      apiUrl      : api.updateQuestionApi(question.id),
      byId        : questionById,
   };
   
   let  createAnswerProps = {
      modalProps :{
        objName           : 'answer',
        actionType        : types.CREATE_ANSWER,
        obj               : question,
        objId             : question.id,
        isPost            : true,
        editorPlaceHolder : 'Create Answer...',
        apiUrl            : api.createAnswerApi(question.id),
         
      },
      modalType : 'editor', 
          
   };

   let  editAnswerProps = {};

   if (props.isQuestionBox ) {
      
      if (questionEntytie.userHasAnswer) {
         var userAnswer = questionEntytie.userAnswer;
      
         editAnswerProps = {
            modalProps :{
              objName           : 'answer',
              objIndex          : userAnswer.index,
              objId             : userAnswer.id,
              obj               : userAnswer,
              isPut             : true,
              actionType        : types.UPDATE_ANSWER,
              editorPlaceHolder : 'Create Answer...',
              apiUrl            : api.updateAnswerApi(userAnswer.id),
            },
            modalType : 'editor', 
         };
      }
   }


   let btnsProps = {
                  createAnswerProps,
                  editAnswerProps,
                  followBtnProps,
                  modalOptionsProps,
                  btnStyles:optionsBtnStyles,
                  btnText : <i className="material-icons ">more_horiz</i>, 
               } 

   Object.assign(btnsProps, props)

   let questionFollowers = <Link to={{ pathname : pathToFollowers,state }}>
                             { question.followers} Followers
                           </Link>;
   let editAnswerBtn      =  props.userHasAnswer? <EditAnswerBtn {...btnsProps}/>
                                                : <AnswerBtn {...btnsProps}/>

   let unfollowOrFollowQuestionBtn =  question.user_is_following? 
                                         <UnfollowQuestionBtn {...btnsProps} />
                                       :
                                         <FollowQuestionBtn {...btnsProps}/>;
                         
              
   let optionsBtn = <div>
                     <OptBtnSmallScreen {...btnsProps}/> 
                     <OptBtnBigScreen {...props}/>
                   </div>;

    const btnsList  = {
                  itemsCounter : questionFollowers,
                  btn1         : editAnswerBtn,
                  btn2         : unfollowOrFollowQuestionBtn,
                  btn3         : optionsBtn,
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
                     <Link to={{pathname: questionPath, state}} className="question-link">
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






