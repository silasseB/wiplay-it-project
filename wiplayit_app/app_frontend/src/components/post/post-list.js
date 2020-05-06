import React, { Component } from 'react';

import { PostComponent} from "templates/post/post-templates";
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import  MainAppHoc from "components/index/index-hoc";

import { UnconfirmedUserWarning,PageErrorComponent, } from "templates/partial-components";

import {PartalNavigationBar,NavigationBarBigScreen } from "templates/navBar";
import  AjaxLoader from "templates/ajax-loader";
 








class  PostListPage extends Component  {
    isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            isPostListBox : true,
            postListById  : 'filteredPosts',
             pageName     : "Posts", 
            isReloading   : false,
        }
     
    }
    

    onPostListUpdate = () =>{

        const onStoreChange = () => {

            let storeUpdate    = store.getState();
            let {entities }    = storeUpdate;
            let {postListById} =  this.state;
            let posts          =  entities.posts[postListById];

            if (this.isMounted && posts) {
                this.setState({
                            isReloading : posts.isLoading,
                            error : posts.error} ) 
            }
            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };
      

    componentWillUnmount() {
        this.isMounted = false;
        this.unsubscribe();
    };
      
    componentDidMount() {
        this.isMounted = true;
        this.onPostListUpdate();
        console.log(this.props)
        var postListById = this.state.postListById;
        let { cacheEntities } = this.props;
        let { posts, currentUser } = cacheEntities;
        posts  =  posts[postListById]

        let postList = posts.postList;

        if (postList) {
            console.log(posts)
            store.dispatch(action.getPostListPending(postListById));
            store.dispatch(action.getPostListSuccess( postListById ,postList));
            return
        }

        this.props.getPostList(postListById);                           
    }

    reLoader =()=>{
        let postListById = this.state.postListById;   
        this.isMounted && this.setState({isReloading : true})
        return this.props.getPostList(postListById);
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
        //let style =  {border:'1px solid red',padding:'60px 0 0 0', margin:'100px 0 0 0'}
        var posts  = props.entities.posts;
        console.log(posts)
        posts  = posts[props.postListById];
        console.log(props, posts)

        return (
            <div>
                <PartalNavigationBar {...props}/>
                <NavigationBarBigScreen {...props} /> 
                
                { posts &&
                    <div className="app-box-container post-list-page" id="post-list-page">
                        <UnconfirmedUserWarning {...props}/>
                        
                        { posts.isLoading && 
                            <div  className="page-spin-loader-box partial-page-loader">
                                <AjaxLoader/>
                            </div>
                        }

                        { posts.error && posts.error &&
                            <PageErrorComponent {...props}/>
                        }
                          
                       <Posts {...props}/>
                    </div>
                }
            </div>
        );
    };

};


export default MainAppHoc(PostListPage);






const Posts = props => {

    var posts  = props.entities.posts;
    posts  = posts[props.postListById];
    let postList = posts && posts.postList;
    console.log(posts)

    return (
        <div>
            {postList && postList.map(( post, index )  => {
                let postProps = {post:post} 
                Object.assign(postProps, props);
               
                return (
                    <div key={post.id}>
                        <PostComponent {...postProps}/>
                    </div>
                );
            })}
        </div>        
    );
};





 