import React,{Component} from 'react';
import { withRouter } from "react-router";
import {handleSubmit, getUserList }  from "../../dispatch/index"
import { UserList } from "../../components/profile_components";
import  AjaxLoader from "../../components/ajax-loader";
import {store } from "../../configs/store-config";
import { MobileModalNavBar, DesktopModalNavBar } from  "../../components/editor_components";
import Helper from '../../containers/utils/helpers';


import Api from '../../api';

const helper   = new Helper();

const api = new Api();


  

class UserListBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersById         : `allUsersList`,
            modalTitle        : "Users",
            users             : undefined,
            userListBoxStyles : undefined
        }
    };

    onUserListUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let { entities }   = storeUpdate;
            let { users }   = entities && entities;
            console.log(users)

           this.setState({users})
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

  
    componentDidMount() {
        //console.log(this.props)
        this.onUserListUpdate();

        let { apiUrl, byId} = this.props;
        let usersById = !byId && this.state.usersById || byId;
        apiUrl        = !apiUrl && api.getUserListApi() || apiUrl;

        this.setState({usersById})
        
        store.dispatch(getUserList({usersById, apiUrl}));
                
    }

    componentWillUnmount() {
        this.unsubscribe();
          
            
    };

    editfollowersOrUpVoters = (params) =>{
        let { objName, obj } = params;

        var followers      = obj.followers || obj.profile && obj.profile.followers;
        params['formData'] = helper.createFormData({ followers });
        store.dispatch(handleSubmit(params)); 
    }

    handleScroll=(event)=>{
        let isDesktopScreenSize = window.matchMedia("(min-width: 900px)").matches;

        if (isDesktopScreenSize) {
            let modalContent   = document.getElementById('modal-content')
            let modalContentsRect = modalContent && modalContent.getBoundingClientRect();

            if (modalContent && modalContentsRect) {
                let modalOverlay              = document.getElementById('modal-overlay');

                let modalContentClientHeight  = parseInt(modalContent.clientHeight) + parseInt(modalContentsRect.top);
                console.log(modalContentClientHeight, modalOverlay.clientHeight)

                if (modalContentClientHeight >= modalOverlay.clientHeight - 30) {
                    let userListBox       = document.getElementById('user-list-box')
                    let usersListBoxStyles = editorsBox && {height:userListBox.clientHeight };

                    !this.state.userListBoxStyles &&  this.setState({userListBoxStyles})
                }
            
            }
        }

    };

    
    getProps(){
        let props = {
            ...this.state,
            editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
        };
        return {...this.props, ...props};
    };


    render() {
        var props = this.getProps()
        //console.log(props)
        var usersById = props.usersById;
        let users = props.users && props.users[usersById];
        //console.log(users)
   
        return (
            <div>
                {users?
                    <div onScroll={this.handleScroll()} className="users-modal-container">
                        <UserListModalNavBar {...props}/>

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



export default UserListBox;




const UserListModalNavBar = (props)=> {
    
    let {usersById, users, obj, modalTitle} = props

    users       = usersById && users && users[usersById];

    let usersLength = users && users.userList && users.userList.length;

    let isFollowers = obj && obj.hasOwnProperty('followers');
    let isUpVoters  = obj && obj.hasOwnProperty('upvotes');

    let getModalTitle =()=>{
       
        if (isFollowers) {
            return usersLength > 1 && `${usersLength} Followers` || `${usersLength} Follower`;

        }else{
            return usersLength > 1 && `${usersLength} Upvoters` || `${usersLength} Upvoter`;
        }
       
    }

    modalTitle  =  getModalTitle() || modalTitle;
    console.log(props,modalTitle)

    let navBarProps = {...props, modalTitle};

    if (window.matchMedia("(min-width: 900px)").matches) {
            return DesktopModalNavBar(navBarProps);
        } else {
            return MobileModalNavBar(navBarProps);
    } 
    
};
