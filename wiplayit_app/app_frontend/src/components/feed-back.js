
import React, { Component } from 'react';
import {TextAreaEditor} from 'templates/editor/editor-templates';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";


class FeedBackContainer extends Component{

   constructor(props) {
        super(props);
        this.state = { 
            form     : {feedback : "" },
            pageName : "Feedback", 
        }; 
        this.handleChange = this.onChange.bind(this);      
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
           onChange    : this.handleChange,
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
        let props  = {...this.props, ...this.state}
        let {form} = props;

        return(
            <div className="feedback-form-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="feedback-form-container">
                    <div className="feedback-form-box">
                        <div className="">
                            <ul className="item-title-box">
                                <li className="item-title">
                                    Full Name
                                </li>
                            </ul>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="" 
                                    className=""
                                    name="full_name"
                                    value={form && form.full_name || ''}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="">
                            <ul className="item-title-box">
                                <li className="item-title">
                                    Your email address
                                </li>
                            </ul>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="About you" 
                                    className=""
                                    name="email"
                                    value={form && form.email || ''}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="">
                            <ul className="item-title-box">
                                <li className="item-title">
                                    Subject
                                </li>
                            </ul>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="" 
                                    className=""
                                    name="subject"
                                    value={form && form.subject || ''}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="">
                            <ul className="item-title-box">
                                <li className="item-title">
                                    Description
                                </li>
                            </ul>

                            <TextAreaEditor {...textAreaProps}/>
                        </div>
            
                        <button
                            onClick={() => this._handleSubmit()}
                            className="btn-sm add-link">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }
};

export default FeedBackContainer; 


