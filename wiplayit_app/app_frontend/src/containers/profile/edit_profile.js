import { MatchMediaHOC } from 'react-match-media';

import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import {ModalManager} from "containers/modal/modal_container";

import { GetModalLinkProps } from "components/component-props";

import { EditProfileNavBar } from "components/navBar";
import {  ChangeImageBtn  } from "components/buttons";
//import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import  * as types  from 'actions/types';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import { handleSubmit, getUserProfile }  from "dispatch/index"
import { AlertComponent } from "components/partial_components";

import  AjaxLoader from "components/ajax-loader";

import  Helper from 'containers/utils/helpers';
import Api from 'utils/api';



const ChangeImageBtnSmallScreen = MatchMediaHOC(ChangeImageBtn, '(max-width: 980px)');
const api = new Api();

const helper   = new Helper();  

  


class EditProfile extends Component{

    constructor(props) {
       super(props);

        this.state = {
            userProfile  :  null,
            profileById  :  null,
            submitting   : false,

            form         : {
               first_name       : "",
               last_name        : "",
               credential       : "",
               live             : "",
               favorite_quote   : "",
               phone_number     : "",
               profile_picture  : "", 
           },
        };
     
        this.handleChange   =  this.handleChange.bind(this);
    }; 

    onProfileUpdate = () =>{
 
        const onStoreChange = () => {

            let { obj, currentUser, apiUrl }      =  this.props.location && this.props.location.state || this.props;
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let byId         = obj && `userProfile${obj.id}`;
            
            let userProfile = byId && entities.userProfile[byId];
            //let { currentUser} = cacheEntities;
            let { modal, errors } = entities;

            if (errors.error && !errors.displayErrors) {
                errors['displayErrors'] = true;
                this.displayErrorMessage(errors.error);
                delete errors.displayErrors;
                delete errors.error;
            }
            
        
            console.log(entities)
            if (userProfile) {
                //console.log(userProfile)
                               
                this.setState({ submitting : userProfile.submitting});

                if (userProfile) {
                    //console.log(userProfile, userProfile.submitting)
                    let user = userProfile.user;
                    //currentUser =  currentUser && currentUser.user;
                    this.setState({userProfile:user})
                    
                    if ( user && currentUser && currentUser.id === user.id) {

                        //console.log(currentUser, user);
                        if (userProfile.submitting != undefined && !currentUser.upDated) {
                            currentUser['upDated'] = true;
                            //console.log(userProfile)
                            store.dispatch(action.getCurrentUserPending())
                            store.dispatch(action.getCurrentUserSuccess(user));

                            delete currentUser.upDated;
                        }
                    }

                    this.populateEditForm(user);
                }
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    displayErrorMessage =(errorMessage)=>{
        let message = {textMessage:errorMessage, messageType:'error'}
        this.displayAlertMessage(message)
    }

    displayAlertMessage = (message) => {
        this.setState({ displayMessage : true, message });
        setTimeout(()=> {
            this.setState({displayMessage : false}); 
            }, 5000);
    }


    componentWillUnmount() {
            this.unsubscribe();
        };
   

    componentDidMount() {
        this.onProfileUpdate();
        console.log(this.props)
        //let { cacheEntities } = this.props; 
        //let { userProfile }   = cacheEntities
        let { obj, currentUser, apiUrl }      =  this.props.location && this.props.location.state || this.props;
               
                          
        
        let userProfile = obj
        let profileById = userProfile && `userProfile${userProfile.id}`;

        //console.log(userProfile)

        this.setState({profileById, userProfile, currentUser});

        if (userProfile) {
            store.dispatch(action.getUserProfilePending(profileById));
            store.dispatch(action.getUserProfileSuccess(profileById, userProfile));
            this.populateEditForm(userProfile);

        }else {
            //let {id, slug} = this.props.match && this.props.match.params && this.props.match.params;
            //let apiUrl = api.updateProfileApi(id)
            //getUserProfile(id, apiUrl);
        }
        
    };

    
    populateEditForm(userProfile ){
        
        if (userProfile) {
            let {form}     =  this.state;
            
            let {first_name, last_name} = userProfile

            let { live, credential, favorite_quote } = userProfile.profile 
      
            form    = { first_name, last_name, live, credential, favorite_quote };
            
            this.setState({ form, userProfile });
        }
    }

    
   
    handleChange(e){
      e.preventDefault()
      let form = this.state.form;
      form[e.target.name] = e.target.value;
      this.setState({form})
    }

    


    getProps(){
        
        let props = {
            handleChange         : this.handleChange, 
            textAreaProps        : this.textAreaProps(),
            submitProps          : this.submitProps(),
            submit               : this.submit.bind(this), 
            editUserProfileProps : this.getUserEditProps(),
            ...this.state,
        }

        return Object.assign(props, this.props);
    }
 
    textAreaProps() {
        return {
           value     : this.state.form.favorite_quote,
           onChange  : this.handleChange,
           name      : "favorite_quote",
           className : "favorite_quote"
        };
    };


    submitProps() {
        let { form } = this.state;
        let editUserProfileProps = this.getUserEditProps()
        let formData = helper.createFormData(form)
        return Object.assign(editUserProfileProps, {formData})
    
          
           
    };

    getUserEditProps(){
        let { profileById, userProfile, currentUser } = this.state;
        //let currentUser = this.props.currentUser || this.props.location.state;

        let editUserProfileProps = {
                objName     : 'UserProfile',
                isPut       : true,
                obj         : userProfile, 
                byId        : profileById,
                currentUser ,
            } 
        return GetModalLinkProps.props(editUserProfileProps)    

    }

    submit(params){
        store.dispatch(handleSubmit(params));
    };

    render() {
      let props = this.getProps();
      let alertMessageStyles = props.displayMessage?{ display : 'block'}:
                                                    { display : 'none' };
          
      var userProfile = props.userProfile

      return (
        <div>
            <EditProfileNavBar {...props}/>
            
            <div>
                { userProfile?
                    <div>
                        <ProfileEditComponent {...props}/>
                    </div>

                    :
                    ""    
                }  

                <div style={alertMessageStyles}>
                    <AlertComponent {...props}/>
                </div>         
            </div>
                   
        </div>
      );
   };
};


    


export default EditProfile;

const ProfileEditComponent = props => {
    
    let {submitting, userProfile, editUserProfileProps } = props;
    userProfile = userProfile;
    
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};



    return(

        <div  className="edit-profile-container" >
            <fieldset style={ fieldSetStyles} 
                      disabled={ submitting} >
                <EditProfilePicSmalScreen {...props}/>
            
                <div className="profile-name-edit-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                             Name
                        </li>
                    </ul>

                    <div className="profile-name-input-box">
                        <input
                            type="text" 
                            className="profile-name-input"
                            name="first_name"
                            value={props.form.first_name}
                            onChange={props.handleChange}
                        />

                        <input
                            type="text" 
                            className="profile-name-input"
                            name="last_name"
                            value={props.form.last_name}
                            onChange={props.handleChange}
                        />
                    </div>

                </div>

      
                <div className="user-locacion-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Live
                        </li>
                    </ul>
                    <div className="input-box">
                        <input
                            type="text" 
                            className=""
                            name="live"
                            value={props.form.live}
                            onChange={props.handleChange}
                        />
                    </div>        
                </div>
      
                <div className="user-credential-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Credentials
                        </li>
                    </ul>
                    <div className="input-box">
                        <input
                            type="text" 
                            className=""
                            name="credential"
                            value={props.form.credential}
                            onChange={props.handleChange}
                        />
                    </div>
                </div>

      
                <div className="user-favorite-quote-box">
                    <ul className="item-title-box">
                        <li className="item-title">
                            Quote
                        </li>
                    </ul>

                    <div className="input-box">
                        <TextareaAutosize {...props.textAreaProps}  rows={3}/>  
                    </div>   
                </div>
            </fieldset>
    
        </div>
    );
};


const EditProfilePicture = (props)=>{

        let {userProfile, editUserProfileProps } = props;
        let profile  = userProfile && userProfile.profile;
        let linkName = `Change`; 

        editUserProfileProps = {...editUserProfileProps, linkName}

        return(
            <div className="edit-img-container">
                <ul className="item-title-box">
                    <li className="item-title">
                        Photo
                    </li>
                </ul>

                <div className="edit-image-container">
                    <div className="edit-profile-image-box">
                            <div className="edit-image-btn-box">
                                { profile && profile.profile_picture?
                                    <img alt="" 
                                         className="edit-image" 
                                         src={profile.profile_picture }/>
                                    :
                                    <img alt="" 
                                         src={require("../../images/user-avatar.png")} 
                                         className="edit-image"/> 
                                }
                            </div>
                    </div>
                    <div className="chang-img-btn-box">
                        <ChangeImageBtn {...editUserProfileProps}/>
                    </div>
                </div>

            </div>   
        )
};

const EditProfilePicSmalScreen = MatchMediaHOC(EditProfilePicture, '(max-width:980px)')

export const NavBarTitle = props  => (
  <div className="navbar-title-box">
   <b className="navbar-title">Edit Profile</b>  
  </div>    
)



export const EditContents = props  => (
  <div className="navbar-title-box">
   <b className="navbar-title">Edit Profile</b>  
   <ModalCloseBtn/>
  </div>    
)




export class DropImage extends React.Component {
 
   constructor(props) {
      super(props);
      this.state = {
         file: '',
         imagePreviewUrl: '',
         submitting: false,
      };

      this.handleChange = this.handleChange.bind(this);

   }

    componentDidMount(){
        console.log(this.props)

      
        this.onImageDropUpdate();
    }
    

    onImageDropUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate          = store.getState();
            let {currentUser, obj}   = this.props; 
            let {entities}           = storeUpdate
            let {modal, userProfile} = entities
            let { background }       = this.props;
            let byId                 = obj && `userProfile${obj.id}`;
            userProfile              = userProfile[byId];
            let user                 = userProfile && userProfile.user;
            console.log(userProfile, currentUser, this.props)

            if ( user && currentUser && currentUser.id === user.id) {
                console.log(user);

                if (userProfile.submitting != undefined && !currentUser.upDated) {
                    currentUser['upDated'] = true;
                    //console.log(userProfile)
                    store.dispatch(action.getCurrentUserPending())
                    store.dispatch(action.getCurrentUserSuccess(user));
                    delete currentUser.upDated;
                }
            }
            
            
            
            modal = modal && modal['dropImage'];
            this.setState({submitting : modal.submitting});
            //console.log(modal)


            if (modal && modal.successMessage) {
                !modal.profilePictureUpdate && ModalManager.close('dropImage' , background)
                 modal['profilePictureUpdate'] = true;
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        let storeUpdate   = store.getState();
        let {entities} = storeUpdate
        let {modal} = entities;
        modal = modal && modal['dropImage'];

        modal && modal.profilePictureUpdate && delete modal.profilePictureUpdate;
        this.unsubscribe();
    };
  
    
    handleChange(event) {
      event.preventDefault();
      var reader = new FileReader();
      var file = event.target.files[0];

      reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  
    }

    handleImageAdd = (params)=>{
        let file = this.state.file;
        
        let formData = helper.createFormData({'profile_picture': file});
        let submitProps = {
               formData,
               IsModal   : true,
               modalType : 'dropImage',
            };

        submitProps = Object.assign(submitProps , this.props)
        console.log(submitProps)
               
        store.dispatch(handleSubmit(submitProps));
       

    };


    getProps() {
   
      let props = {
        file         : this.state.file,
        userProfile  : this.props.userProfile,
        isImageDrop  : true,
        ...this.state,
                           
      };

      return props;
    }
    
    render() {
        let props = this.getProps();
        let { background } = this.props
        let submitButtonStyles = props.submitting?{opacity:'0.60'}:{};
    
        let fieldSetStyles = props.submitting? {opacity:'0.60'}:{};


        return (
            <div>
            <fieldset style={ fieldSetStyles} 
                      disabled={ props.submitting} >

            
               <div className="upload-preview">
                  <div className="drop-image-btns">
                     <div className="dismiss-box">
                        <button  type="button" 
                              onClick={()=> ModalManager.close('dropImage',background)}
                              className="image-drop-dismiss-btn">

                            <span className="image-drop-dismiss-icon dismiss">&times;</span>
                        </button>
                     </div>

                  
                    { this.state.imagePreviewUrl?
                        <div className="add-image-btn-box">
                            <button  type="button" onClick={()=>this.handleImageAdd()}
                                  className="btn-sm image-add-btn">
                                Add
                            </button>
                        </div>
                        :
                        ""
                    }
                  </div>

                  { this.state.imagePreviewUrl?
                     <div className="image-preview-container">
                        <div className="image-preview-box">
                            <img className="image-preview" alt="" src={this.state.imagePreviewUrl} />
                        </div>
                     </div>
                     :
                     <form className="image-form">
                        <label className="fileBox" id="fileContainer">
                           <input onChange={this.handleChange} type="file" accept="image/*" />
                              Click Here to Upload
                       </label>
                     </form>

                  }

               </div>
               </fieldset>
            </div>  
        );
    };
};


/*
         <div className="edit-img-container">
            <div className="item-title-box">
               <b className="item-title">Photo</b>
            </div>

            <div className="item-title-container">
               <div className="image-contain">
                    { userProfile && userProfile.profile.profile_picture?
                        <div className="edit-image-box">
                            <img alt="" className="edit-image" src={ userProfile.profile.profile_picture }/>
                        </div>
                        :
                        <div className="avatar-image-box">
                            <img alt="" src={require("../../images/user-avatar.png")} className="avatar-image"/> 
                        </div> 
                    }
                </div>
               
            </div>

         </div>   
*/

//const EditBtnSmallScreen = MatchMediaHOC(EditBtn, '(max-width: 500px)');
