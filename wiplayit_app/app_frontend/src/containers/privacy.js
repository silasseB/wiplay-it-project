
import React, { Component } from 'react';
import withHigherOrderIndexBox from "containers/index/higher_order_index";
import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";
import pageUnderConstruction  from "media/pages-placeholder/pageUnderConstruction.jpeg";


class  PrivacyContainer extends Component  {
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "Privacy", 
        };       
    }


    componentDidMount() {
      console.log(this.props)
    }

    
    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="privacy-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="privacy-box">
                    <img alt="" 
                         src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                         className="page-placeholder-img"/> 
                </div>
            </div>
        )
    }
};

export default withHigherOrderIndexBox(PrivacyContainer); 


