
import React from 'react';
import {  Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { SubmitBtn,
         SmsCodeModalBtn,
         OpenUsersModalBtn,
         ModalCloseBtn,
         OpenEditorBtn  } from "templates/buttons";
import { ModalManager, Modal}   from  "components/modal/modal-container";
import { GetModalLinkProps } from "templates/component-props";
import { store } from "store/index";
import { showModal } from 'actions/actionCreators';
import { history } from "App"
import * as Icon from 'react-feather';

let editorLinkMobileStyles = {
        background : '#A33F0B !important',
        color      : '#fefefe', 
        border     : '1px solid blue',
        marginTop  : '7px',  
        fontWeight : 'bold',
        fontSize   : '12px',
        display    : 'flex',
        maxWidth   : '100%',
        width      : '100px', 
        
    }

let editorLinkDesktopStyles = {
       background  : '#A33F0B',
       color       : '#fefefe',
       height      : '30px',
       margin      : '15px 7px 0',
       fontWeight  : 'bold',
    }

let createPostProps = {
        objName     : 'Post',
        linkName    : 'Add Post',
        isPost      : true,
        withTextArea: true,
        className   : "create-post-btn btn",
        editorLinkDesktopStyles,
        editorLinkMobileStyles,
    };

let createQuestionProps = {
        objName      : 'Question',
        isPost       : true,
        withTextArea :true,
        linkName     : "Ask Question",
        className    : "create-question-btn btn",
        editorLinkMobileStyles,
        editorLinkDesktopStyles,
    };


createQuestionProps = GetModalLinkProps.props(createQuestionProps);
createPostProps = GetModalLinkProps.props(createPostProps);


export const NavBarMenuItems = props => {
    let {currentUser, isAuthenticated} = props;
    let profile = currentUser && currentUser.profile;
          
    let state = {userProfile : currentUser, isAuthenticated};
    
    let pathToProfile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
    let toProfileProps = {pathname:pathToProfile, state}
 
    return(
        <BrowserRouter>

        <div>

            <div id="" className="menu-img-container">
                <div className="menu-img-box" 
                     onClick={() => RedirectMenuLinks(toProfileProps)}> 
                        { profile && profile.profile_picture?
                            <img alt="" 
                                 src={profile.profile_picture} 
                                 className="menu-img"/>
                            :
                            <img alt="" 
                                 src={require("media/user-image-placeholder.png")} 
                                 className="menu-img"/> 

                        }
                </div>

                <ul className="menu-username-box">
                    <li className="menu-username"  
                        onClick={() => RedirectMenuLinks(toProfileProps)}>
                        {currentUser && currentUser.first_name} {''} 
                        {currentUser && currentUser.last_name} 
                    </li>
                    <li className="menu-user-credential" >
                        {profile && profile.credential} 
                    </li>
                </ul>
            </div>
            <div className="menu-btn-container">
                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/help/'})}
                        className="btn dropdown-item">
                    Help
                </button>
                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/feedback/'})}
                        className="btn dropdown-item">
                    Feedback
                </button>

                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/bookmarks/'})}
                        className="btn dropdown-item">
                    Bookmarks
                </button>


                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/settings/'})}
                        className="btn dropdown-item">
                    Settings
                </button> 

                <button className="button"
                        onClick={() => RedirectMenuLinks({pathname:'/about/'})}
                        className="btn dropdown-item">
                    About
                </button>   

                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/privacy/'})}
                        className="btn dropdown-item">
                    Privacy
                </button>  
                 <div className="dropdown-divider"></div>
            
                <button  onClick={props.logout} className="btn logout-btn">Logout</button>
            </div>
        </div>
        </BrowserRouter>
    )
}


export const RedirectMenuLinks = props => {
    let {pathname, state} = props;

    let storeUpdate  = store.getState();
    let { entities } = storeUpdate;
    let { modal }    = entities;
    let navigationMenuModal = modal && modal['navigationMenu'];

    if (navigationMenuModal && navigationMenuModal.modalIsOpen ) {
        window.history.back() 

        return setTimeout(()=> {
            history.push(pathname, state); 
        }, 500);
    }

    history.push(pathname, state);

};

const NavBarDropDown = props => {
    let { currentUser } = props;
    let profile = currentUser && currentUser.profile;
          
    let state = {userProfile:currentUser};
    
    let path_to_profile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
 
    return(
        
        <div className="navigation-img-box">
                    
            <div className="dropleft" id="navBardropdown" 
                           data-toggle="dropdown"
                           aria-haspopup="false" 
                           aria-expanded="true">
                <div className="nav-bar-img-box"> 
                    { profile && profile.profile_picture?
                        <img alt="" 
                             src={profile.profile_picture}
                             className="nav-bar-img"/>
                        :
                        <img alt=""
                             src={require("media/user-image-placeholder.png")}
                             className="nav-bar-img"/> 

                    }
                </div>
            </div>
            
            <div
                id=""
                className="dropdown-menu nav-dropdown-menu"
                aria-labelledby="navBardropdown">
                <NavBarMenuItems {...props}/>
                
            </div>
           
        </div>
    )
}

export const NavBarMenuModalItems = props =>{
     
    return(
        <div className="">
            <div className="nav-bar-menu-header">
                <ul className="nav-bar-menu-title-box">
                    <li>Your Account</li>
                </ul>

                <button type='button' 
                        onClick={()=>{
                            window.history.back();
                            ModalManager.close('navigationMenu')
                        }}

                        className="btn-sm nav-bar-menu-close-btn">
                    <span className="dismiss-nav-bar-menu-icon">&times;</span>
                </button>
            </div>
            <div className="nav-bar-modal-menu-box">
                <NavBarMenuItems {...props}/>
            </div>
        </div>
    )

}


const NavBarModalMenu = props => {
    let { currentUser, logout} = props;
    if (!currentUser) return null;

    let profile = currentUser.profile;
    
    let modalProps = {
            ...props,
            modalName   : 'navigationMenu', 
        };

    return(
        
        <div className="navigation-img-box "
             onClick={()=> Modal(modalProps)}>
                    
            <div className="nav-bar-modal-menu" id="nav-bar-modal-menu">
                <div className="nav-bar-img-box"> 
                    { profile && profile.profile_picture?
                        <img alt="" 
                             src={profile.profile_picture} className="nav-bar-img"/>
                        :
                        <img alt=""
                             src={require("media/user-image-placeholder.png")}
                             className="nav-bar-img"/> 

                    }
                </div>
            </div>
        </div>
    )
}



export const NavBarSmallScreen = props => {
    let {isAuthenticated, currentUser} = props;
    
    createPostProps     = {
        ...createPostProps,
        currentUser,
        isAuthenticated,
    };

    createQuestionProps = {
        ...createQuestionProps,
        currentUser,
        isAuthenticated,
    };

    let styles = {
        width     : '100%',
        border    : 'px solid red',
        
    };

    let modalProps = {
            userListProps : {currentUser, isAuthenticated},
            modalName     : 'userList', 
        }; 
    let state = { modalProps } 
    
    return (
		<nav  className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light"
              id="navigation-mobile">
            <div style={{display:'flex'}} className="navbar-contents-top">
                <ul className="navbar-feedback-box">
                    <button type="button"
                             onClick={() => RedirectMenuLinks({pathname:'/feedback/'})}
                             className="btn-sm navbar-feedback-btn">
                        Feedback
                    </button>
                    
                </ul>
                <ul className="logo-contents">
                    <li>Wiplayit</li>
                </ul>
                
                <ul className="navigation-img-item">
                     <NavBarModalMenu{...props}/>
                </ul>
            </div>

            <div className="mobile-navbar-center">
                <div className="mobile-navbar-bottom-contents">
                    <ul className="add-question-box">
                        <li className="">
                            <OpenEditorBtn {...createQuestionProps}/>
                        </li>
                    </ul>
                    <ul className="add-post-box">
                        <li className="">
                            <OpenEditorBtn {...createPostProps}/>
                        </li>
                    </ul>
                </div>
            </div>
            
        </nav>
    ); 
};




export const NavBarBigScreen = props => {
    var {currentUser, isAuthenticated}       = props;
    let path_to_profile     = `/`;
   
    let pathToProfile = currentUser  &&
                        `/profile/${currentUser.id}/${currentUser.slug}/`;
    let userProfile   = currentUser  && currentUser.profile;
      

    createPostProps     = {
            ...createPostProps,
            currentUser,
            isAuthenticated,
    };

    createQuestionProps = {
        ...createQuestionProps,
        currentUser,
        isAuthenticated,
    };
    
    let modalProps = {
            userListProps : {currentUser, isAuthenticated},
            modalType     : 'userList', 
        }; 

    let state = { 
        background : props.location,
        modalProps
    } 

    let madalParams = {
        boolValue   : true,
        modalType   : 'userList',
        background  : props.location,
    }
    let pathname = `/compose/${'user'}/${1}/`;

    return(
			
        <nav className="navigation fixed-top" id="navigation">
            <div className="navigation-box">
                <div className="navigation-menu">
                    <div id="logo-img-contents">
                        <div className="logo-img-box" 
                             onClick={() => RedirectMenuLinks({pathname:'/'})}>
                            <img alt="" 
                                 src={require("media/logo.png")}
                                 className="logo-img"/>
                        </div>
        
                    </div> 


                    <div className="nav-menu">
                        <NavigationMenuBtns {...props}/>
                    </div> 
                           
                    <NavBarDropDown {...props}/>
                    <div className="post-question-box">
                        <div className="post-question-btn-box">
                            <ul className="create-question-btn-box">
                                <OpenEditorBtn {...createQuestionProps}/>
                            </ul>
    
                            <p>Or</p>
                            <ul className="create-post-btn-box">
                                <OpenEditorBtn {...createPostProps}/>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
        </nav>
    );
};


export const NavBarBottomTemplate = props =>{
     
    
    return (
        <div className="navigation-bar-mobile">
            <NavigationMenuBtns {...props}/>
        </div>
        )
}

export const NavigationMenuBtns =(props)=>{
    let {homeTab,
         questionListTab,
         usersTab,
         currentUser,
         isAuthenticated,
         notificationsTab} = props || {};

    return(
        <div className="navbar-bottom-menu">
            <ul  className="navbar-bottom-item">
                <button type="button"
                        style={homeTab}
                        onClick={() => RedirectMenuLinks({pathname:'/'})}
                        className="btn-sm navbar-bottom-btn">
                        <Icon.Home id="feather-home" size={20} {...homeTab}/>
                        Home
                    </button> 
                </ul>

                <ul  className="navbar-bottom-item">
                    <OpenUsersModalBtn {...{currentUser, isAuthenticated}}>
                        <Icon.Users id="feather-users" size={20} {...usersTab}/>
                        People
                    </OpenUsersModalBtn>
                </ul>

                <ul className="navbar-bottom-item">
                    <button type="button"
                            style={questionListTab}
                             onClick={() => RedirectMenuLinks({pathname:'/questions/'})}
                             className="btn-sm navbar-bottom-btn answer-question-btn">
                        <Icon.Edit 
                            id="feather-edit"
                            size={20}
                            {...questionListTab}
                        />
                        Answer
                    </button>
                </ul>
                

                <ul  className="navbar-bottom-item">
                    <button type="button"
                            style={notificationsTab}
                             onClick={() => RedirectMenuLinks({pathname:'/notifications/'})}
                             className="btn-sm navbar-bottom-btn notifications-btn">
                        <Icon.Bell 
                            id="feather-bell"
                            size={20}
                            {...notificationsTab}
                            />
                         Notifications
                    </button>
                </ul> 
            </div> 
    )
}


export const PartialNavBar = props =>{
   //console.log(props)
   var {currentUser, isAuthenticated } = props;

   let path_to_profile = `/`;
   let userProfile = {};
   const state     = {currentUser};
   
   if (currentUser) {
      path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
      userProfile     = currentUser.profile;
   }


       
    return (
        <nav className="navigation partial-page-navbar fixed-top" id="navigation">
            <div className="partial-navbar-back-btn-box">
                <button className="btn-sm" onClick={()=> window.history.back()}> 
                    <Icon.ArrowLeft
                        className="nav-bar-arrow-icon"
                        id="arrow-left" 
                        size={20}/>
                </button>  
            </div>

            <div className="page-name-box">
                <b className="page-name">{props.pageName}</b>  
            </div>
         
            <div className="navigation-img-item">
                { isAuthenticated &&
                    <NavBarModalMenu {...props}/>
                }
            </div>
        </nav>
    );

};



export const NavigationBarBottom = MatchMediaHOC(
                                      NavBarBottomTemplate, 
                                      '(max-width: 980px)'
                                    );

export const PartalNavigationBar = MatchMediaHOC(
                                     PartialNavBar,
                                     '(max-width: 980px)'
                                    );

export const NavigationBarBigScreen = MatchMediaHOC(
                                           NavBarBigScreen,
                                           '(min-width: 980px)'
                                        );
export const NavigationBarSmallScreen = MatchMediaHOC(
                                           NavBarSmallScreen, 
                                           '(max-width: 980px)'
                                        );



export const EditProfileNavBar = props  => {

    let {submitting, userProfile } = props;
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    let fieldSetStyles     = submitting? {opacity:'0.60'}:{};

    const BackBtn = () => {
        let backButton;
        if (window.matchMedia("(min-width: 980px)").matches) {
            backButton =
                <ModalCloseBtn> 
                    <Icon.X 
                        className="nav-bar-arrow-icon"
                        id="arrow-left"
                        size={20}
                    />
                </ModalCloseBtn>  
            
        }else{

            backButton = <CustomBackBtn/>;
        }

        return backButton
    }

    
    return(
        <nav className="partial-form-navbar edit-profile-navbar fixed-top"> 

            <div className="partial-navbar-back-btn-box">
               <BackBtn {...props}/>
	        </div>

            <div className="page-name-box">
                <b className="page-name">Edit Profile</b>  
            </div>

	        <div className="submit-profile-btn-box">
		        <button type="submit" 
                        style={submitButtonStyles} 
                        disabled={submitting}
                        onClick={()=> props.submit(props.submitProps)}
                        value="submit" className="btn-sm  submit-profile-btn">
                    Submit
                </button>
	        </div>
        </nav>
            
    )
};



export const CustomBackBtn = props => {

    return(
        <button type="button" 
              onClick={()=>window.history.back()} 
              className="btn-sm custom-back-bt nav-bar-back-bt" >
            <Icon.ArrowLeft 
                className="nav-bar-arrow-icon"
                id="arrow-left"
                size={20}
            />
        </button>  
  );
}




export const ModalNavBar = props => {
    return(
      <EditorNavBar title={ <SubmitBtn handleSubmit={props.handleSubmit}/> } />
  );
}




export const HelpPageNavBar = props => {
        
        
    return(
        <nav className="navigation fixed-top" id="help-navigation">
            <div className="help-navigation-box">
                <ul className="help-logo-contents"
                    onClick={()=>RedirectMenuLinks({pathname:'/'})} >
                    <li>Wiplayit</li>
                </ul>
                <div className="help-menu-box">
                    <HelpDropDownMenu/>
                    <HelpMenu/>
                </div>
            </div>
        </nav>
    );
};

const HelpNavBarMenuItems = () => {

    return (
        <div className="help-menu-contents">
            <button type="button help-menu-items" 
                    onClick={()=>RedirectMenuLinks({pathname:'/bug/report/'})} 
                    className="btn-sm help-menu-items">
                Report a bug
            </button>  
            <button type="button" 
                    onClick={()=>RedirectMenuLinks({pathname:'/feedback/'})} 
                    className="btn-sm help-menu-items">
                Feedback
            </button> 
            <button type="button" 
                    onClick={()=>RedirectMenuLinks({pathname:'/contact/us/'})} 
                    className="btn-sm help-menu-items">
                Contact us
            </button> 
        </div>
    )

};


const BigScreenHelpMenu = props => {
 
    return(
        <div className="">
            <HelpNavBarMenuItems/>
        </div>
    )
}



const SmallScreenHelpMenu = props => {
 
    return(
        <div className="help-dropdown-box">
            <div className="droplet"
                 id="helpNavBarDropdown" 
                 data-toggle="dropdown"
                 aria-haspopup="false" 
                 aria-expanded="true">
                <button type="button" className="menu-tooggle-btn">
                    <Icon.Menu className="menu-toggle-icon" size={30}/>
                </button>
            </div>
            
            <div className="dropdown-menu help-dropdown-menu"
                 aria-labelledby="helpNavBarDropdown">
                <HelpNavBarMenuItems/>
            </div>
        </div>
    )
};

const HelpMenu         = MatchMediaHOC(BigScreenHelpMenu,'(min-width: 980px)');
const HelpDropDownMenu = MatchMediaHOC(SmallScreenHelpMenu,'(max-width: 980px)');





