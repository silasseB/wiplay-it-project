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

        if (formName === 'signUpForm' && !form.country) {
            formErrors = {country:['Please select your country']}
        }
                
        return formErrors;
    };

};


export const authSubmit =(self, formName="", useToken=false)=>{
    formName  = !formName && self.state.formName || formName;
    let form  = getForm(self, formName);
    console.log(formName)
    console.log(form)
    console.log(self.state)
       
    _isSubmitting(self, form);
        
    if (!form.formIsClean()) {
        console.log(form.formErrors(), formName)
        let error = form.formErrors(); 
        return setFormErrors(self, error, formName)
    }

    let apiUrl = getAuthUrl(formName);           
    form       = form.cleanForm();
    return store.dispatch(authenticate({apiUrl, form, formName, useToken}));

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

export const changeForm =(self, event)=> {
    let  {form, formName} = self.state;
    
    if (form && formName) {
        form[formName][event.target.name] = event.target.value;
        self.setState({form});
    }
};

export const setForm =(form, currentForm, formName)=> {
    
    if (currentForm && formName) {
        if (!currentForm[formName]) {
            currentForm[formName] = {...form}
        }
        form = currentForm;
    }else{
        let formValue = {
            value        : form,
            writable     : true,
            configurable : true,
            enumerable   : true,
        };

        form = Object.defineProperty({}, formName, formValue);
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
        phoneNumberForm : {phone_number:''}, 

    };  
};
export const getAuthUrl =(formName)=> {
    if (!formName) return;
    const api = new Api();
        
    switch(formName){
        case 'loginForm':
        case 'reLoginForm':
            return api.logginUser();

        case 'signUpForm':
            return api.createUser();
                
        case 'passwordResetForm':
            return api.passwordResetApi();

        case 'passwordChangeForm':
            return api.passwordChangeApi();

        case 'passwordChangeConfirmForm':
            return api.passwordChangeConfirmApi()

        case 'passwordResetSmsCodeForm':
            return api.passwordResetSmsConfirmApi();

        case 'emailResendForm':
            return api.confirmationEmailResendApi();

        case 'phoneNumberSmsCodeForm':
            return api.accountConfirmPhoneNumberApi();

        case 'emailForm':
            return api.addEmailApi();

        case 'phoneNumberForm':
            return api.addPhoneNumberApi();

        default:
            return  '';
    };
            
};
