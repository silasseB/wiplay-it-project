import React,{Component} from 'react';
import { withRouter } from "react-router";
import {handleSubmit, getUserList }  from "dispatch/index"
import { UserList } from "templates/author/profile-templates";
import  AjaxLoader from "templates/ajax-loader";
import {store } from "store/index";
import { MobileModalNavBar, DesktopModalNavBar } from  "templates/editor/editor-templates";
import { PageErrorComponent } from "templates/partial-components";
import Helper from 'utils/helpers';
import {handleModalScroll} from 'components/modal/helpers';
import {history} from "App";
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
            onScroolStyles    : undefined,
        }
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onUserListUpdate = () =>{
        if (!this.isMounted) return;
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let { entities }   = storeUpdate;
            let { users }   = entities && entities;
            let {usersById}     = this.state;

            console.log(users)
            let userList = users    && users[usersById]
            let error    = userList && userList.error; 
            let isReloading = userList && userList.isLoading;

            this.isMounted && this.setState({users, isReloading, error})
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
        if (!this.isMounted) return;
        
        let isDesktopScreenSize = window.matchMedia("(min-width: 980px)").matches;
        let overlay      = document.getElementById('modal-overlay');
        if (isDesktopScreenSize) {
            overlay = overlay.clientHeight - 150;
            this._SetScrooll(overlay);

        }else{
            let isAtBottom       = handleModalScroll();
            console.log(isAtBottom, overlay.clientHeight)

            if (isAtBottom) {
                overlay = overlay.clientHeight - 40;
                this._SetScrooll(overlay);
            }

        }
    };

    _SetScrooll=(overlay)=>{
        let {onScroolStyles, users} = this.state;
        if (!onScroolStyles) {
            onScroolStyles =  {
                        height : overlay,
                        overflowY:'scroll'
                    };
            this.setState({onScroolStyles});
        }

    }

    redirectToUserProfile(params){
        let path = params && params.path;
        let state = params && params.state;

        if (path) {
            window.history.back()
            setTimeout(()=>  history.push(path, state), 500)
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
            redirectToUserProfile: this.redirectToUserProfile.bind(this),
            editfollowersOrUpVoters : this.editfollowersOrUpVoters.bind(this),
        }
    };


    render() {
        if (!this.isMounted) return null;
        let props = this.getProps()
        let {usersById,
             onScroolStyles,
             users} = props;

        users = users && users[usersById];
        onScroolStyles = onScroolStyles || {};
         
        return (
            <div 
                id="users-modal-container"
                className="users-modal-container">
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
                        { users.userList &&
                            <div onScroll={this.handleScroll()}
                                style={onScroolStyles} 
                                className="user-list-container"
                                id="user-list-container"
                                >
                                <UserList {...props}/>
                            </div>
                        }
                    </div>
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
    let navBarProps = {...props, modalTitle};

    if (window.matchMedia("(min-width: 900px)").matches) {
            return DesktopModalNavBar(navBarProps);
        } else {
            return MobileModalNavBar(navBarProps);
    } 
    
};
