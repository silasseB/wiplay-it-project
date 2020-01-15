
import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { SubmitBtn  } from "../components/buttons";
import { ModalManager}   from  "../containers/modal/modal_container";
import {EditorLink } from "../components/modal-links"
import { GetModalLinkProps } from "../components/component-props";


let editorLinkMobileStyles = {
    background : '#A33F0B !important',
    color      : '#fefefe', 
        
}

let editorLinkDesktopStyles = {
       background : '#A33F0B',
       color      : '#fefefe',
       width      : '80px',
       height     : '30px',
       margin     : '15px 7px 0',

}

let createPostProps = {
        objName     : 'Post',
        linkName    : 'Post',
        isPost      : true,
        editorLinkDesktopStyles,
        editorLinkMobileStyles,
    };

let createQuestionProps = {
        objName   : 'Question',
        isPost    : true,
        linkName  : "Ask",
        editorLinkMobileStyles,
        editorLinkDesktopStyles,
    };


createQuestionProps = GetModalLinkProps.props(createQuestionProps);
createPostProps = GetModalLinkProps.props(createPostProps);

const NavBarDropDown = props => {
    let { currentUser } = props;
    let  path_to_profile = null;
      
    let state = {userProfile:currentUser}
    
    if (currentUser) {
        path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
        
    }

    return(
        <div className="navigation-img-box">
                    
            <div className="" id="navBardropdown" 
                           data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                <div className="navBar-img"> 
                    { currentUser && currentUser.profile && currentUser.profile.profile_picture?
                        <img alt="" src={currentUser.profile.profile_picture} className="profile-photo"/>
                        :
                        <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/> 

                    }
                </div>
            </div>
                    

            <div className="dropdown-menu" aria-labelledby="navBardropdown">
                <Link to={ {pathname : path_to_profile,state }} className="dropdown-item"> 
                    Profile
                </Link>
                <button onClick={props.logout} className="dropdown-item" >Logout</button>
            </div>
        </div>
    )
}


export const NavBarSmallScreen = props => {
    
    var { currentUser } = props;
    createPostProps['currentUser'] = currentUser;
    createQuestionProps['currentUser'] = currentUser;
    let state = {currentUser};
     

    return (
		<nav  className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light" id="navigation-mobile">
            <Link to="/" className="logo"><strong>Wiplayit</strong></Link>
              <div className="mobile-navbar-center">
                <div className="post-question-btn-box">
                    <div className="create-question-btn-box">
                        <EditorLink {...createQuestionProps}/>
                    </div>
    
                    <p>Or</p>
                    <div className="create-post-btn-box">
                        <EditorLink {...createPostProps}/>
                    </div>
                </div>
              </div>

              <div className="mobile-navbar-bottom">

                <div className="navigation-menu">
                    <ul  className="navigation-item">
                       <li>
                            <Link className="items" 
                                  to={ {pathname:"/posts/", state } }>
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
                                to={{pathname:"/users/",state:{ isUsersList : true }}}> 
                                Notifications
                            </Link>
                        </li>
                    </ul>

                    <NavBarDropDown {...props}/>

                </div>

            </div>
        </nav>
    ); 
};




export const NavBarBigScreen = props => {
    var {currentUser}       = props;
    let path_to_profile     = `/`;
    var userProfile = null;
    
    var state   = { currentUser, userProfile : currentUser};

    if (currentUser) {
        path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
        userProfile = currentUser.profile;
        createPostProps['currentUser'] = currentUser;
        createQuestionProps['currentUser'] = currentUser;  

    }
    
        
	return(
			
        <nav className="navigation fixed-top" id="navigation">
            <div className="navigation-box">
                <div className="navigation-menu">
                    <div className="logo-box">
                        <Link className="logo" to="/">Wiplayit</Link>
                    </div>

                    <div className="nav-menu">
                    
                    <ul  className="navigation-item">
                        <li>
                            <Link className="items" 
                                to={ {pathname:"/posts/", state } }>
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
                                to={{pathname:"/users/",state:{ isUsersList : true }}}> 
                                Notifications
                            </Link>
                        </li>
                    </ul> 
                    </div>            
                
                           
                    <NavBarDropDown {...props}/>
                    
                
               
              
                    <div className="post-question-btn-box">
                        <div className="create-question-btn-box">
                            <EditorLink {...createQuestionProps}/>
                        </div>
    
                        <p>Or</p>
                        <div className="create-post-btn-box">
                            <EditorLink {...createPostProps}/>
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

        <div className="partial-page-navbar fixed-top">
            <div className="back-btn-box">
                <CustomBackBtn {...props}/> 
            </div>

            <div className="page-name-box">
                <b className="page-name">{props.pageName}</b>  
            </div>
         
            <div className="home-link-box">
                <NavBarDropDown {...props}/>
            
            </div>
        </div>
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
     <div className="form-navbar fixed-top">
        <div className="partial-form-navbar "> 

            <div className="back-btn-box">
	            <CustomBackBtn {...props}/>
	         </div>

            <div className="page-name-box">
               <b className="page-name">Edit Profile</b>  
            </div>

	         <div className="submit-btn-box">
		        <button type="submit" 
              style={submitButtonStyles} 
                            disabled={submitting}
              onClick={()=> props.submit(props.submitProps)}
                       value="submit" className="submit-btn ">
                       Submit
            </button>
	         </div>
         </div>
     </div>    
  )
};



export const CustomBackBtn = props => {
    return(
      <button type="button"  onClick={()=>window.history.back()} className="btn-sm custom-back-btn" >
         <span className="arrow material-icons ">arrow_back</span>
      </button>  
  );
}



export const ModalNavBar = props => {
    return(
      <EditorNavBar title={ <SubmitBtn handleSubmit={props.handleSubmit} /> } / >
  );
}


