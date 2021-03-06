
import React, { Component } from 'react';
import {HelpPageNavBar} from "templates/navBar";
import MainAppHoc from "components/index/index-hoc";



class  HelpContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Help", 
        };       
    }


    componentDidMount() {
       console.log(this.props)
    }

    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="help-continer">
                <HelpPageNavBar {...props}/>
                <div className="help-page">
                    <div className="help-box">
                        <img alt="" 
                             src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                             className="page-placeholder-img"/>       
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(HelpContainer);


