import React,{Component} from 'react';
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import { UserList } from "../../components/profile_components";
import {PartalNavigationBar} from "../../components/navBar";
import  AjaxLoader from "../../components/ajax-loader";


import Api from '../../api';

const api = new Api();


  

class PostCommentUpVotersBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersById : '',
            pageName  : 'Upvoters',
        }
    };
  
  
    componentDidMount() {
        console.log(this.props)
                
        let { state }      = this.props.location;
        let { slug, id } = this.props.match.params; 
        
        let usersById = `postCommentUpVoters${id}`;
        let apiUrl    = api.getPostCommentUpVotersListApi(id)
        
        this.setState({usersById})

        this.props.getUserList({usersById, apiUrl});
                
    };

    

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
        const users = props.entities.users[usersById];
        //userProfile = userProfile.user;
        //console.log(users)
   
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



export default withHigherOrderIndexBox(PostCommentUpVotersBox);






