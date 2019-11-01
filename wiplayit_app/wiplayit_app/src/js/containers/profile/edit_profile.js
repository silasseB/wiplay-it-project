import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { ModalManager} from 'react-dynamic-modal';
import { EditProfileNavBar, NavigationBarBigScreen } from "../../components/navBar";
import {  ModalCloseBtn  } from "../../components/buttons";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import  * as types  from '../../actions/types';
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";

import  AjaxLoader from "../../components/ajax-loader";

import  Helper from '../../containers/utils/helpers';
import Api from '../../api';



const api = new Api();

const helper   = new Helper();  

  


class EditProfile extends Component{

    constructor(props) {
       super(props);

        this.state = {
            userProfile  :  '',
            profileById  :  '',

            form         : {
               profile_picture  : "",
               first_name       : "",
               last_name        : "",
               credential       : "",
               live             : "",
               favorite_quote   : "",
               phone_number     : "",
           },
        };
     
        this.handleChange   =  this.handleChange.bind(this)
        this.handleImageAdd =  this.handleImageAdd.bind(this)
    }; 
   

    componentDidMount() {
        let { slug, id } = this.props.match.params;
           
        if (id ) {
            var byId = `userProfile${id}`;
            var userProfile = this.props.entyties.userProfile.byId[byId]

            if (userProfile) {
                this.populateEditForm(userProfile.user);

            }

            else {
                this.props.getUserProfile(id);
                //userProfile  = this.props.location.state.userProfile;
              
                //store.dispatch(action.getUserProfilePending(userProfile.id));
                //store.dispatch(action.getUserProfileSuccess(userProfile));  

                //this.populateEditForm(userProfile);
            }

            
            this.setState({profileById : byId, userProfile });
        }
    };

    populateEditForm(userProfile ){
        console.log(userProfile)

        if (userProfile) {
            let form        =  this.state.form;
            let profile     = userProfile.profile;

            let {profile_picture,live,credential,favorite_quote} = profile 

            profile_picture = profile_picture?profile_picture:'';

            let {first_name,last_name} = userProfile
       
            form    = {first_name,last_name,profile_picture,live,credential,favorite_quote};
            
            this.setState({ form });
        }
    }

    
   
    handleChange(e){
      e.preventDefault()
      let form = this.state.form;
      form[e.target.name] = e.target.value;
      this.setState({form})
    }

    handleImageAdd(params){

        let form = this.state.form;
        form['profile_picture'] = params.file;
        var submitProps = this.submitProps();
        this.props.submit(submitProps);

        let { byId } = this.state;
        var userProfile = this.props.entyties.userProfile.byId[byId];

        this.populateEditForm(userProfile);

    };


    getProps(){
        let props = {
           handleChange   : this.handleChange, 
           handleImageAdd : this.handleImageAdd,
           form           : this.state.form,
           textAreaProps  : this.textAreaProps(),
           submitProps    : this.submitProps(),
           userProfile    : this.state.userProfile,
           profileById    : this.state.profileById,
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
       
        let props = {};
        let { slug, id } = this.props.match.params;

        if (id) {
            let {profileById, userProfile } = this.state;
            let form = this.state.form;
            form.profile_picture = '';
       
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
      console.log(props)
      var profileById = props.profileById;
      var userProfile = props.entyties.userProfile.byId[profileById]

      return (
        <div>
            <EditProfileNavBar {...props}/>
            <NavigationBarBigScreen {...props} />
            <div>
                { userProfile?
                    <div>
                       { userProfile.isLoading?
                            <div className="page-spin-loder-box">
                               <AjaxLoader/>
                            </div>
                            : 
                           <ProfileEditComponent {...props}/>
                        }
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
    console.log(props)
    const profileById = props.profileById; 
    let userProfile = props.entyties.userProfile.byId[profileById];
    console.log(userProfile)
    userProfile = userProfile.user;

    return(

        <div  className="edit-profile-container" >
      
         <div className="edit-img-container">
            <div className="item-title-box">
               <b className="item-title">Photo</b>
            </div>

            <div className="item-title-container">
               <div className="image-contain">
                  { userProfile.profile.profile_picture?
                     <div className="edit-image-box">
                        <img alt="" className="edit-image" src={ userProfile.profile.profile_picture }/>
                     </div>
                     :
                     <div className="avatar-image-box">
                        <img alt="" src={require("../../images/user-avatar.png")} className="avatar-image"/> 
                     </div> 
                  }
                
               <EditBtn {...props}/>
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
      return (
         <div>
            
               <div className="upload-preview">
                  <div className="drop-image-btns">
                     <div className="dismiss-box">
                     <button  type="button" onClick={ModalManager.close} className="btn-sm image-drop-dismiss">
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
    console.log(props)
  
    let  modalOptionsProps = {
            modalProps : {handleImageAdd:props.handleImageAdd},
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
