
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import {ModalManager} from "../../containers/modal/modal_container";
import { ChangeImageLink } from "../../components/modal-links"
import { GetModalLinkProps } from "../../components/component-props";

import { EditProfileNavBar, NavigationBarBigScreen } from "../../components/navBar";
import {  ModalCloseBtn  } from "../../components/buttons";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import  * as types  from '../../actions/types';
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";
import {LocalCache} from  "../../utils/storage";

import  AjaxLoader from "../../components/ajax-loader";

import  Helper from '../../containers/utils/helpers';
import Api from '../../api';



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
     
        this.handleChange   =  this.handleChange.bind(this)
        this.handleImageAdd =  this.handleImageAdd.bind(this)
    }; 

    onProfileUpdate = () =>{
 
        const onStoreChange = () => {
            let { slug, id } = this.props.match.params;
            let storeUpdate  = store.getState();
            let {entyties }  = storeUpdate;
            let byId         =  id? `userProfile${id}`:null;

            let userProfile = byId? entyties.userProfile.byId[byId]:null;
           

            if (userProfile) {
                let user = userProfile.user;
                this.setState({ submitting : userProfile.submitting});

                if (user) {
                    let {currentUser } = this.props;
                                       
                    if (currentUser) {
                        if (currentUser.id === user.id) {
                            LocalCache('currentUser', user)
                        }
                    }

                    LocalCache('userProfile', user)
                    this.populateEditForm(user);
                }
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };


    componentWillUnmount() {
            this.unsubscribe();
        };
   

    componentDidMount() {
        this.onProfileUpdate();
        let { cachedEntyties } = this.props; 
        let { slug, id } = this.props.match.params;
                          
        if (id ) {
            let profileById = `userProfile${id}`;
            console.log(cachedEntyties)
            let  {userProfile, currentUser, auth} = cachedEntyties;

            this.setState({profileById});

            if (userProfile) {
                 console.log('userProfile found from cachedEntyties')
                this.populateEditForm(userProfile);

            }else {
                let apiUrl = api.updateProfileApi(id)
                this.props.getUserProfile(id, apiUrl);
            }
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

    handleImageAdd(params){

        let { byId, form } = this.state;
        
        form['profile_picture'] = params.file;
        let submitProps = this.submitProps(form);
        this.props.submit(submitProps);
       

    };


    getProps(){
        let { form } = this.state; 
        let props = {
           handleChange   : this.handleChange, 
           handleImageAdd : this.handleImageAdd,
           textAreaProps  : this.textAreaProps(),
           submitProps    : this.submitProps(form),
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


    submitProps(form) {
       
        let props = {};
        let { slug, id } = this.props.match.params;

        if (id) {
            let { profileById, userProfile } = this.state; 
                   
            props['formData']  = helper.createFormData(form);
   
            props['obj']       =   userProfile;
            props['objId']     =   id;
            props['byId']      =   profileById;
            props['objName']   =  'userProfile';
            props['isPut']     =   true;
            props['actionType'] =  types.UPDATE_USER_PROFILE;
            props['apiUrl']    =   api.updateProfileApi(id);
        }

        return props;
    };

    render() {
      let props = this.getProps();
            
      var userProfile = props.userProfile

      return (
        <div>
            <EditProfileNavBar {...props}/>
            <NavigationBarBigScreen {...props} />
            <div>
                { userProfile?
                    <div>
                        <ProfileEditComponent {...props}/>
                    </div>

                    :
                    ""    
                }           
            </div>
                   
        </div>
      );
   };
};


    


export default withHigherOrderIndexBox(EditProfile);

const ProfileEditComponent = props => {
    
    let {submitting, userProfile } = props;
    userProfile = userProfile;
    
    let submitButtonStyles = submitting?{opacity:'0.60'}:{};
    
    let fieldSetStyles = submitting? {opacity:'0.60'}:{};


    return(

        <div  className="edit-profile-container" >
          <fieldset style={ fieldSetStyles} 
                      disabled={ submitting} >

      
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
                
               <ChangeImageLink {...{userProfile}}/>
               </div>
               
            </div>

         </div>   

            
         <div className="edit-name-box">
            <div className="item-title-container">
               <div className="item-title-box">
                 <b className="item-title"> Name</b>
               </div>
            </div>

            <div className="name-box">
               <input
                  type="text" 
                  className="user-profile-name"
                  name="first_name"
                  value={props.form.first_name}
                  onChange={props.handleChange}
               />

               <input
                  type="text" 
                  className="user-profile-name"
                  name="last_name"
                  value={props.form.last_name}
                  onChange={props.handleChange}
               />
            </div>

         </div>

      
         <div className="user-locacion-box">
            <div className="item-title-container">
               <div className="item-title-box">
                 <b className="item-title">Live</b>
               </div>
       
            </div>
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
            <div className="item-title-container">
               <div className="item-title-box">
                  <b className="item-title">Credentials</b>
               </div>
            </div>
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
            <div className="item-title-container">
               <div className="item-title-box">
                  <b className="item-title">Quote</b>
               </div>
            </div>

            <div className="input-box">
               <TextareaAutosize {...props.textAreaProps}  rows={3}/>  
            </div>   
         </div>
         </fieldset>
    
        </div>
    );
};


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
         imagePreviewUrl: ''
      };

      this.handleChange = this.handleChange.bind(this);

   }
 
  
    
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


   getProps() {
   
      let props = {
        file         : this.state.file,
        userProfile  : this.props.userProfile,
        isImageDrop  : true,
                           
      };

      return props;
    }
    
    render() {
      let props = this.getProps();
      console.log(this.props)
      let { background } = this.props

      return (
         <div>
            
               <div className="upload-preview">
                  <div className="drop-image-btns">
                     <div className="dismiss-box">
                     <button  type="button" onClick={()=> ModalManager.close(background)} className="btn-sm image-drop-dismiss">
                        <span className="dismiss">&times;</span>
                     </button>
                     </div>

                  
                  { this.state.imagePreviewUrl?
                     <div className="add-image-box">
                     <button  type="button" onClick={()=>this.props.handleImageAdd(props)} className="btn-sm image-add-btn">
                       Add
                     </button>
                     </div>
                     :
                     ""
                  }
                  </div>

                  { this.state.imagePreviewUrl?
                     <div className="image-preview-box">
                        <div className="edit-image-box">
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
         </div>  
      );
    }
}


export const EditBtn = props => {
    
  
    let  modalOptionsProps = {
            modalProps : { handleImageAdd: props.handleImageAdd},
            modalType : 'dropImage'
        };

    

    return(
       <div>
           <button className="btn-sm edit-img-btn "  onClick={() => props.showModal(modalOptionsProps)} type="button" >
               Change
           </button>
       </div>
    );
};


//const EditBtnSmallScreen = MatchMediaHOC(EditBtn, '(max-width: 500px)');
