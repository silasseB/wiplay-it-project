
import React, { Component } from 'react';
import {TextAreaEditor} from 'templates/editor/editor-templates';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";


class ReportContainer extends Component{

   constructor(props) {
        super(props);
        this.state = { 
            form     : {report : "" },
            pageName : "Report", 
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
           value       : this.state.form.report,
           onChange    : this.onChange,
           name        : "report",
           className   : "report-textarea-field",
           placeholder : 'Report',
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
            <div className="report-form-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="report-form-container">
                    <div className="report-form-box">
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

export default ReportContainer; 


