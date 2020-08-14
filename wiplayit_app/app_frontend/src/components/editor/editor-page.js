import React, { Component } from 'react';

import AppEditor from  "components/editor/index";


export default  class EditorPage extends Component{
    isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
        
        };
    };
    
    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidUpdate(prevProps, nextProps) {
        //console.log()
    }

    componentDidMount(){
        this.isMounted = true;
    
    };
    
    getProps() {
       return{

       }
    }

    render() {
       
        return (
            <div>
                <AppEditor {...props}/>
            </div>
        );
    }
};

