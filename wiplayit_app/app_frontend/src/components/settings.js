
import React, {Component} from 'react';

import GetTimeStamp from 'utils/timeStamp';
import Api from 'utils/api';
import {store} from 'store/index';
import MainAppHoc from 'components/index/index-hoc';
import {Modal} from 'components/modal/modal-container';
import {getCurrentUserSuccess, authenticationSuccess} from 'actions/actionCreators';
import {SettingsTemplate} from 'templates/settings';
import {formIsValid,
        validateEmail,
        authSubmit,
        changeForm,
        getFormFields,
        setForm,} from 'components/authentication/utils';   
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

            this.handlePhoneNumberAddSuccess(phoneNumberOrEmailAuth);
                 
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };


    handlePhoneNumberAddSuccess(phoneNumberOrEmailAuth){
        if (!phoneNumberOrEmailAuth) return;

        let {phoneNumberOrEmailAdded} = this.state;
        let {currentUser} = this.props;

        if (!phoneNumberOrEmailAdded) {
            let successMessage = 'Your new phone number has been added successfully.'
            this.props.displaySuccessMessage(successMessage)
            
            let {phone_numbers,
                 email_address} =  phoneNumberOrEmailAuth || {};
            
            if (phone_numbers?.length ) {
                currentUser = {...currentUser, phone_numbers};

            }else if (email_address?.length) {
                currentUser = {...currentUser, email_address};
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
            return timeStamp.menutes() >= 1;
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
            displaySuccessMessage   : this.props.displaySuccessMessage,
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
        this.setState({phoneNumberOrEmailAdded:false, passwordChanged:false})
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
