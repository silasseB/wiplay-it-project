import React,{Component} from 'react';
import withHigherOrderIndexBox from "containers/index/higher_order_index";

import { UserList } from "components/profile_components";
import {PartalNavigationBar} from "components/navBar";
import  AjaxLoader from "components/ajax-loader";


import Api from 'utils/api';

const api = new Api();


  

class UserListBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersById : `allUsersList`,
            pageName       : "Users",
        }
    };
  
  
    componentDidMount() {
        console.log(this.props)
        let { apiUrl, byId} = this.props;
        usersById = !usersById && this.state.usersById || byId;
        apiUrl    = !apiUrl && api.getUserListApi() || apiUrl;
        this.setState({usersById})
        
        this.props.getUserList({usersById, apiUrl});
                
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
        const users = props.entities.users[usersById];
        //userProfile = userProfile.user;
        console.log(users)
   
        return (
            <div>
                <PartalNavigationBar {...props}/>
                {users?
                    <div className="app-box-container">
                        {users.isLoading?
                            <div className="page-spin-loader-box">
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



export default withHigherOrderIndexBox(UserListBox);






