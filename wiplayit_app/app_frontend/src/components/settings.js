
import React, {Component} from 'react';
import MainAppHoc from "components/index/index-hoc";
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen} from "templates/navBar";



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
            <div className="">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/> 
                <div className="settings-page">
                <div className="settings-box">
                    <img alt="" 
                         src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                         className="page-placeholder-img"/> 
                </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(SettingsContainer); 


