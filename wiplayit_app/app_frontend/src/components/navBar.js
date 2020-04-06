
import React from 'react';
import {  Link, BrowserRouter } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { SubmitBtn  } from "components/buttons";
import { ModalManager}   from  "containers/modal/modal_container";
import {EditorLink } from "components/modal-links"
import { GetModalLinkProps } from "components/component-props";
import { store } from "store/index";
import {showModal} from 'actions/actionCreators';
import {history} from "App" 


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



const NavBarDropDown = props => {
    let { currentUser } = props;
          
    let state = {userProfile:currentUser};
    
    let path_to_profile = currentUser && `/profile/${currentUser.id}/${currentUser.slug}/`;
 
    return(
        
        <div className="navigation-img-box">
                    
            <div className="" id="navBardropdown" 
                           data-toggle="dropdown" aria-haspopup="false" aria-expanded="true">
                <div className="nav-bar-img-box"> 
                    { currentUser && currentUser.profile && currentUser.profile.profile_picture?
                        <img alt="" src={currentUser.profile.profile_picture} className="nav-bar-img"/>
                        :
                        <img alt="" src={require("../images/user-avatar.png")} className="nav-bar-img"/> 

                    }
                </div>
            </div>
                    

            <div className="dropdown-menu" aria-labelledby="navBardropdown">
                <button onClick={() => history.push(path_to_profile, state) } className="dropdown-item"> 
                    Profile
                </button>
                <button onClick={props.logout} className="dropdown-item" >Logout</button>
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
            modalType     : 'userList', 
        }; 

    let state = { 
        background : props.location,
        modalProps
    } 


    let madalParams = {
        boolValue : true,
        modalType   : 'userList',
        background  : props.location,
    }
    let pathname = `/compose/${'user'}/${1}/`;
     

    return (
		<nav  className="mobile-navbar-top fixed-top navbar-expand-lg navbar-light" id="navigation-mobile">
            <button onClick={()=>props.reloadPage()}  className="logo"><strong>Wiplayit</strong></button>
                <div className="mobile-navbar-center">
                    <ul style={styles}>

                    </ul>                    
                    <ul className="post-question-btn-box">
                        <li className="create-question-btn-box">
                            <EditorLink {...createQuestionProps}/>
                        </li>

                        <p>Or</p>

                        
                        <li className="create-post-btn-box">
                            <EditorLink {...createPostProps}/>
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
                            <button className="items btn-sm"    onClick={()=> {
                                                store.dispatch(showModal(madalParams))
                                                setTimeout(()=> {
                                                    history.push({ pathname: pathname, state}); 
                                                }, 500);

                                            }}>
                                    Notifications  
                            </button>
                           
                        </li>
                    </ul>
                    <div className="navigation-img-item">
                        <NavBarDropDown {...props}/>
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
                            <button className="items btn-sm"    onClick={()=> {
                                                store.dispatch(showModal(madalParams))
                                                setTimeout(()=> {
                                                    history.push({ pathname: pathname, state}); 
                                                }, 500);

                                            }}>
                                    Notifications  
                            </button>

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
         
            <div className="navigation-img-item">
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


