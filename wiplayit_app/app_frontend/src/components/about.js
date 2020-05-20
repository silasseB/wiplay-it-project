
import React, { Component } from 'react';
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import  MainAppHoc from "components/index/index-hoc";
import {store} from "store/index";
import {getAboutInfo} from "dispatch/index"
import {pageMediaBlockRenderer} from 'templates/editor/editor-templates';
import {Editor,EditorState, convertFromRaw} from 'draft-js';
import {decorator} from 'components/draft-js-editor/editor'



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
         <div className="about-info-page">
            <PartalNavigationBar {...props}/>
            <NavigationBarBigScreen {...props} />
            <div className="about-info-box">
                <AboutComponent {...props}/>
            </div>
         </div>
        )
    }
};

export default AboutContainer; 


export const AboutComponent = props => {
    console.log(props)
    let about = props.about;
    about = about && about.info;
    
    return(
        <div>
            {about && about.map( (about, index)=>{
                let   storedState    = JSON.parse(about.about_text);
                const contentState   = storedState && convertFromRaw(storedState);
                const editorState    = contentState && 
                                       EditorState.createWithContent(contentState, decorator);

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

