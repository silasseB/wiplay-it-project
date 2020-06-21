import {store} from 'store/index';
import Api from 'utils/api';
import {authenticate} from 'dispatch/index';
import Helper from 'utils/helpers';




export default class FormValidator {
    constructor(props){
        this.formName = props.formName;
        this.form = props.form;
    };

    cleanForm(){
        
        const helper = new Helper();
        let formName = this.formName;
        let form     = this.form[formName];
        return helper.createFormData({...form});
    };

    formIsClean(){
        let errors = this.formErrors()
        if (errors) {
            return false;
        }else{
            return true;
        }
    };

    isPhoneNumber(value){
        if (value) {
            return validatePhoneNumber(value);
        }
        return false;
    };

    isEmail(value){
        if (value) {
            return validateEmail(value);
        }
        return false;
    };

    formErrors(){
        let formName = this.formName;
        let form     = this.form[formName];
       
        let formErrors;
        let isValid = formIsValid(form);

        if (!isValid) {
            formErrors = {non_field_errors:['Please fill in all fields']};
        }
                
        if (form.email) {
            let {email} = form;
            if (!this.isEmail(email) && !this.isPhoneNumber(email)) {
                formErrors = {email:['Please enter a valid email or phone number']}
            }
        }

        if (this.isPhoneNumber() && formName === 'signUpForm' && !form.country) {
            formErrors = {country:['Please select your country']}
        }
                
        return formErrors;
    };

};


export const authSubmit =(self)=>{
    let formName = self.state.formName;
    let form     = getForm(self, formName);
       
    _isSubmitting(self, form);
        
    if (!form.formIsClean()) {
        let error = form.formErrors(); 
        return setFormErrors(self, error, formName)
    }

    let apiUrl = getAuthUrl(formName);           
    form       = form.cleanForm();
    return store.dispatch(authenticate({apiUrl, form, formName}));

};

export const getForm =(self, formName)=> {
    let form  = self.state.form;
    return new FormValidator({form, formName});
}; 

export const setFormErrors =(self, error, formName)=> {
    let form        = self.state.form;
    form[formName]['error'] = error
    self.setState({form, submitting : false})
}

export const _isSubmitting=(self, form)=>{

    if (!form) return;
    let isPhoneNumber = form.isPhoneNumber();
    let isEmail       = form.isEmail();   
    self.setState({submitting : true, isEmail, isPhoneNumber})
};

export const formIsValid =(form)=> {
    //Check form is complete
    if (form) {
        for (var key in form) {
            if(/^ *$/.test(form[key])){
                return false; //Form is not complete
            }
        }
        return true
    }else{
        return false
    }
};

export const validatePhoneNumber=(phone_number)=>{
    let numberRegExp = /^\+?[\d\s]+$/
    let isPhoneNumber = numberRegExp.test(phone_number)
                                          
    if (isPhoneNumber) {
        return true
    }

    return false
};

export const validateEmail=(email)=>{
    let emailRegExp;
    emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let isEmail = emailRegExp.test(email)
    if (isEmail) {
        return true
    }
    return false
}



export const setForm =(form, currentForm, formName)=> {
    
    if (currentForm && formName) {
        if (!currentForm[formName]) {
            currentForm[formName] = {...form}
        }
        form = currentForm;
    }else{
        form = Object.defineProperty({}, formName, { value : form });
    }
    return form;
};


export const getFormFields =()=> {
    return {
        loginForm  : {
            'email':'',
            'password':''
        },

        signUpForm : {
            'first_name' : '',
            'last_name'  : '',
            'email'      : '',
            'password'   : '',
            'country'    : '',
        },

        emailForm  : {
            'email'  : '',
        },

        smsCodeForm  : {
            'sms_code'  : '',
        }, 

        passwordChangeForm : {
            'new_password1' : '',
            'new_password2' : '',
        },
    };  
};
export const getAuthUrl =(formName)=> {
    if (!formName) return;
    const api = new Api();
        
    switch(formName){
        case 'loginForm':
            return api.logginUser();
        case 'signUpForm':
            return api.createUser();
                
        case 'passwordResetForm':
            return api.passwordResetApi();

        case 'passwordChangeForm':
                    return api.passwordResetConfirmApi();

        case 'passwordResetSmsCodeForm':
            return api.passwordResetSmsConfirmApi();

        case 'emailResendForm':
            return api.confirmationEmailResendApi();

        case 'phoneNumberSmsCodeForm':
            return api.accountConfirmPhoneNumberApi()

        default:
            return  '';
    };
            
};
