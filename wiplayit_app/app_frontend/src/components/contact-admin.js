
import React, {Component} from 'react';
import {HelpPageNavBar} from 'templates/navBar';
import MessageFormContainer from 'components/message';
import Api from 'utils/api';
import  MainAppHoc from "components/index/index-hoc";


class ContactAdminContainer extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Contact us", 
        }; 
    };

    componentDidMount() {
        
    }


    render(){
        let api    = new Api()
        let apiUrl = api.getContactAdminApi();
        let props  = {
                ...this.props,
                ...this.state,
                apiUrl,
            };
        
        return(
            <div className="app-box-container">
                <HelpPageNavBar {...props}/>
                <div className="feedback-page">
                    <div className="feedback-container">
                        <ul className="feedback-title">
                            <li className="">
                                How can we help you?
                            </li>
                        </ul>
                        
                        <MessageFormContainer {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(ContactAdminContainer); 


