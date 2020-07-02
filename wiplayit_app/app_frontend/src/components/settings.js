
import React, {Component} from 'react';

import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import {store} from 'store/index';
import MainAppHoc from 'components/index/index-hoc';
import {PasswordConfirmModalBtn} from 'templates/buttons';
import {Modal} from 'components/modal/modal-container';
import {getCurrentUserSuccess, authenticationSuccess} from 'actions/actionCreators';
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
            onPasswordChangeForm : false,
            onAddEmailForm : false,
            onAddPhoneNumberForm : false,
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
            let successMessage = 'Your new phone number has been added successfully.'
            this.props.displaySuccessMessage(successMessage)
            
            let {phone_numbers,
                 email_address} =  phoneNumberOrEmailAuth || {};
            
            if (phone_numbers?.length ) {
                currentUser =  {...currentUser, phone_numbers};

            }else if (email_address?.length) {
                currentUser = email_address && {...currentUser, email_address};
            }
                   
            this.setState({phoneNumberOrEmailAdded:true});
            store.dispatch(getCurrentUserSuccess(currentUser));
        }
    };
    
    cachePassword(passswordParams={}) {
        let timeStamp = new Date();
        
        let passwordConfirmAuth = {
                timeStamp   : timeStamp.getTime(),
                passwordValidated : true,
                ...passswordParams,
        };
        store.dispatch(authenticationSuccess({passwordConfirmAuth}));
    }; 

    togglePasswordChangeForm=(params)=>{
        let formName = 'passwordChangeForm';

        let old_password = params?.old_password;
        let fromCache    = this.getOldPassword();
        if (old_password) {
            this.cachePassword(params);
        }
                    
        if (!old_password && !fromCache) {
                return this.openPasswordConfirmationModal();
                
        }else{
            
            let formFields = getFormFields();
            let form = formFields.passwordChangeForm;
            let onPasswordChangeForm = true;
            let passwordChanged      = false
            this.setState({onPasswordChangeForm, passwordChanged})
            return this._SetForm(form, formName, {old_password})
        }
    }

    togglePhoneNumberForm =()=> {
        let formFields = getFormFields();
        let form = formFields.phoneNumberForm;
        let onAddPhoneNumberForm = true
        this.setState({onAddPhoneNumberForm})
        this._SetForm(form, 'addPhoneNumberForm')
    }

    toggleEmailForm =()=> {
        let formFields = getFormFields();
        let form = formFields.emailForm;
        let onAddEmailForm = true
        this.setState({onAddEmailForm})
        this._SetForm(form, 'addEmailForm');
    }

    _SetForm=(form={}, formName='', formOpts={})=>{
        let currentForm = this.state.form;
                 
        form = {...form, ...formOpts};
        form = setForm(form, currentForm, formName);

        this.setState({form, formName});
    }

    passwordConfirmExpired=(passwordConfirmAuth={})=>{
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
    }
   
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

    handleSubmit=(event, formName)=>{
        event.preventDefault();
        formName && this.setState({formName});
        this.resetSuccessSubmitListers();

        if (formName === 'passwordChangeForm') {
            return this.submitPasswordChange(formName)
        }

        let useToken = true;
        authSubmit(this, formName, useToken);
    }

    submitPasswordChange =(formName)=>{
        let {passwordChanged, entities} = this.props;
        let {userAuth} = entities;
        let passwordConfirmAuth = userAuth?.passwordConfirmAuth;
                       
        if (passwordConfirmAuth) {
            let passwordValidated = passwordConfirmAuth.passwordValidated;

            if (!passwordValidated) {
                return this.openPasswordConfirmationModal()
            }
        }

        let useToken = true;
        authSubmit(this, formName, useToken);
    }

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
        onAddEmailForm,
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
    let addEmailStyles = onAddEmailForm && {opacity:'0.60'} || {};
    
    return(
        <div className="email-settings account-settings">
            <ul className="settings-items">
                <li className="">
                    Email
                </li>
            </ul>
            <div className="account-email">
                <div className="primary-email-box">
                    <ul className="primary-email-title">
                        <li className="">
                           Primary Email
                        </li>
                    </ul>
                    <ul className="primary-email">
                        <li>{email}</li>
                    </ul>
                </div>
                <NonPrimaryEmail {...props}/>

                <div className="add-email-btn-box">
                    <button type="button" 
                            style={addEmailStyles}
                            disabled={onAddEmailForm}
                        onClick={()=>toggleEmailForm()} 
                        className="btn-sm add-email-btn">
                        Add Another Email Address
                    </button>
                    <AddEmailAddressForm {...props}/>
                </div>

            </div>
        </div>  
    )
};


const PhoneNumberSettings = (props) => {
    let {togglePhoneNumberForm,
         onAddPhoneNumberForm,
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

    let addPhoneNumberStyles = onAddPhoneNumberForm && {opacity:'0.60'} || {};
    
    return (
        <div className="phone-number-settings account-settings">
            <ul className="settings-items">
                <li>
                    Phone Number
                </li>
            </ul>

            <div className="account-phone-number">
                <div className="primary-email-box">
                    <ul className="primary-email-title">
                        <li className="">
                           Primary Phone Number
                        </li>
                    </ul>

                    <ul>
                        <li className="primary-phone-number">
                            {phoneNumber}
                        </li>
                    </ul>
                </div>
                
                <NonPrimaryPhoneNumber {...props}/>
                <div className="add-email-btn-box">
                   <button type="button"
                           style={addPhoneNumberStyles}
                           disabled={onAddPhoneNumberForm} 
                           onClick={()=>togglePhoneNumberForm()}
                           className="btn-sm add-email-btn">
                        Add Another Phone Number
                    </button>
                    <AddPhoneNumberForm {...props}/>
                </div>
            </div>
        </div>    
    )

};


const PasswordChangeSettings = (props) =>{
    let {togglePasswordChangeForm,
         onPasswordChangeForm,
         currentUser,} = props;

    let account = currentUser;
    let formDescription = 'Enter a new passsword on both fields.';
    let passswordProps = {...props, formDescription};
    let changePasswordStyles = onPasswordChangeForm && {opacity:'0.60'} || {};

    return(
        <div className="">
            <div className="password-settings account-settings">
                <ul className="settings-items">
                    <li>
                        Password
                    </li>
                </ul>

                <div className="change-password-btn-box">
                    <button type="button"
                        style={changePasswordStyles}
                        disabled={onPasswordChangeForm}
                        onClick={()=>togglePasswordChangeForm()}
                        className="btn-sm change-password-btn">
                        Change Password
                    </button>
                    
                </div>

            </div>
            {onPasswordChangeForm &&
                <PasswordForm {...passswordProps}/>
             }
            
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
                    <ul className="non-primary-email-btns">
                        {!email.verified &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=> sendConfirmation(email.email)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removePhoneNumber(email) }>
                                Remove
                        </button>
                    </ul>
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
                    <ul className="non-primary-email-btns">
                        {!phoneNumber.verified &&
                        <button
                            type="button" 
                            className="btn-sm confirm-email-btn"
                            onClick={()=> sendConfirmation(phoneNumber.primary_number)}>
                            confirm
                        </button>   
                        }
                    
                        <button
                            type="button" 
                            className="btn-sm remove-email-btn"
                            onClick={()=> removePhoneNumber(phoneNumber.primary_number)}>
                                Remove
                        </button>
                    </ul>
                </div>
                )
            })}
        </div>
    )
}

const AddEmailAddressForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         submitting,
         formName,
         form} = props;

    form = form && form.addEmailForm;
    if (!form) return null;
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};
        
    return(
        <form className="add-email-form">
            <fieldset style={fieldSetStyles} 
                      disabled={submitting} >
                <div className="add-email-form-contents">
                    <div className="add-email-input-box">
                        <input 
                            className="add-email-input"
                            type="email" 
                            name="email"
                            placeholder="name@example.com"
                            value={form && form.email}
                            onChange={(event)=> handleFormChange(event, 'addEmailForm')}
                        />
                    </div>

                    <div className="submit-email-btn-box">
                        <button type="button"
                            onClick={(event)=> onSubmit(event, 'addEmailForm')}
                            className="btn-sm submit-email-btn">
                            Add Email 
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    )

}



const AddPhoneNumberForm = (props)=> {
    let {handleFormChange,
         onSubmit,
         submitting,
         formName,
         form} = props;

    form = form && form.addPhoneNumberForm;
    if (!form) return null;
    let fieldSetStyles = submitting && {opacity:'0.60'} || {};

    return(
        <form className="add-phone-number-form">
            <fieldset style={fieldSetStyles} 
                      disabled={submitting} >
            <div className="add-phone-number-form-contents">
                <div className="add-phone-number-input-box">
                    <input 
                        className="add-phone-number-input"
                        type="number" 
                        name="phone_number"
                        placeholder=""
                        value={form && form.phone_number}
                        onChange={(event)=> handleFormChange(event, 'addPhoneNumberForm')}
                    />
                </div>

                <div className="submit-email-btn-box">
                    <button type="button" 
                        onClick={(event)=> onSubmit(event, 'addPhoneNumberForm')}
                        className="btn-sm submit-email-btn">
                        Add Phone Number 
                    </button>
                </div>
            </div>
            </fieldset>
        </form>
    )

}
