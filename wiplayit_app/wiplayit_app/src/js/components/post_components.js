import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import Api from '../api';
import {EditorLink, OptionsModalLink} from "../components/modal-links"
import { GetModalLinkProps } from "../components/component-props";

import  * as types  from '../actions/types';

import {DownVotePostBtn,UpVotePostBtn} from '../components/buttons';
import CommentsBox from "../containers/comment/comment_page";
import {pageMediaBlockRenderer} from '../components/editor_components';
import {Editor,EditorState, convertFromRaw} from 'draft-js';
import {ButtonsBox,Styles} from "../components/partial_components";

import { UserComponentSmall } from "../components/profile_components";





//const OptBtnSmallScreen = MatchMediaHOC(OpenModalButton, '(max-width: 500px)');
//const OptBtnBigScreen   = MatchMediaHOC(QuestionOptDropDownBtn, '(min-width: 800px)');
const api      = new Api();




export const PostComponent = props => {

   let optionsBtnStyles = {
              fontSize   : '8px',
              background : 'white',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
   }

   let {post, currentUser, postById}     =    props;


   let   storedState    =  JSON.parse(post.add_post);
   const contentState   =  convertFromRaw(storedState);
   const editorState    =  EditorState.createWithContent(contentState);

   let   postPath       = `/post/${post.slug}/${post.id}/`;
   let   pathToUpvoters =  `/post/${post.id}/upvotes/`;
   let state = {
            post,
            usersIsFor : 'postUpVoters', 
        }
     let editPostProps = {
        objName     : 'Post',
        isPut       : true,
        obj         : post, 
        byId        : postById,
        currentUser,
    };



    let editCommentProps = {
        objName           : 'Comment',
        obj               : post,
        isPost            : true,
        currentUser,
        byId        : postById,
        
    };


    editPostProps = GetModalLinkProps.props(editPostProps)
    editCommentProps = GetModalLinkProps.props(editCommentProps)
   

    let EditorModalLink = <EditorLink {...editCommentProps}/>; 
    let MenuModalLink   = <OptionsModalLink {...editPostProps}/>
    

   let btnsProps = {
        editPostProps,
        editCommentProps, 
      }; 



   
   Object.assign(btnsProps, props)
   let itemsCounter = <Link to={{pathname:pathToUpvoters,state }}>
                         { post.upvotes }  Upvotes
                     </Link>;

   let UpVoteBtn =  post.upvoted? <DownVotePostBtn {...btnsProps}/>
               : <UpVotePostBtn {...btnsProps}/>


   const btnsList   = { 
            itemsCounter : itemsCounter,
            btn1   : UpVoteBtn,
            btn2   : EditorModalLink,
            btn3   : MenuModalLink,
            Styles : Styles
         };

   const userProps  = {user : post.created_by, currentUser};
  

    return (
      <div>
          <div className="post-contents">
            <div className="post-box">
               <div className="post"> 
                 <div className="user-box">
                    <UserComponentSmall {...userProps}
                    />
           
                  </div>

                  { props.isPostBox? 
                     <b className="">
                        { post.add_title }
                  
                     </b>
                     :

                     <b className="">
                        <Link to={{pathname: postPath, state }} className="question-link">
                           { post.add_title }
                        </Link>
                     </b>
                  }

                  </div>
                  <div className="post-body">
                     <Editor
                        blockRendererFn={pageMediaBlockRenderer}
                        editorState={editorState} 
                        readOnly={true} 
                     />
                  </div>
                  <ButtonsBox {...btnsList}/>
               </div>
            <CommentsBox {...props}/>
          </div>
      </div>
    );

};



export const PostPageComponent = props => {

   return (
      <div>
         <div className="post-contents">
            <div className="post-box">
               <div className="post"> 

                  { props.isPostBox? 
                     <b className="">
                        { props.post.add_title }
                  
                     </b>
                     :

                     <b className="">
                        <Link to={{ pathname : props.postPath, state : props.state }} className="question-link">
                           { props.post.add_title }
                        </Link>
                     </b>
                  }
               </div>

               <div className="post-body">
                  <Editor
                     blockRendererFn={pageMediaBlockRenderer}
                     editorState={props.editorState} 
                     readOnly={true} 
                  />
               </div>
                  <ButtonsBox {...props.btnsProps}/>
            </div>
            <CommentsBox {...props}/>
         </div>
      </div>
   );
}; 


export const PostListComponent = props => {

  return (
      <div className="post-list-page">
         <div className="post-list-content">
            <div className="post-box">
               <div className="post">  
               </div>
               <div className="post-body">
                  <Editor
                     blockRendererFn={pageMediaBlockRenderer}
                     editorState={props.editorState} 
                     readOnly={true} 
                  />
               </div>
    
            <ButtonsBox {...props.btnsProps}/>
         </div>
         <CommentsBox {...props}/>
      
      </div>
      </div>

   );
}; 







export const UserPost = props => {
  console.log(props)
  return (

      <div className="post-content">
         <div className="post-box">

            <div className="post">  
               <b className="">
                  <Link to={{pathname: props.postPath, state:props.state }} className="question-link">
                     { props.post.add_title }
                  </Link>
               </b>
            </div>

             <div className="post-body">
               <Editor
                  blockRendererFn={pageMediaBlockRenderer}
                  editorState={props.editorState} 
                  readOnly={true} 
               />
            </div>
            <ButtonsBox {...props.btnsProps}/>
         </div>
      
      </div>

   );
}; 

export const PostDropDownMenu = props => (
  <BrowserRouter>
  <div>
   <button className="btn-sm post-option options-btn " id="postMenuButton"
      data-toggle="dropdown" aria-haspopup="false" aria-expanded="true" type="button" >
      <i className="material-icons ">more_horiz</i>
    </button>
  <div className="dropdown-menu" aria-labelledby="postMenuButton">
    <PostOptDropDownBtns {...props} />
  </div>
  </div>
  </BrowserRouter>
 
)

export const PostModalMenu = props => (
   <BrowserRouter>
    <div className="modal-menu  modal-body">
      <ModalCloseBtn/>
      <PostOptModalBtns {...props} />      
   </div>
   </BrowserRouter>
) 






