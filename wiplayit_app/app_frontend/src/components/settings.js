
import React, {Component} from 'react';

import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import {store} from 'store/index';
import MainAppHoc from 'components/index/index-hoc';
import {PasswordConfirmModalBtn} from 'templates/buttons';
import {Modal} from 'components/modal/modal-container';
import {getCurrentUserSuccess} from 'actions/actionCreators';
import {PasswordForm} from 'templates/authentication/password-change';
import {formIsValid,
        validateEmail,
        authSubmit,
        changeForm,
        getFormFields,
        setForm,} from 'components/authentication/utils';   
import {NonFieldErrors,
        PhoneNumberFieldErrors,
        EmailFieldErrors} from 'templates/authentication/errors';
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen} from 'templates/navBar';


class  SettingsContainer extends Component  {
    isMounted = false;
    constructor(props) {
        super(props);
        this.state = { 
            pageName   : "Settings",
            formName   : '',
            submitting : false,
            passwordChanged  : false,
            phoneNumberOrEmailAdded : false,
            successMessage   : undefined,
            form : undefined,
        };       
    };

    componentDidMount() {
        this.isMounted = true
        this.props.authenticate();
        this.onSettingsStoreUpdate()
        console.log(this.props)
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    onSettingsStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities}   =  storeUpdate;
            let {userAuth, errors} = entities;
            let {form, formName} = this.state;
            let {error,
                 loginAuth,
                 passwordChangeAuth,
                 phoneNumberOrEmailAuth,
                 isLoading} = userAuth;
                 console.log(phoneNumberOrEmailAuth)

            
            this.setState({submitting : isLoading}); 

            if (form && error) {
                form[formName]['error'] = error;
                this.setState({form});
                delete userAuth.error;
            }
            this.handlePhoneNumberAddSucces(phoneNumberOrEmailAuth);
                 
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    handlePhoneNumberAddSucces(phoneNumberOrEmailAuth){
        if (!phoneNumberOrEmailAuth) return;

        let {phoneNumberOrEmailAdded} = this.state;
        let {currentUser} = this.props;

        if (!phoneNumberOrEmailAdded) {
            
            let {phone_numbers,
                  email_address} =  phoneNumberOrEmailAuth || {};
            
            if (phone_numbers) {
                currentUser =  {...currentUser, phone_numbers};

            }else if (email_address) {
                currentUser = email_address && {...currentUser, email_address};
            }
                   
            this.setState({phoneNumberOrEmailAdded:true});
            store.dispatch(getCurrentUserSuccess(currentUser));
        }
    };
    

    togglePasswordChangeForm=(params)=>{
        let formName = 'passwordChangeForm';

        let old_password = params && params.old_password;
        old_password = !old_password && this.getOldPassword() || old_password;
            
        if (!old_password) {
                return this.openPasswordConfirmationModal();
                
        }else{
            let formFields = getFormFields();
            let form = formFields.passwordChangeForm;
            return this._SetForm(form, formName, {old_password})
        }
    }

    togglePhoneNumberForm =()=> {
        let formFields = getFormFields();
        let form = formFields.phoneNumberForm;
        this._SetForm(form, 'addPhoneNumberForm')
    };

    toggleEmailForm =()=> {
        let formFields = getFormFields();
        let form = formFields.emailForm;
        this._SetForm(form, 'addEmailForm');
    };

    _SetForm(form={}, formName='', formOpts={}){
        let currentForm = this.state.form;
                 
        form = {...form, ...formOpts};
        form = setForm(form, currentForm, formName);

        this.setState({form, formName});
    };

    passwordConfirmExpired(passwordConfirmAuth={}){
        let {timeStamp} = passwordConfirmAuth;
        timeStamp = new GetTimeStamp({timeStamp});

        if (timeStamp) {
            return timeStamp.hours() >= 1;
        }

        return true;
    }

    getOldPassword =()=> {
        let cacheEntities = this.props.cacheEntities;
        let userAuth = cacheEntities && cacheEntities.userAuth;
        
        if (userAuth && userAuth.passwordConfirmAuth) {
            let passwordConfirmAuth = userAuth.passwordConfirmAuth;
            let passwordExpired = this.passwordConfirmExpired(passwordConfirmAuth);
        
            if (passwordExpired) {
                return undefined;
            }

            let {old_password, passwordValidated} = passwordConfirmAuth;
            if (old_password && passwordValidated) {
                return old_password;
            }
        }
        return undefined;
    };
   
    openPasswordConfirmationModal =()=> {
        let {currentUser} = this.props;
        let modalProps = {
            togglePasswordChangeForm: this.togglePasswordChangeForm.bind(this),
            currentUser,
            modalName : 'passwordConfirmForm', 
        }; 

        Modal(modalProps)
    }

    onChange(event, formName) {
        event.preventDefault();
        formName && this.setState({formName})
        
        changeForm(this, event);
    };

    handleSubmit(event, formName){
        event.preventDefault();
        formName && this.setState({formName});

        this.resetSuccessSubmitListers()
        let useToken = true;
        authSubmit(this, formName, useToken);
    };

    resetSuccessSubmitListers(){
        this.setState(
            {phoneNumberOrEmailAdded:false, 
             passwordChanged:false})
    }

    validateForm(form){
        return formIsValid(form)
    }

    removeEmail(email){

    };

    removePhoneNumber(phone_number){

    };

    sendConfirmation(value){
        let email = value;
        
    };

    reactBindings(){
        return{
            handleFormChange         : this.onChange.bind(this),
            onSubmit                 : this.handleSubmit.bind(this),
            removePhoneNumber        : this.removePhoneNumber.bind(this),
            removeEmail              : this.removeEmail.bind(this), 
            sendConfirmation         : this.sendConfirmation.bind(this), 
            toggleEmailForm          : this.toggleEmailForm.bind(this),
            togglePhoneNumberForm    : this.togglePhoneNumberForm.bind(this),
            togglePasswordChangeForm : this.togglePasswordChangeForm.bind(this),
            validateForm             : this.validateForm.bind(),
        }
    }

    getProps(){
        return{
            ...this.reactBindings(),
            ...this.props,
            ...this.state,
        }
    };

    render(){
        let props = this.getProps();
        
        return(
            <div className="">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/> 

                <div className="settings-page">
                    <div className="settings-container">
                        <SettingsTemplate {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(SettingsContainer); 


const SettingsTemplate =(props)=>{
    
    return(
        <div className="settings-contents">
            <ul className="settings-page-title">
                <li className="">
                    Account settings
                </li>
            </ul>
            <EmailSettings {...props}/>
            <PhoneNumberSettings {...props}/>
            <PasswordChangeSettings {...props}/>
        </div>
    )
};


const EmailSettings = (props) => {
    let {toggleEmailForm,
         currentUser} = props;
         
    let account = currentUser;
    let emailAddress = currentUser && currentUser.email_address;
    
    let email;
    if (emailAddress) {
        emailAddress.map((value)=>{
                    if (value.primary) {
                        email = value.email;
                    }
                    return emailAddress;
                })
    }
    
    return(
        <div className="email-settings account-settings">
            <ul className="settings-items">
                <li className="">
                    Primary Email
                </li>
            </ul>
            <div className="account-email">
                <ul className="primary-email">
                    <li>{email}</li>
                </ul>
                <NonPrimaryEmail {...props}/>
                <button type="button" 
                        onClick={()=>toggleEmailForm()} 
                        className="btn-sm add-email-btn">
                    Add Another Email Address
                </button>
                <AddEmailAddressForm {...props}/>
            </div>
        </div>  
    )
};


const PhoneNumberSettings = (props) => {
    let {togglePhoneNumberForm,
         currentUser,} = props;

    let account = currentUser;
    let phoneNumbers = account && account.phone_numbers;

    let phoneNumber;
    if (phoneNumbers) {
        phoneNumbers.map((number)=>{
                    if (number.primary) {
                        phoneNumber = number.national_format;
                    }
                    return phoneNumbers;
                })
    }

    
    return (
        <div className="phone-number-settings account-settings">
            <ul className="settings-items">
                <li>
                    Phone Number
                </li>
            </ul>

            <ul className="account-phone-number">
                <li className="primary-phone-number">
                    {phoneNumber}
                </li>
                <NonPrimaryPhoneNumber {...props}/>
              
                <button type="button"
                    onClick={()=>togglePhoneNumberForm()}
                    className="btn-sm add-email-btn">
                    Add Another Phone Number
                </button>
                <AddPhoneNumberForm {...props}/>
            </ul>
        </div>    
    )

};


const PasswordChangeSettings = (props) =>{
    let {togglePasswordChangeForm,
         currentUser,} = props;

    let account = currentUser;
    let formDescription = 'Enter a new passsword on both fields.';
    let passswordProps = {...props, formDescription};
    

    return(
        <div className="">
            <div className="password-settings account-settings">
                <ul className="settings-items">
                    <li>
                        Password
                    </li>
                </ul>

                <ul className="account-password">
                    <button type="button"
                        onClick={()=>togglePasswordChangeForm()}
                        className="btn-sm change-password-btn">
                        Change Password
                    </button>
                </ul>
            </div>
            <PasswordForm {...passswordProps}/>
            
        </div>   
    )
}

const NonPrimaryEmail = (props) => {
    let {sendConfirmation,
         currentUser,
         removePhoneNumber} = props;

    let account = currentUser;
    let emailAddress = account && account.email_address;
    let email = account && account.email;
    

    emailAddress = emailAddress && emailAddress.filter(email => 
                                                        email.primary === false);
    
    if (!emailAddress) return null;

    return(
        <div>
            {emailAddress.map((email, key)=>
                <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{email.email}</li>
                    </ul>
                    <div className="">
                        {!email.verified &&
                        <button
                            type="button" 
                            className="btn-sm add-email-btn"
                            onClick={()=> sendConfirmation(email.email)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm add-email-btn"
                            onClick={()=> removePhoneNumber(email) }>
                                Remove
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}


const NonPrimaryPhoneNumber = (props) => {
    let {sendConfirmation,
         currentUser,
         removePhoneNumber} = props;

    let account = currentUser;
    let phoneNumbers = account && account.phone_numbers;
    
    phoneNumbers = phoneNumbers && phoneNumbers.filter(phone_number => 
                                                    phone_number.primary === false);
    

    return(
        <div className="">
            {phoneNumbers && phoneNumbers.map((phoneNumber, key)=>{
                        
                return(
                 <div key={key} className="non-primary-email-box">
                    <ul className="non-primary-email">
                        <li>{phoneNumber.national_format}</li>
                    </ul>
                    <div className="">
                        {!phoneNumber.verified &&
                        <button
                            type="button" 
                            className="btn-sm add-email-btn"
                            onClick={()=> sendConfirmation(phoneNumber.primary_number)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm add-email-btn"
                            onClick={()=> removePhoneNumber(phoneNumber.primary_number)}>
                                Remove
                        </button>
                    </div>
                </div>
                )
            })}
        </div>
    )
}

const AddEmailAddressForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         formName,
         form} = props;

    form = form && form.addEmailForm;
    if (!form) return null;
        
    return(
        <div className="add-email-input-box">
            <input 
                className=""
                type="email" 
                name="email"
                placeholder="name@example.com"
                value={form && form.email}
                onChange={(event)=> handleFormChange(event, 'addEmailForm')}
            />
            <button type="button"
                    onClick={(event)=> onSubmit(event, 'addEmailForm')}
                    className="btn-sm submit-email-btn">
                Add Email 
            </button>
        </div>
    )

}



const AddPhoneNumberForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         formName,
         form} = props;

    form = form && form.addPhoneNumberForm;
    if (!form) return null;

    return(
        <div className="add-phone-number-input-box">
            <input 
                type="number" 
                name="phone_number"
                placeholder=""
                value={form && form.phone_number}
                onChange={(event)=> handleFormChange(event, 'addPhoneNumberForm')}
            />
            <button type="button" 
                    onClick={(event)=> onSubmit(event, 'addPhoneNumberForm')}
                    className="btn-sm submit-email-btn">
                Add Phone Number 
            </button>
        </div>
    )

}
