import React, { Component } from 'react';

import  AuthenticationHoc   from 'components/authentication/index-hoc'; 
import {NavBar} from 'templates/authentication/utils';
import AccountConfirmation from 'templates/authentication/confirmation';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form';
import {PasswordConfirmForm} from 'templates/authentication/password-change'
import {CancelEmailFormBtn} from  'templates/authentication/utils'
import { closeModals}   from  'components/modal/helpers';
import { ModalCloseBtn } from "templates/buttons";
import {authenticationSuccess} from 'actions/actionCreators';
import * as Icon from 'react-feather';

import {formIsValid,
        authSubmit,
        changeForm,
        validatePhoneNumber,
        validateEmail,
        getFormFields,
        setForm,} from 'components/authentication/utils';         
import {store} from "store/index";
import {authenticateWithGet}  from "dispatch/index"
import Api from 'utils/api';

const api = new Api();

  

class AccountEmailConfirmationPage extends Component{
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            pageTitle        :  'Account Confirmation',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Enter your email address'],
        };
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
    };
   
    componentDidMount() {
        this.isMounted = true
        let {match} = this.props;
        let {params} = match || {};
        let { key } = params || {}; 
        key && store.dispatch(authenticateWithGet({key}));  
    };
     
    render() {
        let props = {...this.props,...this.state};
        console.log(props) 
        return (
            <div className="registration-page confirmation-page">
                <NavBar {...props}/>
                <div>
                    <div className="account-confirm-container registration-container">
                        <AccountConfirmation {...props } />   
                    </div>
                </div>
            </div>
        );
    };
};


export default AuthenticationHoc(AccountEmailConfirmationPage);


export class AccountSmsCodeConfirmationPage extends Component{
    isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            onPhoneNumberSmsCodeForm : true,
            formTitle        : 'Enter code',
            formDescription  : ['Enter code to confirm your account'],
            formName         : 'phoneNumberSmsCodeForm',
            defaultFormName  : 'phoneNumberSmsCodeForm', 
            isPhoneNumber    : false,
            isEmail          : false,
            submitting       : false,
            form             : undefined,
            successMessage   : undefined,
        };
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };


    onAuthStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let {userAuth, errors} = entities;
            let {form, formName} = this.state;
            let {error,
                 emailResendAuth,
                 isLoading,
                 loginAuth} = userAuth;
            
            this.setState({submitting : isLoading}); 

            if (form && error) {
                form[formName]['error'] = error;
                this.setState({form});
                delete userAuth.error;
            }
            if (emailResendAuth && emailResendAuth.successMessage) {
                this.setState({successMessage:emailResendAuth.successMessage})
                this.toggleSmsCodeForm()
                
                delete emailResendAuth.successMessage
            }
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
   
    componentDidMount() {
        this.isMounted = true;
        this.onAuthStoreUpdate();
        
        let {currentUser} = this.props;
        let {isPhoneNumber, isEmail} = this.state;
        let email = currentUser && currentUser.email;

        if (email && validatePhoneNumber(email)) {
            isPhoneNumber = true;
            this.toggleSmsCodeForm();

        }else if (email && validateEmail(email)) {}{
            isEmail = true
            this.toggleEmailForm()
        }

        this.setState({currentUser, isEmail, isPhoneNumber});
    };

    toggleEmailForm(){
        let formName    =  'phoneNumberSmsCodeForm';
        let onPhoneNumberSmsCodeForm = true;
        let form = getFormFields().smsCodeForm;
        this.setState({onPhoneNumberSmsCodeForm});
        this._SetForm(form, formName)

    }

    toggleSmsCodeForm=()=>{
        let formName    =  'phoneNumberSmsCodeForm';
        let onPhoneNumberSmsCodeForm = true;
        
        let form = getFormFields().smsCodeForm;
        this.setState({onPhoneNumberSmsCodeForm});
        this._SetForm(form, formName);
    }

    _SetForm(form, formName){
        let currentForm = this.state.form;
        form = setForm(form, currentForm, formName);
        this.setState({form, formName});
    }

    handleChange=(e)=>{
        e.preventDefault()
        changeForm(this, e);
    }

    resendConfirmation =()=> {
        let {currentUser} = this.state;
        let currentForm = this.state.form;
        let email = currentUser &&  currentUser.email;
        
        if (email) {
            let formName = 'emailResendForm';
            let form = getFormFields().emailForm;
            form     = {...form, email}

            form = setForm(form, currentForm, formName);

            this.setState({form, formName});
            console.log(this.state)
            if (this.state.form) {
                authSubmit(this, formName)
            }
        }
    };
    

    onSubmit =(e)=> {
        e.preventDefault();
        authSubmit(this);
    };
    
    getProps=()=>{
        return{
            handleFormChange : this.handleChange.bind(this),
            onSubmit         : this.onSubmit.bind(this),
            resendConfirmation : this.resendConfirmation.bind(this),
            validateForm     : formIsValid, 
            ...this.props, ...this.state,
        };
    };
     
    render() {
        let props = this.getProps();
        let {isPhoneNumber, submitting, successMessage} = props;
        console.log(props); 
        let submitButtonStyles = submitting? {opacity:'0.60'} : {};
    
        let fieldSetStyles = submitting && {opacity:'0.60'} || {};

        return (
            <div className="">
                <fieldset style={ fieldSetStyles} 
                          disabled={submitting} >
                <div>
                    <div className="confirmation-close-box">
                        <ModalCloseBtn> 
                            <Icon.X id="feather-x" size={20}/>
                        </ModalCloseBtn>
                    </div>
                    {isPhoneNumber &&
                        <div className="account-confirm-modal-container">

                            <SmsCodeForm {...props}>
                                <SmsCodeHelperText {...props}/>  
                                <button type="button" 
                                        onClick={()=>
                                                props.resendConfirmation()} 
                                        className="resend-email-btn btn-sm" >
                                    Resend
                                </button>
                            </SmsCodeForm>
                            
                        </div>
                        ||

                        <EmailConfirmation {...props}/>
                    }
                </div>
                </fieldset>
            </div>
        );
    };
};



const SmsCodeHelperText = (props)=>{
    let {cacheEntities, currentUser} = props;
    let phone_number = currentUser && currentUser.phone_numbers[0];
    phone_number     = phone_number && phone_number.national_format;
    
    return (
        <ul className="form-helper-text">
            <li>
                We sent a code to your phone {' '} 
                <span className="text-highlight">
                {phone_number}.
                </span> Please enter the code to confrm your account.
            </li>
        </ul>
    )
}


const EmailConfirmation = (props)=>{
    let {successMessage, currentUser} = props;
    let email = currentUser && currentUser.email;
        
    return (
        <div className="email-confirm-container">
        <div className="email-confirm-box">
            <ul className="email-confirm-title-box">
                <li className="">Account Confirmation</li>
            </ul>
            <div className="email-confirm-contents">
                {successMessage &&
                    <ul className="success-resend-message">
                        <li className="">{successMessage}</li>
                    </ul>
                }

                <ul className="email-confirm-helper-text">
                    <li>
                        We sent a link to your email address {' '} 
                        <span className="text-highlight">{email}</span> with {' '}
                        instructions to confirm your account. {' '} 
                        Please go to your email to confirm you account.
                    </li>
                </ul>
                <div className="resend-email-box">
                    <p className="resend-email-text">
                        You didn't receive any email?
                    </p>

                    <button type="button" 
                            onClick={()=> props.resendConfirmation()} 
                            className="resend-email-btn btn-sm" >
                                Resend
                    </button>
                </div>            
            </div>
        </div>
        </div>
    )
}




export class PasswordConfirmationPage extends Component{
    isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            formDescription   : ['Enter code to confirm your account'],
            formName          : undefined,
            currentUser       : undefined,
            submitting        : false,
            form              : undefined,
            successMessage    : undefined,
            oldPasswordConfirmed : false,
        };
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    onReLoginStoreUpdate =()=> {
        if (!this.isMounted) return;

        const onStoreChange = () => {
            let  storeUpdate = store.getState(); 
            let {entities} =  storeUpdate;
            let {userAuth, errors} = entities;
            let {form, formName} = this.state;
            let {error, 
                 loginAuth,
                 passwordRestAuth,
                 isLoading} = userAuth;
            
            this.setState({submitting : isLoading}); 

            if (form && error) {
                form[formName]['error'] = error;
                this.setState({form});
                delete userAuth.error;
            }

            this.handlePasswordConfirmSuccess(loginAuth); 
            this.handlePasswordRestSuccess(passwordRestAuth);

        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    handlePasswordRestSuccess(passwordRestAuth){
        if (!passwordRestAuth) return;

        if (passwordRestAuth.successMessage) {
            this.props.displaySuccessMessage(passwordRestAuth.successMessage);
            delete passwordRestAuth.successMessage;
            this.togglePasswordConfirmForm();
        }
    }

    handlePasswordConfirmSuccess(loginAuth){
        if (!loginAuth) return;
        
        let {isLoggedIn} = loginAuth;
        let {oldPasswordConfirmed} = this.state
        console.log(this.state, loginAuth)
                                                                     
        if(isLoggedIn && !oldPasswordConfirmed){
            console.log(this.state)
            this.setState({oldPasswordConfirmed:true});
            this.togglePasswordChangeForm();
            delete loginAuth.isLoggedIn
        }
    };

    togglePasswordConfirmForm(){
        let {currentUser} = this.props
        let currentForm   = this.state.form;
        let formName      =  'reLoginForm';

        let form = getFormFields().loginForm;
        form = {...form, email:currentUser.email}
        form = setForm(form, currentForm, formName);
        this.setState({form, formName, currentUser,oldPasswordConfirmed:false});
    }

    togglePasswordChangeForm(){
        let {form}     = this.state;
        let password = form?.reLoginForm?.password;

        if (password) {
            let passswordParams = {old_password : password};
   
            this.props.togglePasswordChangeForm(passswordParams);
            this._closeModal();    
        }
    };
    
    

    _closeModal (){
        let background = true;
        closeModals(background);
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onReLoginStoreUpdate();
        this.togglePasswordConfirmForm();
                
    };
    

    onChange(event, formName) {
        event.preventDefault();
        console.log(formName)

        formName && this.setState({formName})
        changeForm(this, event);
    };

    handleSubmit(event, formName){
        event.preventDefault();

        formName && this.setState({formName});
        let useToken = false;
        authSubmit(this, useToken);
    };

    validateForm(form){
        return formIsValid(form)
    };

    passwordRest =()=> {
        let {currentUser} = this.state;
        let currentForm = this.state.form;
        let email = currentUser &&  currentUser.email;
        if (email) {
            let formName = 'passwordResetForm';
            let form = getFormFields().passwordResetForm;
            form     = {...form, email}

            form = setForm(form, currentForm, formName);
            this.setState({form, formName});
            this.sendPasswordRest();
            
        }

    };

    sendPasswordRest(){
        let formName = 'passwordResetForm';
        authSubmit(this, formName);
    };

    getProps(){
        return{
            ...this.props,
            ...this.state,
            handleFormChange  : this.onChange.bind(this),
            onSubmit          : this.handleSubmit.bind(this),
            validateForm      : this.validateForm.bind(this),
            passwordRest      : this.passwordRest.bind(this),
        };
    };

    render(){
        let props = this.getProps();

        return(
            <PasswordConfirmForm {...props}/>
        )

    };
};