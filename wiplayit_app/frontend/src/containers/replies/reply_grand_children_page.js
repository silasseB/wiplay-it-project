import React, { Component } from 'react';
import  AjaxLoader from "components/ajax-loader";
import {ReplyGrandChildernComponent,GrandChildRepliesLink  } from "components/reply_components"
import  * as action  from 'actions/actionCreators';
import {store} from "index";



class ReplyGrandChildrenBox extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isReplyGrandChildBox : true,
         byId                 : '',
      };
   };

   componentDidCatch(error, info) {
      // You can also log the error to an error reporting service
      console.log(error, info);
   }

   componentDidMount() {
      console.log(this.props)
      var reply    = this.props.reply;
      var { post } = this.props.props;

      if (reply) {
         
         var byId  = '';

         if (post) {
             byId = `postReplyGrandChild${reply.id}`;
         }else{
             byId = `answerReplyGrandChild${reply.id}`;
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
         isReplyGrandChildBox  : this.state.isReplyGrandChildBox,
         grandChildParent      : this.props.reply,
         grandChildById        : this.state.byId,
      } 
      return Object.assign(props, this.props.props);
   };



   render() { 
     
      let props      =   this.getProps();
      var replies    =   props.entyties.replies;
      replies        =   replies.byId[props.grandChildById];
      console.log(replies) 
      
      return (
         <div>
         {replies?
            <div>
               { replies.showLink?
                  <GrandChildRepliesLink {...props}/>
                  :
                  <div>
                     { replies.isLoading?
                        <div className="spin-loader-box">
                           <AjaxLoader/>
                        </div>
                     :
                        <div>
                           <ReplyGrandChildernComponent {...props}/>
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
};




export default ReplyGrandChildrenBox;



