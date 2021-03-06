import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import Api from 'utils/api';
import { GetModalLinkProps } from "templates/component-props";

import  * as types  from 'actions/types';

import {
        DownVotePostBtn,
        UpVotePostBtn,
        OpenOptionlBtn,
        OpenEditorBtn,
        ChangeImageBtn,
        OpenUsersModalBtn,} from 'templates/buttons';

import CommentsBox from "components/comment/comment-page";
import {pageMediaBlockRenderer} from 'templates/editor/editor-templates';
import {Editor} from 'draft-js';
import {ButtonsBox,Styles} from "templates/partial-components";
import { UserComponentSmall } from "templates/author/profile-templates";


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

    let {post, currentUser, postById, postListById}     =    props;
    if(!post) return null;

    const editorState  = helper.convertFromRaw(post.add_post);
    let  postPath       = post && `/post/${post.slug}/${post.id}/`;
    let  pathToUpvoters = post && `/upvoters/post/${post.id}/`;

    let usersById       = post && `postUpVoters${post.id}`;
    let apiUrl          = post && api.getPostUpVotersListApi(post.id);
    let linkName = post.upvotes > 1 && `${post.upvotes} Upvoters` || `${post.upvotes} Upvoter`;

    let state = {
            post,
            usersIsFor : 'postUpVoters', 
        }

    let postUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : post,
            currentUser,
            linkName,
        };

    let editObjProps = {
        objName     : 'Post',
        isPut       : true,
        obj         : post, 
        byId        : postById || postListById,
        currentUser,
    };



    let createObjProps = {
        objName           : 'Comment',
        obj               : post,
        isPost            : true,
        currentUser,
        byId        : postById,
        className   : 'btn-sm edit-comment-btn',
    };

    let createBookmarkProps = {
        objName           : `PostBookmark`,
        obj               : answer,
        byId              : `bookmarkedPosts`,
        isPost            : true,
        currentUser,  
        isAuthenticated
    };

    createBookmarkProps = GetModalLinkProps.props(createBookmarkProps)
    editObjProps = GetModalLinkProps.props(editObjProps)
    createObjProps = GetModalLinkProps.props(createObjProps)

    let EditorModalBtn     = <OpenEditorBtn {...createObjProps}/>; 

    let PostUpVotersBtn = post.upvotes !== 0 &&   
                    <OpenUsersModalBtn {...postUpvotersProps}/>; 
   
    

    let btnsProps = {
        ...props,
        createObjProps,
        editObjProps,
        createBookmarkProps
    }; 

    let UpVoteBtn =  post.upvoted? <DownVotePostBtn {...btnsProps}/>
               : <UpVotePostBtn {...btnsProps}/>


   const btnsList   = { 
            itemsCounter : PostUpVotersBtn,
            btn1   : UpVoteBtn,
            btn2   : EditorModalBtn,
            btn3   : <OpenOptionlBtn {...btnsProps}/>,
            Styles : Styles
         };

   const userProps  = {
            obj   : post,
            currentUser
        };
  

    return (
        <div>
        { editorState?
            <div className="post-box">
                    <div className="post"> 
                        <div className="autor-details-box post-detail-box">
                            {props.isProfileBox?
                                ""
                                :
                                <UserComponentSmall {...userProps}/>
                            }
           
                        </div>
                        <ul className="answer-question-box">
                            { props.isPostBox? 
                                <li className="post-title">
                                    { post.add_title }
                                </li>
                                :

                                <li className="post-title">
                                    <Link to={{pathname: postPath, state }} 
                                          className="question-link">
                                        { post.add_title }
                                    </Link>
                                </li>
                            }
                        </ul>

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
                 
            :
            null
        }
        </div>
    );

};



export const PostPageComponent = props => {

   return (
        <div>

            { editorState?
                <div className="post-contents">
                    <div className="post-box">
                        <div className="post"> 

                            { props.isPostBox? 
                                <b className="">
                                   { props.post.add_title }
                  
                                </b>
                            :

                            <b className="">
                                <Link 
                                    to={{ pathname : props.postPath, state : props.state }}
                                    className="question-link">
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
            
            :
            ""

            }
        </div>
    );
}; 


export const PostListComponent = props => {

    return (
        <div className="post-list-page">
           { editorState?
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

                :
                ""
            }
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






