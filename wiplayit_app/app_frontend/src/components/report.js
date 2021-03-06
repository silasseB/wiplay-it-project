
import React, { Component } from 'react';
import {HelpPageNavBar} from "templates/navBar";
import MessageFormContainer from 'components/message';
import MainAppHoc from "components/index/index-hoc";
import Api from 'utils/api';


class ReportContainer extends Component{

   constructor(props) {
        super(props);
        this.state = { 
            pageName : "Report", 
        };       
    };

    componentDidMount() {
        
    };
 

    render(){
        let api    = new Api()
        let apiUrl = api.getBugReportApi();
        let props = {
                ...this.props,
                ...this.state,
                apiUrl,
            }

        return(
            <div className="app-box-container app-profile-box">
                <HelpPageNavBar {...props}/>        
                <div className="report-page">        
                    <div className="report-container">
                        <div className="report-box">
                            <MessageFormContainer {...props}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export default MainAppHoc(ReportContainer); 


