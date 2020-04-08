import React, { Component } from 'react';

import { PostComponent} from "components/post_components";
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import withHigherOrderIndexBox from "containers/index/higher_order_index";
import { UnconfirmedUserWarning } from "components/partial_components";

import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";
import  AjaxLoader from "components/ajax-loader";
 








class  PostListPage extends Component  {
    constructor(props) {
      super(props);

      this.state = {
         isPostListBox   : true,
         postListById : 'filteredPosts'

      }
     
   }
  
      
    componentDidMount() {
        console.log(this.props)
        var postListById = this.state.postListById;
        let { cacheEntities } = this.props;
        let { posts, currentUser } = cacheEntities;
        
      
        

        if (posts) {

            posts  =  posts[postListById]
            console.log(posts)
            store.dispatch(action.getPostListPending(postListById));
            store.dispatch(action.getPostListSuccess( postListById ,posts.postList));
            return
        }
      

        this.props.getPostList(postListById);                           
      
          
   }

   

   getProps(){

      let props = {
         isPostListBox  : this.state.isPostListBox,
         pageName       : "Posts",
         postListById   : this.state.postListById,
      }
      return Object.assign(props,this.props);
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
                
                { posts?
                    <div className="app-box-container">
                        { posts.isLoading? 
                            <div  className="page-spin-loader-box">
                                <AjaxLoader/>
                            </div>
                            : 
                            <div>
                                <Posts {...props}/>   
                            </div>
                        }
                    </div>
                    :
                    ""
                }
            </div>
        );
    };

};


export default withHigherOrderIndexBox(PostListPage);






const Posts = props => {

    var posts  = props.entities.posts;
    posts  = posts[props.postListById];
    console.log(posts)

    return (
        <div>
            {posts && posts.postList?
                <div className="">
                    <UnconfirmedUserWarning {...props}/>

                    { posts.postList.map(( post, index )  => {
                        let postProps = {post:post} 
                        Object.assign(postProps, props);
               
                        return (
                            <div key={post.id}  className="post-list-page" >
                                <PostComponent {...postProps}/>
                            </div>
                        );
                    })}

                </div>
                :
                null
            }
        </div>        
    );
};





 