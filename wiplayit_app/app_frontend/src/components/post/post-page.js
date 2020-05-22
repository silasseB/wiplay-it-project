import React, { Component } from 'react';

import {PartalNavigationBar,
    NavigationBarBottom,
    NavigationBarBigScreen } from 'templates/navBar';

import  AjaxLoader from 'templates/ajax-loader';

import { PostComponent} from 'templates/post/post-templates';
import  MainAppHoc from "components/index/index-hoc";

import { UnconfirmedUserWarning, PageErrorComponent } from 'templates/partial-components';

import  * as action  from 'actions/actionCreators';
import { getPost } from 'dispatch/index';
import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';






class  PostPage extends Component  {
    isMounted = false;
    constructor(props) {
      super(props);

        this.state = {
            isPostBox   : true,
            isReloading : false,
            pageName    : "Post", 
            postById    : '',
            error       : '',
        };
    };

    onPostUpdate = () =>{

        const onStoreChange = () => {

            let storeUpdate   = store.getState();
            let {entities }   = storeUpdate;
            let {postById}    =  this.state;
            let post          =  entities.post[postById];
            if (this.isMounted && post) {
                this.setState({
                            isReloading : post.isLoading,
                            error : post.error} ) 
            }
            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };

    componentWillUnmount() {
        this.isMounted = false;
        //this.unsubscribe();
    };
    
    componentDidMount() {
        this.isMounted = true;
        this.onPostUpdate()

        let { entities,
              match,
              location }  =  this.props;

        let { slug, id }  =  match.params;
        let {state}       =  location;

        let postById      = `post${id}`;
        this.setState({postById, id})

        if (state && state.recentlyCreated) {

            let post = state.post
            console.log('Post recently created')
            this.dispatchToStore(postById, post)
            return; 
        }

        let {post} = entities;
        post       = post && post[postById]
        !post && this.updatePostStore(id);

    };


    updatePostStore(id){

        let { cacheEntities } = this.props;
        let { post }     = cacheEntities && cacheEntities;
        post = post[`post${id}`]

        if (post) {
            let timeStamp = post.timeStamp;
            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = parseInt(getTimeState.menutes());
            console.log(menDiff  + ' ' + 'Menutes ago')
            console.log(menDiff <= 0)
                
               
            if (menDiff <= 10) {
                post     = post.post;
                let postById = `post${id}`;
                this.setState({postById })
                console.log('Post found from cachedEntyties')
                this.dispatchToStore(postById, post)

                return 
            }
        }

        console.log('Fetching post data form the server') 
        return this.props.getPost(id);
    }

    dispatchToStore(postById, post){
        if (postById && post) {
            store.dispatch(action.getPostPending(postById));
            store.dispatch(action.getPostSuccess(postById, post));
        }

    } 

    reLoader =()=>{
        let id = this.state.id;   
        this.isMounted && this.setState({isReloading : true})
        return this.props.getPost(id);
    };
   
    getProps(){

        return {
            ...this.props,
        	...this.state,
            reLoader : this.reLoader.bind(this),
        };
    };

    render() {
        let props = this.getProps();
        var postById = props.postById;
        var post = props.entities.post;
        post = post && post[postById]
                       
        return (
            <div>
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />
                <NavigationBarBottom {...props}/>
                { post &&
                    <div  className="app-box-container">
                        <UnconfirmedUserWarning {...props}/>
                        { post.isLoading &&
                            <div className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        }

                        { post.error &&
                            <PageErrorComponent {...props}/>
                        }
                        
                        {!post.isLoading &&
                            <Post {...props}/>
                        }
                    </div>
                }           
         </div>

            
    );                   
      
    };
   
};


export default MainAppHoc(PostPage);


export const Post = props => {
	var postById = props.postById;
    var postState = props.entities.post[postById];
    let post      = postState.post;
    var postProps = {...props, post}

	return(
        <div className="post-page" id="post-page">
            <div className="post-container">
                <div className="post-contents"> 
                    <PostComponent {...postProps }  />
                </div>
            </div>
        </div>
    );
};


