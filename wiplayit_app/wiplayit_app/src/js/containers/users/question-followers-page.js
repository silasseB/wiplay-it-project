import React,{Component} from 'react';
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import { UserList } from "../../components/profile_components";
import {PartalNavigationBar} from "../../components/navBar";
import  AjaxLoader from "../../components/ajax-loader";


import Api from '../../api';

const api = new Api();


  

class QuestionFollowersBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersById : '',
            pageName  : 'Followers',
        }
    };
  
  
    componentDidMount() {
                       
        let { slug, id } = this.props.match.params; 
        
        let usersById = `questionFollowers${id}`;
        let apiUrl    = api.getQuestionFollowersListApi(id);
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
        
        var usersById = props.usersById;
        const users = props.entities.users[usersById];
        
   
        return (
            <div>
                <PartalNavigationBar {...props}/>
                {users?
                    <div className="app-box-container">
                        {users.isLoading?
                            <div className="page-spin-loder-box">
                                <AjaxLoader/>
                            </div>

                            :

                            <div>
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



export default withHigherOrderIndexBox(QuestionFollowersBox);






