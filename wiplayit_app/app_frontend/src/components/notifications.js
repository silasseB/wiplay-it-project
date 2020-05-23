
import React, { Component } from 'react';
import MainAppHoc from "components/index/index-hoc";
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen } from "templates/navBar";




class  NotificationsContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Notifications",
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
                <ul className="">
                    <li>Notifications empty</li>
                </ul>
            </div>
         </div>
        )
    }
};

export default MainAppHoc(NotificationsContainer); 


