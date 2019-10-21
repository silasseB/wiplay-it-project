import React,{Component} from 'react';
import withHigherOrderIndexBox from "containers/index/higher_order_index";

import { UserList } from "components/profile_components";
import {PartalNavigationBar} from "components/navBar";
import  AjaxLoader from "components/ajax-loader";


import Api from 'api';

const api = new Api();


  

class UserListBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersById : `allUsersList`,
            pageName       : "",
        }
    };
  
  
    componentDidMount() {
        console.log(this.props)
                
        let { state }      = this.props.location;

        if (state) {
        let usersProps = {};

        state['pageName']  = 'Upvoters'; 
        state['apiUrl']    = api.getUserListApi();
        state['usersById'] = this.state.usersById;

        
        console.log(state)

        switch(state.usersIsFor){
            case 'userProfileFollowers' :
            case 'userProfileFollowings':

                usersProps = this.updateUserFollowersProps(state);
                this.updateLocalstate(usersProps);
                return this.props.getUserList(usersProps);


            case 'questionFollowers':

                usersProps = this.updateQuestionFollowersProps(state);
                this.updateLocalstate(usersProps);
                return this.props.getUserList(usersProps);

           


            case 'answerUpVoters':

                usersProps = this.updateAnswerUpVotersProps(state);
                this.updateLocalstate(usersProps);
                return this.props.getUserList(usersProps);



            case 'answerCommentUpVoters':
            case 'postCommentUpVoters'  :

                usersProps = this.updateCommentUpVotersProps(state);
                this.updateLocalstate(usersProps);
                return this.props.getUserList(usersProps);

            case 'answerReplyUpVoters':
            case 'postReplyUpVoters'  :

                usersProps = this.updateReplyUpVotersProps(state);
                this.updateLocalstate(usersProps);
                return this.props.getUserList(usersProps);


            case 'postUpVoters':

                usersProps = this.updatePostUpVotersProps(state);
                this.updateLocalstate(usersProps);

                return this.props.getUserList(usersProps); 


            default:
                state['pageName'] = 'users';

                this.updateLocalstate(state);
                return this.props.getUserList(state);
                
        }

    }

    };

    updateLocalstate(state){
       this.setState(state);
    }

    updateUserFollowersProps(params ){
        var { userProfile, usersById, usersIsFor, apiUrl, pageName, } = params;
        switch(usersIsFor){

            case 'userProfileFollowings':

                pageName  = 'Followings';
                usersById = `userProfileFollowings${userProfile.id}`;
                apiUrl    = api.getUserFollowingsListApi(userProfile.id);

                return { pageName, usersById, apiUrl};

            default:
               
                pageName  = 'Followers';
                usersById = `userProfileFollowers${userProfile.id}`;
                apiUrl     = api.getUserFollowersListApi(userProfile.id)
                return { pageName, usersById, apiUrl};
        };

       
    };
      
   

    updateQuestionFollowersProps( params ) {

       var  { question, usersById, apiUrl, pageName } = params

        pageName = 'Followers';
        usersById = `questionFollowers${question.id}`;
        apiUrl  = api.getQuestionFollowersListApi(question.id);

        return { usersById, apiUrl, pageName };
    };


    updatePostUpVotersProps( params ){

        var { post, usersById, apiUrl } = params;

        usersById = `postUpVoters${post.id}`;
        apiUrl    = api.getPostUpVotersListApi(post.id);
       
        return { usersById, apiUrl };
    };

    updateAnswerUpVotersProps(params){

        var {answer, usersById, apiUrl } = params;

        usersById = `postUpVoters${answer.id}`;
        apiUrl    = api.getAnswerUpVotersListApi(answer.id);

        return { usersById, apiUrl};
      
    };

    updateCommentUpVotersProps(params){

        var {comment, usersIsFor, usersById, apiUrl} = params;

        switch(usersIsFor){

            case 'postCommentUpVoters':

                usersById = `postCommentUpVoters${comment.id}`;
                apiUrl    = api.getPostCommentUpVotersListApi(comment.id)
                return { usersById, apiUrl};

            default:

                usersById  = `answerCommentUpVoters${comment.id}`;
                apiUrl     = api.getAnswerCommentUpVotersListApi(comment.id)
                return { usersById, apiUrl};


        }
        
    };

    updateReplyUpVotersProps(params){
        var {reply, usersIsFor, usersById, apiUrl} = params;

        switch(usersIsFor){

            case 'postReplyUpVoters':

                usersById = `postReplyUpVoters${reply.id}`;
                apiUrl    = api.getPostReplyUpVotersListApi(reply.id)
                return { usersById, apiUrl};

            default:
            
                usersById  = `answerReplyUpVoters${reply.id}`;
                apiUrl     = api.getAnswerReplyUpVotersListApi(reply.id)
                return { usersById, apiUrl};


        }

            
    }


    getProps(){
        let props = {
            pageName       : this.state.pageName,
            usersById      : this.state.usersById,
        };
        return Object.assign(props, this.props);
    };

    render() {
        var props = this.getProps()
        console.log(props)
        var usersById = props.usersById;
        const users = props.entyties.users.byId[usersById];
        //userProfile = userProfile.user;
        console.log(users)
   
        return (
            <div>
                <PartalNavigationBar {...props}/>
                {users?
                    <div>
                        {users.isLoading?
                            <div className="page-spin-loder-box">
                                <AjaxLoader/>
                            </div>

                            :

                            <div style={{ paddingTop : '70px'}}>
                                <UserList {...props}/>
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



export default withHigherOrderIndexBox(UserListBox);






