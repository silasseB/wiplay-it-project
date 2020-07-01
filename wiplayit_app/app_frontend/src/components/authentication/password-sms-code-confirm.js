import React, { Component } from 'react';
import EmailForm, {SmsCodeForm}   from 'templates/authentication/email-form'; 
import AuthenticationHoc  from 'components/authentication/index-hoc';  
import {NavBar, CancelEmailFormBtn} from 'templates/authentication/utils';
import {PassWordChangeForm,
        SuccessPasswordChange} from 'templates/authentication/password-change';
import {authenticationSuccess} from 'actions/actionCreators';
import {store} from 'store/index';

class PasswordChangeSmsCodePage extends Component{
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            navbarTitle                : 'Passward Change',
            formTitle                  : 'Enter code',
            passswordChanged           : false,  
            onPasswordResetSmsCodeForm : true,  
            onPasswordChangeConfirmForm : false,
            defaultFormName            : 'passwordResetSmsCodeForm',
            smsCode                    : undefined,                         
        };
    
    };
    componentDidUpdate(prevProps, nexProps){
        //console.log(prevProps, nexProps)
        let {onPasswordResetForm} = prevProps
        if (!onPasswordResetForm) {
            //this.props.formConstructor('passwordResetSmsCodeForm');
        }
        
    };


    componentDidMount() {
        
        this.isMounted = true;
        this.onAuthStoreUpdate();
        let {location} = this.props;
        let state = location && location.state || {};
        this.setState({...state})
       
        this.props.formConstructor('passwordResetSmsCodeForm');

        let cachedCode =   this.getCachedSmsCode();
        if (cachedCode) {
           this.tooglePasswordChangeForm(cachedCode)
        }
    };

    onAuthStoreUpdate =()=> {
        const onStoreChange = () => {
            let  storeUpdate       = store.getState(); 
            let {entities}         =  storeUpdate;
            let {userAuth, errors} = entities;
            let {smsCodeAuth, passwordChangeAuth}  = userAuth;
            console.log(userAuth)
         
            if (smsCodeAuth && smsCodeAuth.successMessage) {
                delete smsCodeAuth.successMessage;
                let {smsCode} = smsCodeAuth; 
                this.tooglePasswordChangeForm(smsCode)

            }else if(passwordChangeAuth && passwordChangeAuth.successMessage){
                delete passwordChangeAuth.successMessage;

                this.setState({passswordChanged:true});
                this.handlePasswordChangeSuccess(userAuth);
                
            }
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };


    handlePasswordChangeSuccess=(userAuth)=>{
        console.log(userAuth)
        
        let smsCodeAuth = {
                smsCodeValidated : false,
                smsCode : undefined,
            }
        store.dispatch(authenticationSuccess({smsCodeAuth}))
    };

    tooglePasswordChangeForm=(smsCode)=>{
        console.log(smsCode)
        if (smsCode) {
            let onPasswordChangeConfirmForm = true;
            let onPasswordResetSmsCodeForm = false;
            let passwordAuthOpts = {sms_code:smsCode};
            this.props.formConstructor('passwordChangeConfirmForm', passwordAuthOpts);

            this.setState(
                {smsCode,
                 onPasswordChangeConfirmForm,
                 onPasswordResetSmsCodeForm}
                 )
        }
    };

    componentWillUnmount =()=> {
        this.isMounted = false;
        this.unsubscribe();
    };

    getCachedSmsCode =()=> {
        let cacheEntities = this.props.cacheEntities;
        let userAuth = cacheEntities && cacheEntities.userAuth;
        
        if (userAuth && userAuth.smsCodeAuth) {
            let smsCodeAuth = userAuth.smsCodeAuth;
            let {smsCode, smsCodeValidated} = smsCodeAuth;
            if (smsCode && smsCodeValidated) {
                return smsCode;
            }
        }
        return undefined;
    };

    getProps=()=>{
        return {
            ...this.props,
            ...this.state, 
            cachedCode : this.getCachedSmsCode(),
        };

    }



    render(){
        let props = this.getProps();
                        
        return (
            <div className="registration-page">
                <NavBar {...props}/>
                <div className="password-change-container registration-container">
                    {props.passswordChanged &&
                        <SuccessPasswordChange {...props}/>
                        ||
                        <PasswordChange {...props}/>
                    }
                </div>   
            </div>
        )
    };
};



export default AuthenticationHoc(PasswordChangeSmsCodePage);

const PasswordChange =(props)=>{
    let {onPasswordResetForm, defaultFormName} = props;
        
    let passwordChangeProps = {
        formTitle          : 'Password Change',
        formDescription    : 'Enter a new passsword on both fields.',
    };

    let toggleProps    = {
            value : true,
            formName : 'passwordResetForm',
            defaultFormName,
        };
    
    passwordChangeProps = {...props, ...passwordChangeProps}
    return(
            <div className="password-change-contents">
                {props.smsCode &&
                    <PassWordChangeForm {...passwordChangeProps}/>
                    ||
                    <div>
                        {onPasswordResetForm &&
                            <EmailForm {...props}>
                               <CancelEmailFormBtn {...props}/>
                               
                            </EmailForm> 

                            ||

                            <SmsCodeForm {...props}>
                                <SmsCodeHelperText {...props}/>
                                <button type="button" 
                                       onClick={()=> props.toggleEmailForm(toggleProps)}
                                       className="resend-email-btn" >
                                    Resend
                                </button>
                            </SmsCodeForm>
                        }
                    </div>
                }
            </div>
        )
}


const SmsCodeHelperText = (props)=>{
    let {cacheEntities, passwordRestAuth,} = props;
    let {userAuth}     = cacheEntities || {};
    
    if (!passwordRestAuth) {
        passwordRestAuth =  userAuth && userAuth.passwordRestAuth;
    }
    let {identifier} = passwordRestAuth || {};

    return (
        <ul className="form-helper-text">
            <li>
                We sent a code to your phone {' '} 
                <span className="text-highlight">
                { identifier }.
                </span> Please enter the code to change password.
            </li>
        </ul>
    )
};