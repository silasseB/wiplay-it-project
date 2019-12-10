import React, { Component } from 'react';

import {PartalNavigationBar,NavigationBarBigScreen } from "../../components/navBar";

import  AjaxLoader from "../../components/ajax-loader";

import { PostComponent} from "../../components/post_components"

import withHigherOrderIndexBox from "../../containers/index/higher_order_index";
 
import  * as action  from '../../actions/actionCreators';
import { getPost } from '../../dispatch/index';
import {store} from "../../configs/store-config";






class  PostPage extends Component  {
   
    constructor(props) {
      super(props);

        this.state = {
            isPostBox   : true,
            pageName    : "Post", 
            postById    : ''
        };
    };

    onPostUpdate = () =>{

        const onStoreChange = () => {

            let storeUpdate   = store.getState();
            let {entyties }   = storeUpdate;
            let {postById}  =  this.state;
            let post      =  cacheEntities.post[postById];

            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };


    

    componentDidMount() {
        let { cacheEntities } = this.props;
        let { slug, id } = this.props.match.params;
        let  postById = `post${id}`;

        let { post, currentUser } = cachedEntyties;
        console.log(post)

        if(post && post.id == id){
                var now = new Date();
                let timeStamp = post.timeStamp;

                let msDiff   = now.getTime() - timeStamp
                let secDiff  = msDiff / 1000
                let menDiff  = secDiff / 60
                let hourDiff = menDiff/60
                let dayDiff  = hourDiff/24

                console.log(parseInt(menDiff)  + ' ' + 'Menutes ago')
                
               
            if (menDiff < 5) {
                this.setState({postById })
                console.log('Post found from cachedEntyties')
                store.dispatch(action.getPostPending(id));
                store.dispatch(action.getPostSuccess(post));
                return 
            }
        }
        
        this.setState({postById }) 
        store.dispatch(getPost(id));
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
        var post = props.cacheEntities.post;
        console.log(post, props)
        post = post[postById]
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
   var postState = props.cacheEntities.post[postById];
   let post      = postState.post;
   var postProps = Object.assign({post},props)
	return(
       <div className="post-page">  
        <PostComponent {...postProps }  />
      </div>
    )
}

