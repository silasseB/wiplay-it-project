import React, { Component } from 'react';
import  * as action  from "actions/actionCreators";
import { Link } from "react-router-dom";
import {store } from "store/index";
import { GetModalLinkProps } from "templates/component-props";
import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import { OpenEditorBtn  } from "templates/buttons";
import {pageMediaBlockRenderer} from 'templates/editor/editor-templates';
import {Editor} from 'draft-js';
import * as checkType from 'helpers/check-types'; 
import { UnconfirmedUserWarning,
         PageErrorComponent, } from "templates/partial-components";

import {getAdmin}  from "dispatch/index"
import Helper from 'utils/helpers';
import  AjaxLoader from "templates/ajax-loader";
import GetTimeStamp from 'utils/timeStamp';

import  MainAppHoc from "components/admin/index-hoc";

const helper   = new Helper();



class AboutAdminPage extends Component {
    isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isAdminPage  : true,
            pageName     : "About Admin",
            about        : undefined, 
            isReloading  : false,


        } 
    };
  

    // static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    //  return  dispatch => action.handleError(error);
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.log(error, info);
    }

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };

    onIndexUpdate = () =>{
 
        const onStoreChange = () => {
            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let {
               index,
               questions,
               posts, 
               answers, 
               errors }   = entities && entities;
                   
            index && this.setState({isReloading : index.isLoading})  

            if (index && index.isSuccess) {
                index.isSuccess = false;
             
                this.updateIndexEntities(index);
               
            }
          
        };
        this.unsubscribe = store.subscribe(onStoreChange);
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onIndexUpdate();
        this.getAboutData()
               
    };

    getAboutData(){
        let {cacheEntities} = this.props;
               
        if (cacheEntities){
            let {about} = cacheEntities;
            about && this.setState({about})
        }

    }

    getProps(){
        return {
            ...this.props,
            ...this.state,
        };
    };

      
    render() {
        let props = this.getProps();
  
        let { entities }  = props ;
        
                    
        return (
            <div style={{paddingTop:'65px'}} className="about-admin-page">
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props}/>

                <div className="about-admin-box">
                    <AboutAdminComponent {...props}/>
                </div>
            </div>
        );
    };
};





export default  MainAppHoc(AboutAdminPage);

let draftContents = {
                    "blocks":[
                            {"key": "dau30","text":"", 
                             "type":"unstyled","depth":0,
                             "inlineStyleRanges":[],
                              "entityRanges":[],
                              "data":{} }
                            ],"entityMap":{}
                        }


export const AboutAdminComponent = props => {
    let about = props.about;
    about = about && about.info;
    let isPut    = about && about.length  && true || false;
    let isPost   = about && !about.length && true || false;
    console.log(props ,about)
    let about_text = about && about.length && about[1].about_text;
    let aboutIsString = checkType.isString(about_text)
    console.log(aboutIsString, about_text)
    if (aboutIsString) {
        for (var i = about_text.length + 1; i >= 0; i++) {
           
           let carecter = about_text[i];
           if (carecter !== '{') {
            let blocks = draftContents.blocks[0]
            let text = blocks.text;
            text = about_text
            draftContents.blocks[0].text = about_text
            console.log(carecter, text, blocks)
            break
           }
        }
    }

    
    let isString = checkType.isString(draftContents)
    console.log(draftContents, isString)
    draftContents = JSON.stringify(draftContents)
    isString =checkType.isString(draftContents)
    console.log(draftContents, isString)
    draftContents = JSON.parse(draftContents);

    isString =checkType.isString(draftContents)
    console.log(draftContents, isString)
    
    return(
        <div className="about-admin-contents" id="about-admin-contents">
            
                
            <div className="">
                {about && about.map( (about, index)=>{
                    let editAboutProps = {
                            isPost,
                            isPut,
                            obj       : about,
                            objName   : 'About',
                            className : "edit-about-admin-btn btn-sm",
                    };
                    editAboutProps = GetModalLinkProps.props(editAboutProps);
                    
                    let editorState = helper.convertFromRaw(about.about_text)
                    
                    if (!editorState) return null;

                    return(
                        <div key={index}>
                            <OpenEditorBtn {...editAboutProps}/>
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
        </div>
    )

}


