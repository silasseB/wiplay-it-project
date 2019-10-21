import React, { Component } from 'react';
import  AjaxLoader from "../../components/ajax-loader";
import { RepliesComponent,CommentsReplyLink } from "../../components/reply_components"
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";








class RepliesBox extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isReplyBox : true,
         
      };
   };

     
   componentDidMount() {
      let { comment } = this.props; 
      var replies  = comment.replies;
      let byId = '';
      
      if (replies.length) {
         if (comment && comment.answer) {
            byId = `answerReplies${comment.id}`;
         }else{
            byId = `postReplies${comment.id}`;
         }

         this.setState({byId});
         var props = {
            actionType : 'GET_REPLY_LINK_DATA',
            replies,
            byId,
         }
         store.dispatch(action.getRepliesLindData(props)); 
      }
     
   };

   componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

   componentDidUpdate(nextProps, prevState) {
   }; 
   

   getProps() {
      let props = {
         isReplyBox  : this.state.isReplyBox,
         replies     : this.props.comment.replies,
         repliesById : this.state.byId,
      } 
      return Object.assign(props, this.props);
   };


   render() { 
      let props  = this.getProps();
      //var replyState = props.replyState;
      var replies    =   props.entyties.replies;
      replies        =  replies.byId[props.repliesById];
                 
      return (
         <div>
         {replies?
            <div>
            { replies.showLink?
               <CommentsReplyLink {...props}/>
                     :
                     <div>
                        { replies.isLoading?
                           <div className="spin-loader-box">
                              <AjaxLoader/>
                           </div>
                           :
                           <div>
                              <RepliesComponent {...props}/>
                           </div>
                        }
                     </div>
                  }
            </div>
         :
         ""
         }
         </div>
      );
   };
}


export default RepliesBox;





