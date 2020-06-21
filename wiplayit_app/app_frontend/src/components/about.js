
import React, { Component } from 'react';
import {PartalNavigationBar,
        NavigationBarBottom,
        NavigationBarBigScreen} from "templates/navBar";
import  MainAppHoc from "components/index/index-hoc";
import {store} from "store/index";
import {getAboutInfo} from "dispatch/index"
import {pageMediaBlockRenderer} from 'templates/editor/editor-templates';
import {Editor} from 'draft-js';
import Helper from 'utils/helpers';


const helper = new Helper();


class  AboutContainer extends Component  {
    isMounted = false;
    constructor(props) {
        super(props);
        this.state = { 
            pageName : "About", 
        };       
    }
    onAboutInfoUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate = store.getState();
            let {entities } = storeUpdate;
            let {about}     = entities;
            this.setState({about})
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    componentDidMount() {
        this.isMounted = true;
        this.onAboutInfoUpdate()
        store.dispatch(getAboutInfo())
        console.log(this.props)
    }

    render(){
        let props = {...this.props, ...this.state}

        return(
            <div className="">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props}/>
                <NavigationBarBottom {...props}/> 
                <div className="about-info-page">
                    <div className="about-info-box">
                        <AboutComponent {...props}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default MainAppHoc(AboutContainer); 


export const AboutComponent = props => {
    console.log(props)
    let about = props.about;
    about = about && about.info;
    
    return(
        <div>
            {about && about.map( (about, index)=>{
                let editorState = helper.convertFromRaw(about.about_text)
                return(
                    <div key={index}>
                        <div className="">
                            <h2 className="about-info-title">{about.about_title}</h2>
                        </div>

                        <div>
                            <Editor
                                blockRendererFn={pageMediaBlockRenderer}
                                editorState={editorState} 
                                readOnly={true} 
                            />
                        </div>

                        <div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

