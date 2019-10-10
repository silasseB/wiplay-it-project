import React, { Component } from 'react';
import  AjaxLoader from "components/ajax-loader";
import  * as action  from 'actions/actionCreators';
import  * as types  from 'actions/types';
import {store} from "index";
import {Reply } from "components/reply_components";
import Api from 'api';


 
const api      = new Api();




class ReplyGreatGrandChildBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReplyGreatGrandChildBox : true,
            byId                     : '',
        };
    };


    componentDidMount() {
        var {reply}  = this.props;
        
        if (reply) {
            var { post } = this.props.props;
            
            var byId = '';

            if (post) {
                byId = `postReplyGreatGrandChild${reply.id}`;
            }else{
                byId = `answerReplyGreatGrandChild${reply.id}`;
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

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    } 

    componentDidUpdate(nextProps, prevState) {
      
    }; 
  
    getProps() {
        let props = {
           isReplyGreatGrandChildBox  : this.state.isReplyGreatGrandChildBox,
        }

        return Object.assign(props, this.props.props);
    };


    render() {

        let props       =  this.getProps();
        var replyParent =  this.props.reply;
        let byId        =  this.state.byId;
        var replies     =  props.entyties.replies;
        replies         =  replies.byId[byId]; 

        var apiUrl = '';

        if (props.isAnswerBox && replies) { 
           apiUrl = api.getAnswerReplyChildrenListApi(replyParent.id);

        }

        else{
            apiUrl = api.getPostReplyChildrenListApi(replyParent.id);
        }

        var linkProps = {
            actionType: types.GET_REPLY_CHILD_LIST,
            apiUrl    : apiUrl,
            byId,
            children  : replyParent.children,
        };   

        let replyStyles = {
            border     : 'px solid green',
            margin     : '15px 22px 10px 75px'
        };

        console.log(byId,replies, replyParent)

      
        return (
            <div>
                {replies?
                    <div>
                        { replies.showLink?
                           <div onClick={ () => props.getReplyChildrenList( linkProps ) }> 
                               <ul>
                                   <li>Click to view More</li>
                                   <li>{ replies.linkData.totalReplies }</li>
                                </ul>
                            </div>                   
   
                            :
  
                            <div>
                                { replies.isLoading?
                                    <div className="spin-loader-box">
                                        <AjaxLoader/>
                                    </div>

                                    :

                                    <div>

                                        <div>
                                            { replies.replyList.map( (reply, index) => {

                                                let replyProps = {
                                                       replyParent,
                                                       reply, 
                                                       replyStyles,
                                                       index,
                                                       byId,
                                                       props}
                                                
                                                return(

                                                    <div  key={props.index}>
                                                        <GraetGrandChildComponent {...replyProps}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
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


export default ReplyGreatGrandChildBox;






const GraetGrandChildComponent = props => {
    let { replyParent, reply } = props

    return(
            <div>
                { replyParent.id === reply.parent?

                    <div className="reply-great-grand-child-container">

                        <div className="reply-great-grand-child-contents">
                            <Reply {...props}/>
                        </div>

                        { reply.has_children?

                            <ReplyGreatGrandChildBox {...props}/>

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



