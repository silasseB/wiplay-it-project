
import React, { Component } from 'react';
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen } from "templates/navBar";




class  NotificationsContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "About",
            notificationsTab : {color:'#A33F0B'}, 
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
            <NavigationBarBottom {...props}/>
            <div className="about-info-box">
                <img alt="" 
                     src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                     className="page-placeholder-img"/> 
            </div>
         </div>
        )
    }
};

export default NotificationsContainer; 


