import React,{Component} from 'react';
import { withRouter } from "react-router";
import {handleSubmit, getUserList }  from "dispatch/index"
import { UserList } from "templates/author/profile-templates";
import  AjaxLoader from "templates/ajax-loader";
import {store } from "store/index";
import { MobileModalNavBar, DesktopModalNavBar } from  "templates/editor/editor-templates";
import { PageErrorComponent } from "templates/partial-components";
import Helper from 'utils/helpers';


import Api from 'utils/api';

const helper   = new Helper();

const api = new Api();


  

class UserListBox extends Component {
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            usersById         : `filteredUsers`,
            apiUrl            : '',
            modalTitle        : "Authors",
            isReloading       : false,
            users             : undefined,
            userListBoxStyles : undefined
        }
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onUserListUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let { entities }   = storeUpdate;
            let { users }   = entities && entities;
            let {usersById}     = this.state;

            console.log(users)
            let userList = users    && users[usersById]
            let error    = userList && userList.error; 
            let isReloading = userList && userList.isLoading;

            this.setState({users, isReloading, error})
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

  
    componentDidMount() {
        this.isMounted = true;
        this.onUserListUpdate();
        console.log(this.props)

        let { apiUrl, byId} = this.props;
        let {usersById}     = this.state;

        usersById  = byId   || usersById;
        apiUrl     = apiUrl || api.getUserListApi();

        let storeUpdate  = store.getState();
        let { entities } = storeUpdate;
        let { users }    = entities && entities;

        this.setState({usersById, apiUrl})
        
        !users[usersById] && store.dispatch(getUserList({usersById, apiUrl}))
                          || this.setState({users});
                
    }

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

    reLoader =()=>{

        let {apiUrl, usersById} = this.state;
        this.isMounted && this.setState({isReloading : true})
        return store.dispatch(getUserList({usersById, apiUrl}))
    };
    
    getProps(){
        return {
            ...this.props,
            ...this.state,
            reLoader : this.reLoader.bind(this),
            editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
        }
    };


    render() {
        var props = this.getProps()
        //console.log(props)
        var usersById = props.usersById;
        let users = props.users && props.users[usersById];
        console.log(users)
   
        return (
            <div>
                <div onScroll={this.handleScroll()} className="users-modal-container">
                    <UserListModalNavBar {...props}/>
                    { users &&
                        <div>
                            { users.isLoading &&
                                <div className="page-spin-loader-box">
                                    <AjaxLoader/>
                                </div>
                            }

                            { users.error &&
                                <PageErrorComponent {...props}/>
                            }

                            <UserList {...props}/>
                        </div>
                    }
                </div>
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
        let modalTitle;
        if (!usersLength) return '';
       
        if (isFollowers) {
            modalTitle = usersLength > 1 && `${usersLength || ''} Followers` ||
                                            `${usersLength || ''} Follower`;
            return modalTitle;

        }else if(isUpVoters){
            modalTitle = usersLength > 1 && `${usersLength | ''} Upvoters` ||
                                        `${usersLength} Upvoter`;
            return modalTitle;

        }else{
            return `Who to follow`;
        }
       
    }

    modalTitle  =  getModalTitle() || modalTitle || null;
    console.log(props,modalTitle)

    let navBarProps = {...props, modalTitle};

    if (window.matchMedia("(min-width: 900px)").matches) {
            return DesktopModalNavBar(navBarProps);
        } else {
            return MobileModalNavBar(navBarProps);
    } 
    
};
