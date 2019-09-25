import React from 'react';
import { BrowserRouter,Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import {pageMediaBlockRenderer} from 'components/editor_components';

import { ReplyBtn, ReplyOptModalBtns, DownVoteReplytBtn, UpVoteReplyBtn,
         OpenModalButton,QuestionOptDropDownBtn, ModalCloseBtn  } from "components/buttons";
import {ButtonsBox} from "components/partial_components";
import Api from 'api';
import  * as types  from 'actions/types';
import ReplyChildrenBox from "containers/replies/reply_children_page";
import ReplyGrandChildrenBox from "containers/replies/reply_grand_children_page";
import ReplyGreatGrandChildBox from "containers/replies/reply_great_grand_child_page";

import { UserComponentSmall } from "components/profile_components";


const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
const OptBtnBigScreen = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');
const api      = new Api();



export const RepliesComponent = props => {
  // console.log(props.replyState)

   let replyStyles = {
         border     : 'px solid black',
         margin     : '15px 22px',
   }
   
   var replies   =   props.entyties.replies;
   replies =  replies.byId[props.repliesById];
   return(
      <div>
   
         { replies.replyList.map( (reply, index) => { 
            let replyProps = {
               reply,
               byId : props.repliesById,
               index,
               replyStyles,
               props
            }
                         
         return (
            <div key={index} >
               { props.comment.id === reply.comment?
                  <div  className="reply-container">
                     <div  className="reply-contents"> 
                     
                        <Reply {...replyProps}/>
                
                        { reply.has_children?
                           <ReplyChildrenBox {...replyProps}/>
       
                           :
                           ""
                        }

                     </div>

                  </div>

               :""

               }
            </div>
         )

         }

         )}

      </div>


   )
}





export const ReplyChildernComponent = props => {
  //console.log(props)

  let replyStyles = {
             
               border     : 'px solid blue',
               margin     : '15px 22px 10px  38px',
   };
     
   var replies   =   props.entyties.replies;
   replies =  replies.byId[props.replyChildrenById];

   return(
      <div >

         { replies.replyList.map( (reply, index) => {
            let replyProps = {
               reply,
               byId : props.replyChildrenById,
               index,
               replyStyles,
               props
            }
            
            return (

               <div  key={index} >
                    { props.childParent.id === reply.parent?

                  <div className="reply-child-container">
                  
                     <div className="reply-child-contents"> 
                        <Reply {...replyProps}/>
                     </div>

                     { reply.has_children?
                           <ReplyGrandChildrenBox {...replyProps}/>
        
                           :
                           ''
                     }

                  </div>

                  : ""
                  } 
               </div> 
              ) 
            }

         )}

      </div>

   )
}




export const ReplyGrandChildernComponent = props => {
 
  let replyStyles = {
            border    : 'px solid red',
            margin    : '15px 22px 10px 60px',
         }

   var replies   =   props.entyties.replies;
   replies =  replies.byId[props.grandChildById];
   return(
         <div >

            { replies.replyList.map( (reply, index) => {
               let replyProps = {
                  reply,
                  byId : props.grandChildById, 
                  index,
                  replyStyles,
                  props
               }
               
            return(  
               <div  key={index}>
                  { props.grandChildParent.id === reply.parent?
                     <div className="reply-grand-child-container">
                        <div className="reply-grand-child-contents"> 
                           <Reply {...replyProps }/>
                        </div>
                        { reply.has_children?
                           <ReplyGreatGrandChildBox {...replyProps} />
                              :
                           ''
                        }

                     </div>
                     :

                     ""
                  }

               </div> 
            )
            }

           )}

         </div>

        
   )
}




export const ReplyGreatGrandChildComponent = props => {
  console.log(props)

  let replyStyles = {
             
              border     : 'px solid green',
              margin     : '15px 22px 10px 75px'
            }

   var replies   =  props.entyties.replies;
   replies =  replies.byId[props.byId];
   var replyList =  replies.replyList;

   return(
         <div>

            { replyList.map( (reply, index) => {
               let replyProps = {reply,index,replyStyles,props}
                
                return(

                <div  key={index}>
                    { props.greatGrandChildParent.id === reply.parent?
                        <div className="reply-great-grand-child-container">
                     
                        <div className="reply-great-grand-child-contents"> 
                          <Reply {...replyProps}/>
  
                        </div>
                        
                        { reply.has_children?
                          ""
                         :

                        ''
                        }

                     </div>

                  : ""
                  }

                 </div>  
               )
            }


            )}

         </div>

        
   )
}




export const Reply = props => {
   console.log(props)
   let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
   }

   let {answer, post } = props.props;
   var reply = props.reply;
   let storedState = JSON.parse(reply.reply)
   const contentState = convertFromRaw(storedState);
   const editorState = EditorState.createWithContent(contentState);
  
   let state = {
            reply,
            usersIsFor : answer? 'answerReplyUpVoters' : 'postReplyUpVoters', 
        }

   let pathToUpvoters =  `/reply/${reply.id}/upvoters/`;

   var createApiUrl = '';
   var updateUrl    = ''; 
   if (answer) {
      updateUrl    = api.updateAnswerReplyApi(reply.id);
      createApiUrl = api.createAnswerReplyChildApi(reply.id);
      
   }else if(post){
      updateUrl    = api.updatePostReplyApi(reply.id);
      createApiUrl = api.createPostReplyChildApi(reply.id);
      
   }
     

   let  modalOptionsProps = {
      modalProps : {
         objName    : 'reply',
         actionType : types.UPDATE_REPLY,
         isPut      : true,
         obj        : reply, 
         apiUrl     : updateUrl,
         objIndex   : props.index,
         objId      : reply.id,
         byId       : props.byId,
      },
      modalType : 'optionsMenu', 
   };
   

   let upvoteBtnProps = {
      objName     : 'reply',
      actionType  : types.UPDATE_REPLY,
      isPut       : true,
      obj         : reply, 
      objId       : reply.id,
      objIndex    : props.index,
      apiUrl      : updateUrl,
      byId        : props.byId,
   };
   
   let  createReplyProps = {
      modalProps : {
        objName           : 'reply',
        actionType        : types.CREATE_REPLY,
        obj               : reply,
        objId             : reply.id,
        isPost            : true,
        editorPlaceHolder : 'Add Reply...',
        apiUrl            : createApiUrl,
        byId        : props.byId,
        
         
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

   Object.assign(btnsProps, props.props)
   let itemsCounter = <Link to={{pathname:pathToUpvoters,state }}>
                         { reply.upvotes }  Upvotes
                     </Link>;

   let upvoteBtn =  reply.upvoted? <DownVoteReplytBtn {...btnsProps}/>
               : <UpVoteReplyBtn {...btnsProps}/>

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
 


   return (
         <div style={ props.replyStyles}  className="reply-box" id="reply-box">
            <div className="user-box">

              <UserComponentSmall {...
                     {
                        user         : reply.created_by,
                        currentUser : props.props.currentUser, 

                     }
                  }
            />
               
            </div>


            
            <div className="reply">
               <Editor
                 blockRendererFn={pageMediaBlockRenderer}
                 editorState={editorState} 
                 readOnly={true} />
            </div>
            
            
          <ButtonsBox {...btnsList}/>


         </div>
    
   )
}








export const RepliesLink = props => {
   //console.log(props)



   let styles ={
      border        : "px solid #D5D7D5",
      display       : 'flex',
      flexDirection : 'row',
      margin        : '10px 60px',
      padding       : '2px 2px 2px 7px',
      borderRadius  : '20px',
      background    : '#EEEEEE'
   }
  
   let userStyles = {
      display       : 'flex',
      border        : 'px solid blue',
      padding       : '2px',
      listStyleType : 'none',
      margin        : '0',
   }


  let itemStyles = {
   display       : 'flex',
   border        : 'px solid blue',
   listStyleType : 'none',
   margin        : '0',
   padding       : '0',
        
  }

   let imgStiles = {
      borderRadius  : '50%',
      width         : '17px',
      height        : '19px',
      
       
   }

   let userNameStyles = {
       border      : 'px solid blue',
       fontSize    : '11px',
       color       : '#2C2D2D',
       fontFamily  : 'Mukta',
       lineHeight  : '1.8',
       margin      : '0 0 0 3px',
   } 

   let totalRepliesStyles = {
      border      : 'px solid red',
      fontSize    : '9px',
      margin      : '2px 0 0 10px',
      lineHeight  : '1.8',
   }

   let textStyles = {
      color       : 'black',
      fontSize    : '9px',
      border      : 'px solid black',
      lineHeight  : '1.8',
      margin      : '2px 0 0 4px',
   }
   
   return (
      <div style={styles} className="comments-link">

         <ul style={ userStyles}>
            <li style={ imgStiles }>
               { props.reply.created_by.profile.profile_picture === null?
                  <img alt="" src={require("images/user-avatar.png")} className="profile-photo"/>
               :  
                  <img alt="" src={props.reply.created_by.profile.profile_picture}
                         className="profile-photo"/> 
               }

            </li>
            <li style={ userNameStyles } >
               { props.reply.created_by.first_name }   { props.reply.created_by.last_name } ...
            </li>
         </ul>

         <ul style={ itemStyles} >
            <li style={ textStyles } > Replied </li>
            <li style={totalRepliesStyles}> { props.totalReplies } Reply</li>
         </ul>
      </div>
   )
}


export const CommentsReplyLink = props => {
   var byId = props.repliesById;
   var replies   =  props.entyties.replies;
   var linkData  =  replies.byId[byId].linkData;
   var reply     =  linkData.reply;
  
   var apiUrl = '';
   if (props.isAnswerBox) { 
     apiUrl = api.getAnswerReplyListApi(reply.comment);
   }else{
      apiUrl = api.getPostReplyListApi(reply.comment);
   }

   var replyProps = {
      actionType: types.GET_REPLY_LIST,
      apiUrl    : apiUrl,
      byId,

   }; 
   return(
      <div  className="reply-link-box"
                  onClick={ () => props.getReplyList(replyProps) }> 
         <RepliesLink {...linkData}/>
      </div> 
   );
};



export const ChildRepliesLink = props => {
   var byId = props.replyChildrenById;
   var replyState = props.entyties.replies.byId[byId]
   
   var linkData  = replyState.linkData;
   var reply =   props.childParent;
    
   var apiUrl = '';
   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType : types.GET_REPLY_CHILD_LIST,
      apiUrl     : apiUrl,
      byId,
      children   : reply.children,
   };

   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps, reply.children) }> 
         <ul>
            <li>Click to view More</li>
            <li>{ linkData.totalReplies }</li>
         </ul>
      </div> 
   );
};


export const GrandChildRepliesLink = props => {
   var reply = props.grandChildParent;
   var byId = props.grandChildById ;
   var replies   = props.entyties.replies.byId[byId]
   var linkData  = replies.linkData;
  
   var apiUrl    = '';

   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType : types.GET_REPLY_CHILD_LIST,
      apiUrl     : apiUrl,
      byId,
      children  : reply.children,
   }; 

   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps) }> 
           <ul>
            <li>Click to view More</li>
            <li>{ linkData.totalReplies }</li>
         </ul>
      </div> 
   );
};



export const GreatGrandChildRepliesLink = props => {
   var byId = props.byId;
   var replyState = props.entyties.replies.byId[byId];

   var linkData  = replyState.linkData;
   var reply     = props.greatGrandChildParent;
   var apiUrl = '';
   
   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType: types.GET_REPLY_CHILD_LIST,
      apiUrl    : apiUrl,
      byId,
      
   }; 
   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps) }> 
         <ul>
            <li>Click to view More</li>
            <li>{ linkData.totalReplies }</li>
         </ul>
      </div> 
   );
};



export const ReplyDropDownMenu = props => (
   <BrowserRouter>
      <div>
         <button className="btn-sm answer-option options-btn " id="questionMenuButton"
              data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
              <i className="material-icons ">more_horiz</i>
         </button>
         <div className="dropdown-menu" aria-labelledby="questionMenuButton">
            <ReplyOptModalBtns {...props} />
         </div>
      </div>
  </BrowserRouter>
 
)



export const ReplyModalMenu = props => (
   <BrowserRouter>
    <div className="modal-menu ">
      <ModalCloseBtn/>
      <ReplyOptModalBtns {...props} />      
   </div>
   </BrowserRouter>
) 




