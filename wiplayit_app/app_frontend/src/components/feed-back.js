
import React, { Component } from 'react';
import withHigherOrderIndexBox from "components/index/higher_order_index";
import {TextAreaEditor} from 'templates/editor/editor-templates';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";


class FeedBackContainer extends Component{

   constructor(props) {
        super(props);
        this.state = { 
            form     : {feedback : "" },
            pageName : "Feedback", 
        };       
    }

    onChange(event) {
        event.preventDefault();
        let form = this.state.form;
        form[event.target.name] = event.target.value;
        this.setState({form});

    }

    componentDidMount() {
        
    }

   textAreaProps() {
        return {
           value       : this.state.form.feedback,
           onChange    : this.onChange,
           name        : "feedback",
           className   : "feedback-textarea-field",
           placeholder : 'Your Feedback',
        };
    };

    _handleSubmit(event){
        console.log(event)
        let {form} = this.state

    }

    render(){
        let textAreaProps = this.textAreaProps;
        let props = {...this.props, ...this.state}

        return(
            <div className="feedback-form-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="feedback-form-container">
                    <div className="feedback-form-box">
                        <TextAreaEditor {...textAreaProps}/>
            
                        <button
                            onClick={() => this._handleSubmit}
                            className="btn-sm add-link">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }
};

export default withHigherOrderIndexBox(FeedBackContainer); 


