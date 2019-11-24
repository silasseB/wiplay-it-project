
import React from 'react';
import {  Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { SubmitBtn  } from "../components/buttons";
import { ModalManager}   from  "../containers/modal/modal_container";
import {EditorLink } from "../components/modal-links"
import { GetModalLinkProps } from "../components/component-props";



let createPostProps = {
        objName     : 'Post',
        isPost       : true,
            };
     let createQuestionProps = {
        objName     : 'Question',
        isPost       : true,
      };

createQuestionProps = GetModalLinkProps.props(createQuestionProps)
createPostProps = GetModalLinkProps.props(createPostProps)

export const NavBarSmallScreen = props => {
    
    var { currentUser } = props;
    var   path_to_profile = null;
    ;
   
    let state = {userProfile:currentUser}
    
    if (currentUser) {
        path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
        createPostProps['currentUser'] = currentUser;
       createQuestionProps['currentUser'] = currentUser;
        
    }
    
   

    return (
		<nav  className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light" id="navigation-mobile">
            <Link to="/" className="logo"><strong>Wiplayit</strong></Link>
              <div className="mobile-navbar-center">
                <div className="create-post-box">
                 <EditorLink {...createQuestionProps}/>
    
                  <p>Or</p>
                  <EditorLink  {...createPostProps}/>
                </div>
              </div>

              <div className="mobile-navbar-bottom">

                <div className="navigation-menu">
                   <div className="item-box">
                      <Link className="navigation-item " to="/">Home</Link>
                   </div>

                   <div className="item-box">
                       <Link className="navigation-item "
                        to={{pathname:"/users/",state:{ isUsersList : true }}}> 
                          Notif
                        </Link>
                    </div>

                    <div className="item-box">

                    <Link className="navigation-item"
                         to={ {pathname:"/post/list/", state } }>
                        Posts
                       </Link>
                    </div>

                    <div className="item-box">
                      <Link className="navigation-item" to="/questions/">Quest</Link>
                    </div>

                </div>

                <div className="navbar-dropdown-sm navbar-dropdown">
                  <div className="img-box img-container-sm navigation-item" id="navBardropdown" 
                              data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                    { currentUser && currentUser.profile && currentUser.profile.profile_picture?
                        <img alt="" src={currentUser.profile.profile_picture} className="profile-photo"/>
                        :
                        <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/> 

                    }
                  </div>
      
                  <div className="dropdown-menu" aria-labelledby="navBardropdown">

                    <Link to={ {pathname : path_to_profile,state }} className="dropdown-item"> 
                    	Profile
                    </Link>
                    <button onClick={props.logout} className="dropdown-item" >Logout</button>
                  </div>
                </div>

              </div>
            </nav>
            

			); 
   }




export const NavBarBigScreen = props => {
    var {currentUser}    = props;
    let path_to_profile = `/`;
    var userProfile = null;
    
    var state   = { currentUser, userProfile : currentUser};

    if (currentUser) {
        path_to_profile = `/profile/${currentUser.id}/${currentUser.slug}/`;
        userProfile = currentUser.profile;
        createPostProps['currentUser'] = currentUser;
        createQuestionProps['currentUser'] = currentUser;  

    }
    
        
	return(
			
        <nav className="navigation navbar-expand-lg navbar-light" id="navigation">
        <div className="navigation-boX">
          <div className="navigation-menu">
            <div className="iterm-box">
            
            <Link className="navigation-item btn-sm" to="/">Home</Link>

             <Link className="navigation-item btn-sm" to={{pathname:"/users/list/", state:{currentUser}}}>
                  Notifications
             </Link>

             <Link className="navigation-item btn-sm" 
                          to={ {pathname: path_to_profile, state:{ currentUser, userProfile:currentUser } }}>
                 Profile
             </Link>

             <Link  className="navigation-item btn-sm" to={ {pathname:"/post/list/", state } }>
               Posts
            </Link>

             <Link className="navigation-item btn-sm" to="/">Questions</Link>
             
          </div>
          <Link className="logo" to="/">LATIRO</Link>
             
              <div className="img-box img-container-sm dropdown-toggl"
               id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                { userProfile && !userProfile.profile_picture?
                     <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/> 
                      :
                     <img alt="" src={userProfile.profile_picture} className="profile-photo"/>
                }

              </div>
       <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <Link 
             to={ {pathname: path_to_profile, state }} className="dropdown-item">
            Profile
        </Link>

         <button onClick={props.logout} className="dropdown-item" >Logout</button>
      </div>

       
    <div className="btn-box" >
      <EditorLink {...createQuestionProps}/>
                 <strong>Or</strong>
      <EditorLink  {...createPostProps}/>
       
    </div>
    
       
   </div>
  </div>
  </nav>


  )
}





export const PartialNavBar = props =>{
   console.log(props)
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
            <div className="img-box img-container-sm"
               id="navBardropdown"  data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
               { userProfile && userProfile.profile_picture?
                   <img alt="" className="profile-photo" src={userProfile.profile_picture}/>
                    :
                   <img alt="" src={require("../images/user-avatar.png")} className="profile-photo"/>  
                }
            </div>

            <div className="dropdown-menu" aria-labelledby="navBardropdown">
                <Link to={ {pathname :path_to_profile, state }} className="dropdown-item"> 
                    Profile
                </Link>

                <button onClick={props.logout} className="dropdown-item" >Logout</button>
            </div>          
            </div>
        </div>
   );

};




export const PartalNavigationBar = MatchMediaHOC(PartialNavBar, '(max-width: 500px)');

export const NavigationBarBigScreen = MatchMediaHOC(NavBarBigScreen, '(min-width: 800px)');
export const NavigationBarSmallScreen = MatchMediaHOC(NavBarSmallScreen, '(max-width: 500px)');



export const EditorNavBar = props  => {
   console.log(props)
   let background = props.background;
   return (
   <div id="editor-nav-bar" className="fixed-top">
      <div className="editor-navbar"> 
         <div className="back-btn-box">
           
	            <button type="button" className="editor-custom-back-btn custom-back-btn "
                  onClick={()=> ModalManager.close(background)}  data-dismiss="moda">
	            <span className="editor-arrow material-icons ">arrow_back</span>
	            </button>
            
         </div>

         <div className="page-name-box">
            <b className="page-name">{props.formName}</b>  
         </div>
	     
         <div className="submit-btn-box">
            <button type="button" onClick={()=> props.subimtCleanForm()}
                className="editor-submit-btn submit-btn">
                  Submit
            </button>
           
         </div>
      </div>
   </div>    
) 
}


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


