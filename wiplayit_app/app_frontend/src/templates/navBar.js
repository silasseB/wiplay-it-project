
import React from 'react';
import {  Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { SubmitBtn,
         ModalCloseBtn,
         OpenEditorBtn  } from "templates/buttons";

import { ModalManager,Modal}   from  "components/modal/modal-container";
import { GetModalLinkProps } from "templates/component-props";
import { store } from "store/index";
import { showModal } from 'actions/actionCreators';
import { history } from "App" 


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
        className   : "create-post-btn btn-sm",
        editorLinkDesktopStyles,
        editorLinkMobileStyles,
    };

let createQuestionProps = {
        objName   : 'Question',
        isPost    : true,
        linkName  : "Ask Question",
        className : "create-question-btn btn-sm",
        editorLinkMobileStyles,
        editorLinkDesktopStyles,
    };


createQuestionProps = GetModalLinkProps.props(createQuestionProps);
createPostProps = GetModalLinkProps.props(createPostProps);


export const NavBarMenuItems = props => {
    //console.log(props)
    let { currentUser } = props;

    let profile = currentUser && currentUser.profile;
          
    let state = {userProfile : currentUser};
    
    let pathToProfile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
    let toProfileProps = {pathname:pathToProfile, state}
 
    return(
        <BrowserRouter>

        <div>

            <div className="menu-img-container">
                <div className="menu-img-box" onClick={() => RedirectMenuLinks(toProfileProps)}> 
                        { profile && profile.profile_picture?
                            <img alt="" src={profile.profile_picture} className="menu-img"/>
                            :
                            <img alt="" src={require("media/user-image-placeholder.png")} className="menu-img"/> 

                        }
                </div>

                <ul className="menu-username-box">
                    <li className="menu-username"  
                        onClick={() => RedirectMenuLinks(toProfileProps)}>
                        {currentUser && currentUser.first_name}  {currentUser && currentUser.last_name} 
                    </li>
                    <li className="menu-user-credential" >
                        {profile && profile.credential} 
                    </li>
                </ul>
            </div>
            <div className="menu-btn-container">
                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/help/'})}
                        className="btn-sm dropdown-item">
                    Help
                </button>
                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/feedback/'})}
                        className="btn-sm dropdown-item">
                    Feedback
                </button>

                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/settings/'})}
                        className="btn-sm dropdown-item">
                    Settings
                </button> 

                <button className="button"
                        onClick={() => RedirectMenuLinks({pathname:'/about/'})}
                        className="btn-sm dropdown-item">
                    About
                </button>   

                <button type="button"
                        onClick={() => RedirectMenuLinks({pathname:'/privacy/'})}
                        className="btn-sm dropdown-item">
                    Privacy
                </button>   
                
                <button  onClick={props.logout} className="btn-sm logout-btn">Logout</button>
            </div>
        </div>
        </BrowserRouter>
    )
}


export const RedirectMenuLinks = props => {
    let {pathname, state} = props;

    if (window.matchMedia("(max-width: 980px)").matches) {
        window.history.back() 
    }

    return setTimeout(()=> {
        history.push(pathname, state); 
        }, 500);
    
};

const NavBarDropDown = props => {
    let { currentUser } = props;
    let profile = currentUser && currentUser.profile;
          
    let state = {userProfile:currentUser};
    
    let path_to_profile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
 
    return(
        
        <div className="navigation-img-box ">
                    
            <div className="" id="navBardropdown" 
                           data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                <div className="nav-bar-img-box"> 
                    { profile && profile.profile_picture?
                        <img alt="" src={profile.profile_picture} className="nav-bar-img"/>
                        :
                        <img alt="" src={require("media/user-image-placeholder.png")} className="nav-bar-img"/> 

                    }
                </div>
            </div>
            <div className="dropdown-menu " aria-labelledby="navBardropdown">
                <NavBarMenuItems {...props}/>
                
            </div>
        </div>
    )
}

export const NavBarMenuModalItems = props =>{
    console.log(props);
   
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
            navBarMenuProps:{...props},
            modalName   : 'navigationMenu', 
        };

    return(
        
        <div className="navigation-img-box "
             onClick={()=> Modal({modalProps})}>
                    
            <div className="nav-bar-modal-menu" id="nav-bar-modal-menu">
                <div className="nav-bar-img-box"> 
                    { profile && profile.profile_picture?
                        <img alt="" src={profile.profile_picture} className="nav-bar-img"/>
                        :
                        <img alt="" src={require("media/user-image-placeholder.png")} className="nav-bar-img"/> 

                    }
                </div>
            </div>
        </div>
    )
}



export const NavBarSmallScreen = props => {

    
    var { currentUser } = props;
    
    createPostProps     = {...createPostProps, currentUser};
    createQuestionProps = {...createQuestionProps, currentUser};

    let styles = {
        width     : '100%',
        border    : 'px solid red',
        
    };

    let modalProps = {
            userListProps : {currentUser},
            modalName     : 'userList', 
        }; 

    let state = { modalProps } 

     

    return (
		<nav  className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light" id="navigation-mobile">
            <button onClick={()=>props.reloadPage()}  className="logo"><strong>Wiplayit</strong></button>
                <div className="mobile-navbar-center">
                    <ul style={styles}>

                    </ul>                    
                    <ul className="post-question-btn-box">
                        <li className="create-question-btn-box">
                            <OpenEditorBtn {...createQuestionProps}/>
                        </li>

                        <p>Or</p>

                        
                        <li className="create-post-btn-box">
                            <OpenEditorBtn {...createPostProps}/>
                        </li>
                    </ul>
                </div>

              <div className="mobile-navbar-bottom">

                <div className="navigation-menu">
                    <ul  className="navigation-item">
                       <li>
                            <Link className="items" to="/posts/">
                                Posts
                            </Link>
                        </li>
                    </ul>

                    <ul  className="navigation-item">
                        <li>
                            <Link className="items"
                            to="/questions/">Questions</Link>
                        </li>
                    </ul>
                    
                    <ul  className="navigation-item">
                         <li>
                            <Link className="items"
                            to="/notifications/">Notifications</Link>
                        </li>
                    </ul>
                    <div className="navigation-img-item">
                        <NavBarModalMenu{...props}/>
                    </div>

                </div>

            </div>
        </nav>
    ); 
};




export const NavBarBigScreen = props => {
    var {currentUser}       = props;
    let path_to_profile     = `/`;
   
    let pathToProfile = currentUser  && `/profile/${currentUser.id}/${currentUser.slug}/`;
    let userProfile   = currentUser  && currentUser.profile;
      

    createPostProps     = {...createPostProps, currentUser};
    createQuestionProps = {...createQuestionProps, currentUser};
    
    let modalProps = {
            userListProps : {currentUser},
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

    //console.log(createQuestionProps, createPostProps)
    
        
	return(
			
        <nav className="navigation fixed-top" id="navigation">
            <div className="navigation-box">
                <div className="navigation-menu">
                    <div className="logo-box">
                        <button onClick={()=> props.reloadPage()} className="logo">Wiplayit</button>
                    </div>

                    <div className="nav-menu">
                    
                    <ul  className="navigation-item">
                        <li>
                            <Link className="items" to="/posts/">
                                Posts
                            </Link>
                        </li>
                    </ul>

                    <ul  className="navigation-item">
                        <li>
                            <Link className="items"  to="/questions/">Questions</Link>
                        </li>
                    </ul>
                    
                    <ul  className="navigation-item">
                        <li>
                            <Link className="items"
                            to="/notifications/">Notifications</Link>
                        </li>
                    </ul> 
                    </div> 

                           
                    <NavBarDropDown {...props}/>
                    
                 
              
                    <div className="post-question-btn-box">
                        <div className="create-question-btn-box">
                            <OpenEditorBtn {...createQuestionProps}/>
                        </div>
    
                        <p>Or</p>
                        <div className="create-post-btn-box">
                            <OpenEditorBtn {...createPostProps}/>
                        </div>
                    </div>
                </div>
            </div>
            
        </nav>
    );
};





export const PartialNavBar = props =>{
   //console.log(props)
   var {currentUser } = props;

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
                 <ModalCloseBtn> 
                    <span className="nav-bar-arrow-icon material-icons ">arrow_back</span>
                </ModalCloseBtn>  
            </div>

            <div className="page-name-box">
                <b className="page-name">{props.pageName}</b>  
            </div>
         
            <div className="navigation-img-item">
                <NavBarModalMenu {...props}/>
            
            </div>
        </nav>
    );

};




export const PartalNavigationBar = MatchMediaHOC(PartialNavBar, '(max-width: 900px)');

export const NavigationBarBigScreen = MatchMediaHOC(NavBarBigScreen, '(min-width: 900px)');
export const NavigationBarSmallScreen = MatchMediaHOC(NavBarSmallScreen, '(max-width: 900px)');



export const EditProfileNavBar = props  => {

  let {submitting, userProfile } = props;

  let submitButtonStyles = submitting?{opacity:'0.60'}:{};
   
  let fieldSetStyles     = submitting? {opacity:'0.60'}:{};


    return(
        <nav className="partial-form-navbar fixed-top"> 

            <div className="partial-navbar-back-btn-box">
                <ModalCloseBtn> 
                    <span className="nav-bar-arrow-icon material-icons ">arrow_back</span>
                </ModalCloseBtn>  
	        </div>

            <div className="page-name-box">
                <b className="page-name">Edit Profile</b>  
            </div>

	        <div className="submit-profile-btn-box">
		        <button type="submit" 
                        style={submitButtonStyles} 
                        disabled={submitting}
                        onClick={()=> props.submit(props.submitProps)}
                        value="submit" className="submit-btn submit-profile-btn">
                    Submit
                </button>
	        </div>
        </nav>
            
    )
};



export const CustomBackBtn = props => {
    let styles = props.styles || {};
    return(
        <button type="button" 
              onClick={()=>window.history.back()} 
              className="btn-sm custom-back-btn" >
            <span className="arrow material-icons ">arrow_back</span>
        </button>  
  );
}




export const ModalNavBar = props => {
    return(
      <EditorNavBar title={ <SubmitBtn handleSubmit={props.handleSubmit} /> } / >
  );
}


