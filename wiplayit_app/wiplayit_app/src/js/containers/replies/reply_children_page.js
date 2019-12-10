import React, { Component } from 'react';
import  AjaxLoader from "../../components/ajax-loader";
import {ReplyChildernComponent,ChildRepliesLink } from "../../components/reply_components";
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";





class ReplyChildrenBox extends Component {

  constructor(props) {
      super(props);

      this.state = {
         isReplyChildBox : true,
         byId            : '',
      };
   };

   componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

   componentDidMount() {
      var reply = this.props.reply; 
      
      if (reply) {
         var { post } = this.props.props;
            
         var byId = '';

         if (post) {
            byId = `postReplyChild${reply.id}`;
         }else{
            byId = `answerReplyChild${reply.id}`;
         }

         this.setState({byId});
         var props = {
            actionType : 'GET_REPLY_CHILD_LINK_DATA',
            reply,
            byId,
         }
         store.dispatch(action.getReplyChildLindData(props)); 
      }
     
   };
   
   componentDidUpdate(nextProps, prevState) {
      
   }; 
  
   getProps() {
      let props = {
         isReplyChildBox     : this.state.isReplyChildBox,
         childParent        : this.props.reply,
         replyChildrenById  : this.state.byId,
      } 
      return Object.assign(props, this.props.props);
   };



   render() { 
      let props      = this.getProps();
      var replies    =   props.entities.replies;
      replies        =  replies[props.replyChildrenById];
      console.log(replies)
               
      return (
         <div>
         {replies?
            <div>
               { replies.showLink?
                  <ChildRepliesLink {...props}/>
                  :
                  <div>
                     { replies.isLoading?
                        <div className="spin-loader-box">
                           <AjaxLoader/>
                        </div>
                     :
                        <div>
                           <ReplyChildernComponent {...props}/>
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
};


export default ReplyChildrenBox;



