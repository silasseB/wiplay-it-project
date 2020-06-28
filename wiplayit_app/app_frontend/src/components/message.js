
import React, {Component} from 'react';
import {MessageForm} from 'templates/forms';
import {formIsValid} from 'components/authentication/utils';
import {sendMessage} from 'dispatch/index';
import {store} from "store/index";
import Helper from 'utils/helpers';


class MessageFormContainer extends Component{
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = { 
            form     : {full_name   : 'Silas Valoi',
                        email       : 'silasbaloy@hotmail.com',
                        subject     : 'Please improve the app',
                        description : 'Add a mesage feacture',},
            error     : '',
            submitting : false,
            displayMessage :false,
            pageName  : 'Feedback', 
        }; 

        this.handleChange = this.onChange.bind(this);      
        this.handleSubmit = this._handleSubmit.bind(this);
    };

    componentDidMount() {
        this.isMounted = true;
        this.onStoreUpdate();
        
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onStoreUpdate = () =>{
        if (!this.isMounted) return;    
        const onStoreChange = () => {
            let storeUpdate  = store.getState();
            let {entities }  = storeUpdate;
            let {errors, message}  = entities;
           

            if (message) {
                this.setState({submitting:message.isLoading || false});
                 
                let {error} = message;
                if (error) {
                    this.setState({error})
                    delete message.error;
                }
            }        
            
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
      

    onChange(event) {
        event.preventDefault();
        let form = this.state.form;
        form[event.target.name] = event.target.value;
        this.setState({form});
    };

    
    textAreaProps() {
        let {form} = this.state;
        return {
           value       : form.description,
           onChange    : this.handleChange,
           name        : "description",
           className   : "message-textarea-field",
           placeholder : '',
        };
    };

    _handleSubmit(){
        let {form} = this.state
        let isValid = formIsValid(form);
        
        if (!isValid) {
            let error = {non_field_errors : ['Please fill in all fields']};
            return this.setState({error})
        }

        this.setState({submitting:true})
        const helper   = new Helper();
        let   {apiUrl} = this.props;
        let   formData = helper.createFormData({...form});

        store.dispatch(sendMessage({apiUrl, formData}))
    };

    render(){
        let textAreaProps = this.textAreaProps();
        let props  = {
                ...this.props,
                ...this.state,
                textAreaProps,
                handleChange :this.handleChange,
                handleSubmit : this.handleSubmit,
            };

       
        return(
            <div className="message-container">
                <MessageForm {...props}/>
            </div>
        )
    }
};

export default MessageFormContainer; 


