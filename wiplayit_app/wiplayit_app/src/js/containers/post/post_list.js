import React, { Component } from 'react';

import { PostComponent} from "../../components/post_components";
import  * as action  from '../../actions/actionCreators';
import {store} from "../../configs/store-config";
import withHigherOrderIndexBox from "../../containers/index/higher_order_index";

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";
import  AjaxLoader from "../../components/ajax-loader";
 








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
      
      var posts = this.props.entyties.posts;
      posts = posts.byId[postListById]
      

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
      var posts  = props.entyties.posts;
       console.log(posts)
      posts  = posts.byId[props.postListById];
      console.log(props, posts)
      return (
         <div style={{}}>
            <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} /> 
               {posts?
                  <div>
                     { posts.isLoading? 
                        <div  className="page-spin-loder-box">
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

}


export default withHigherOrderIndexBox(PostListPage);






const Posts = props => {

   var posts  = props.entyties.posts;
   posts  = posts.byId[props.postListById];

   return (
      <div>
         <div className="home-page-contents">

            { posts.postList.map(( post, index )  => {
               let postProps = {post:post} 
               Object.assign(postProps, props);
               
               return (
                  <div key={post.id} >
                    <PostComponent {...postProps}/>
                  </div>
                  )
               }
            )}

         </div>
      </div>        
   )
}





 