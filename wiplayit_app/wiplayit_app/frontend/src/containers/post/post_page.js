import React, { Component } from 'react';

import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";

import  AjaxLoader from "components/ajax-loader";

import { PostComponent} from "components/post_components"

import withHigherOrderIndexBox from "containers/index/higher_order_index";
 
import  * as action  from 'actions/actionCreators';
import { getPost } from 'dispatch/index';
import {store} from "index";





class  PostPage extends Component  {
   
    constructor(props) {
      super(props);

        this.state = {
            isPostBox   : true,
            pageName    : "Post", 
            postById    : ''
        };
    };
  
    componentWillMount() {

    }

    componentDidUpdate(nextProps,prevProps) {
      

      if (nextProps !== this.props ) {
        console.log('Component updated');
      } 
        
    };   

    componentDidMount() {
        let {state} = this.props.location;

        if (state) {
            let { isNewPost, post } = state;
           this.setState({postById:`post${post.id}`});

        if (isNewPost) {
            store.dispatch(action.getQuestionSuccess(post))
            store.dispatch(action.Redirected());
        }else {
            store.dispatch(getPost(post.id));
        } 
      }
    };


   
    getProps(){

        //Collect all state data and props.
        let props = {
        	isPostBox      : this.state.isPostBox,
            pageName       : this.state.pageName,
            postById       : this.state.postById
        };

        return Object.assign(props, this.props);
    };

    render() {
        let props = this.getProps();
        var postById = props.postById;
        var post = props.entyties.post;
        console.log(post, props)
        post = post.byId[postById]
        console.log(post)                 
        return (
            <div>
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />
               { post?
                    <div>
                    { post.isLoading?
                        <div className="page-spin-loder-box">
                           <AjaxLoader/>
                        </div>
                        :
                        <div style={{paddingTop:'70px'}}>
                           { post.post?
                               <Post {...props}/>
                               :
                               ""
                            }
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


export default withHigherOrderIndexBox(PostPage);


export const Post = props => {
	var postById = props.postById;
   var postState = props.entyties.post.byId[postById];
   let post      = postState.post;
   var postProps = Object.assign({post},props)
	return(
       <div className="post-page">  
        <PostComponent {...postProps }  />
      </div>
    )
}

