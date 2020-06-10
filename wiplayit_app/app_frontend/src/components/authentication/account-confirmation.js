import React, { Component } from 'react';
import  AuthenticationHoc   from 'components/authentication/index-hoc'; 
import {NavBar} from 'templates/authentication/utils';
import AccountConfirmation from 'templates/authentication/confirmation';
import {SmsCodeForm}   from 'templates/authentication/email-form'; 
import { ModalCloseBtn } from "templates/buttons"
import * as Icon from 'react-feather';

import FormValidator, {getFormFields,
                       formIsValid,
                       authSubmit,
                       getAuthUrl,
                       setForm,} from 'components/authentication/utils';         
import {store} from "store/index";
import Axios from 'utils/axios_instance'
import {authenticateWithGet}  from "dispatch/index"
import Api from 'utils/api';

const api = new Api();

  

class AccountEmailConfirmationPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            pageTitle        :  'Account Confirmation',
            navbarTitle      :  'Confirm Account',
            formDescription  :  ['Enter your email address'],
        };
    };
   
    componentDidMount() {
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
            formName         : undefined, 
            submitting       : false,
            form             : undefined,
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
            let { entities } =  storeUpdate;
            let { userAuth, errors } = entities;
            this.setState({submitting : userAuth.isLoading}); 
            let {form, formName} = this.state;
            let {error, loginAuth} = userAuth;

            if (form && error) {
                form[formName]['error'] = error;
                this.setState({form});
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
   
    componentDidMount() {
        this.isMounted = true;
        this.onAuthStoreUpdate();

        let currentForm = this.state.form;
        let formName =  'phoneNumberSmsCodeForm';

        let form = getFormFields().smsCodeForm;
        form = setForm(form, currentForm, formName);
        this.setState({form, formName});

          
    };

    toggleSmsCodeForm(){
        let currentForm = this.state.form;
        let formName    =  'phoneNumberSmsCodeForm';
        let onPasswordResetSmsCodeForm = true;

        let form = getFormFields().smsCodeForm;
        form = setForm(form, currentForm, formName);
        this.setState({form, formName, onPasswordResetSmsCodeForm});

    }

    toggleEmailForm(params){
        
        if (params && !params.value) {
            this.setState({onEmailResendForm:false});
            return this.toggleSmsCodeForm();

        }
        let currentForm = this.state.form;

        let form     = getFormFields().emailForm;
        let formName = 'emailResendForm';
        let onEmailResendForm = true;
        form = setForm(form, currentForm, formName);
       
        this.setState({form, formName, onEmailResendForm});

    }


    handleChange=(e)=>{
        e.preventDefault()
        let  { form, formName } = this.state;
        if (form) {
            form[formName][e.target.name] = e.target.value;
            this.setState({form});
        }
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
                        <SmsCodeForm {...props}>
                            <SmsCodeHelperText {...props}/>  
                        </SmsCodeForm>
                    </div>
                </div>
            </div>
        );
    };
};



const SmsCodeHelperText = (props)=>{
    let {cacheEntities, currentUser} = props;
    let phone_number = currentUser && currentUser.phone_numbers;
    phone_number = phone_number && phone_number.national_format;
    
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