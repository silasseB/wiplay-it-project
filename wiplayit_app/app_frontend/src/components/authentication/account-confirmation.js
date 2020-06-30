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
                this.toggleEmailForm({value:false})

                delete emailResendAuth.successMessage
            }
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
   
    componentDidMount() {
        this.isMounted = true;
        this.onAuthStoreUpdate();
        console.log(this.props)

        let currentForm = this.state.form;
        let formName =  'phoneNumberSmsCodeForm';

        let form = getFormFields().smsCodeForm;
        form = setForm(form, currentForm, formName);
        this.setState({form, formName});

          
    };

    toggleSmsCodeForm(){
        let currentForm = this.state.form;
        let formName    =  'phoneNumberSmsCodeForm';
        let onPhoneNumberSmsCodeForm = true;
        
        let form = getFormFields().smsCodeForm;
        form = setForm(form, currentForm, formName);
        this.setState({form, formName, onPhoneNumberSmsCodeForm});

    }

    toggleEmailForm(params){
        
        if (params && !params.value) {
            this.toggleSmsCodeForm();
            return this.setState({onEmailResendForm:false});
        }

        let currentForm = this.state.form;
        let currentFormName = this.state.formName;
        currentForm[currentFormName].error = undefined; 

        let form     = getFormFields().emailForm;
        let formName = 'emailResendForm';
        let onEmailResendForm = true;
        
        form = setForm(form, currentForm, formName);
       
        this.setState({form, formName, onEmailResendForm});

    }


    handleChange=(e)=>{
        e.preventDefault()
        changeForm(this, e);
    };

    onSubmit =(e)=> {
        e.preventDefault();
        authSubmit(this);
    };
    
    getProps=()=>{
        return{
            handleFormChange : this.handleChange.bind(this),
            toggleEmailForm  : this.toggleEmailForm.bind(this), 
            onSubmit         : this.onSubmit.bind(this),
            validateForm     : formIsValid, 
            ...this.props, ...this.state,
        };
    };
     
    render() {
        let props = this.getProps();
        let {onEmailResendForm, successMessage} = props;
        console.log(props); 

        return (
            <div className="">
                <div>
                    <div className="confirmation-close-box">
                        <ModalCloseBtn> 
                            <Icon.X id="feather-x" size={20}/>
                        </ModalCloseBtn>
                    </div>

                    <div className="account-confirm-modal-container">
                        {onEmailResendForm &&
                            <div className="password-reset-bo">
                                <EmailForm {...props}>
                                    <CancelEmailFormBtn {...props}/>
                                </EmailForm> 
                            </div>
                            ||

                            <SmsCodeForm {...props}>
                                <SmsCodeHelperText {...props}/>  
                            </SmsCodeForm>
                        }
                    </div>
                </div>
            </div>
        );
    };
};



const SmsCodeHelperText = (props)=>{
    let {cacheEntities, currentUser} = props;
    let phone_number = currentUser && currentUser.phone_numbers;
    phone_number     = phone_number && phone_number.national_format;
    
    return (
        <ul className="form-helper-text">
            <li>
                We sent a code to your phone {' '} 
                <span className="unconfirmed-user-email">
                {phone_number}.
                </span> Please enter the code to confrm your number.
            </li>
        </ul>
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
            passwordConfirmed :false,
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
            let {error, loginAuth, isLoading} = userAuth;
            
            this.setState({submitting : isLoading}); 

            if (form && error) {
                form[formName]['error'] = error;
                this.setState({form});
                delete userAuth.error;
            }

            this.handlePasswordConfirmSuccess(userAuth); 
            
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    handlePasswordConfirmSuccess(userAuth){
        if (!userAuth.loginAuth)return;

        let loginAuth    = userAuth.loginAuth
        let {isLoggedIn} = loginAuth;
        let {form, passwordConfirmed,formName} = this.state
                                                                     
        if(isLoggedIn && !passwordConfirmed){
            this.setState({passwordConfirmed:true});
            this.togglePasswordChangeForm();
        }
    };

    togglePasswordChangeForm(){
        let {form}     = this.state;
        let {password} = form && form['reLoginForm'];

        if (password) {
            let passswordParams = {old_password : password};

            this.cachePassword(passswordParams);
            this.props.togglePasswordChangeForm(passswordParams);
            this._closeModal();    
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
    

    _closeModal (){
        let background = true;
        closeModals(background);
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onReLoginStoreUpdate();
        
        let {currentUser} = this.props
        let currentForm   = this.state.form;
        let formName      =  'reLoginForm';

        let form = getFormFields().loginForm;
        form = {...form, email:currentUser.email}
        form = setForm(form, currentForm, formName);
        this.setState({form, formName, currentUser});
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