
import React, { Component } from 'react';
import withHigherOrderIndexBox from "containers/index/higher_order_index";
import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";



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
            <div className="help-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} />
                <div className="help-box">
                    <img alt="" 
                         src={require("media/pages-placeholder/pageUnderConstruction.jpeg")} 
                         className="page-placeholder-img"/>       
                </div>
            </div>
        )
    }
};

export default withHigherOrderIndexBox(HelpContainer);


