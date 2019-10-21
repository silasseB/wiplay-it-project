import React, { Component } from 'react';

import  AjaxLoader from "../../components/ajax-loader";
import  * as action  from '../../actions/actionCreators';

import {  CommentsComponent } from "../../components/comment_components"
//import { UserComponentSmall } from "components/profile_components";
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import {pageMediaBlockRenderer} from '../../components/editor_components';
import {store} from "../../configs/store-config";







class CommentsBox extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isCommentBox  : true,
         commentById   : '',
         parent        : '',

      };
   
   };

   componentDidCatch(error, info) {
     // You can also log the error to an error reporting service
     console.log(error, info);
   };

   

   componentDidMount() {
      let { answer, post } = this.props;
            
      var parent      = post?post:answer;
      let comments    = parent.comments;
      var commentById = answer?`commentsAnswer${parent.id}`:`commentsPost${parent.id}`;
                           
      if (comments) {
         if (comments.length) {
            this.setState({commentById, parent});
            store.dispatch(action.getCommentLindData(commentById, comments));
         } 
      }
   };


   componentDidUpdate(nextProps, prevState) {
     
   } 
   
       
   getProps() {

      let props = {
         isCommentBox    : this.state.isCommentBox,
         parent       : this.state.parent,
         commentById  : this.state.commentById,
      }
      return Object.assign(props, this.props); 
   }


   render() { 
      let props  = this.getProps();
      var comments    = props.entyties.comments;
      comments = comments.byId[props.commentById]

       
      
      return (
         <div>
         {comments?
            <div>   
               { comments.showLink?
                  <CommentsLink {...props}/>
                  :
                  <div>
                     {comments.isLoading?
                        <div className="spin-loader-box">
                           <AjaxLoader/>
                        </div>
                        :
                        <div>
                           {props.answer?
                              <AnswerComments {...props}/>
                              :
                              ""
                           }
                                        
                           { props.post?
                              <PostComments {...props}/>
                              :
                              ""
                           }
                        </div> 
                     }
                  </div>  
               }
            </div>
            :
            ""
         }
         </div>

      )
   };
}


export default CommentsBox;


export const CommentsLink = props => {
   var byId = props.commentById;
   var comments    = props.entyties.comments;
   comments = comments.byId[byId]
   let styles ={
      border         : "px solid red",
      fontSize       : "11px",
      margin         : 0,
      padding        : 0,
      display        : 'flex',
      listStyleType  : 'none', 
   }
  

   let commentCountStyles ={
      fontSize : "11px",
      margin   : '10px',
   }
  
   var linkData = comments.linkData;

    return (
     <div  onClick={ () => props.getCommentList(byId) } className="comments-link">
        <Links {...linkData}/>
         <ul style={styles}>
            <li  style={commentCountStyles}>Click to View More Comments</li>
            <li  style={commentCountStyles}>
               {linkData.numOfComments}  Comments
            </li>
         </ul>
     </div>
   )
}




const AnswerComments = props => {
   
   var comments    = props.entyties.comments;
   comments = comments.byId[props.commentById]
   return (
      <div >
        
         { comments.commentList.map( (comment, index) => {
            let commentProps = {comment, index};  
            Object.assign(commentProps, props);
            return(
               <div  key={index} >
                  { props.answer.id === comment.answer?
                     <div className="comments-container">
                        <div className="comment-contents">
                           <CommentsComponent {...commentProps}/>
                        </div>
                     </div>  

                     : ""
                  } 
               </div>
            )
         })}
      

   </div>

   );
}






const PostComments = props => {
   var commentById = `commentsPost${props.post.id}`;
   var comments    = props.entyties.comments;
   comments       = comments.byId[commentById]
   return (
      <div>

      { comments.commentList.map( (comment, index) => {
          
       let commentProps = {comment, index};  
       Object.assign(commentProps, props)
       console.log(commentProps)

       return(
            <div  key={index}>
               { props.post.id === comment.post?
                  <div className="comments-container">
                     <div className="comment-contents">
                        <CommentsComponent {...commentProps}/>
                     </div>
                  </div>  

                  : ""
               } 
            </div>
         )
      }

      )}

   </div>

   );
}




export const Links = props => {
   let storedState = JSON.parse(props.comment.comment)
   const contentState = convertFromRaw(storedState);
   const editorState = EditorState.createWithContent(contentState);
  
   return (
      <div  className="comment-box" id="comment-box">
         <div className="user-box">
            
          </div>
    
         <div className="comment">
           <Editor
             blockRendererFn={pageMediaBlockRenderer}
             editorState={editorState} 
            readOnly={true} /> 
         </div>
      </div>
   )  
}