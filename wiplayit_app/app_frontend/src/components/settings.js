
import React, { Component } from 'react';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";


class  SettingsContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Settings", 
        };       
    }


    componentDidMount() {
      console.log(this.props)
    }

    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="settings-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="settings-box">
                    <img alt="" 
                         src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                         className="page-placeholder-img"/> 
                </div>
            </div>
        )
    }
};

export default SettingsContainer; 


