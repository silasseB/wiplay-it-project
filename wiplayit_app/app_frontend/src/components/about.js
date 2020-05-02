
import React, { Component } from 'react';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";




class  AboutContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "About", 
        };       
    }

    componentDidMount() {
      console.log(this.props)
    }

    render(){
        let props = {...this.props, ...this.state}

        return(
         <div className="about-info-page">
            <PartalNavigationBar {...props}/>
            <NavigationBarBigScreen {...props} />
            <div className="about-info-box">
                <img alt="" 
                     src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                     className="page-placeholder-img"/> 
            </div>
         </div>
        )
    }
};

export default AboutContainer; 


