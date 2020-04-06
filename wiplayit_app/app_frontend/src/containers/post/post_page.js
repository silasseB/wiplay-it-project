import React, { Component } from 'react';

import {PartalNavigationBar,NavigationBarBigScreen } from "components/navBar";

import  AjaxLoader from "components/ajax-loader";

import { PostComponent} from "components/post_components"

import withHigherOrderIndexBox from "containers/index/higher_order_index";
import { UnconfirmedUserWarning } from "components/partial_components";

import  * as action  from 'actions/actionCreators';
import { getPost } from 'dispatch/index';
import {store} from "store/index";
import GetTimeStamp from 'utils/timeStamp';






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
            let {entities }   = storeUpdate;
            let {postById}  =  this.state;
            let post      =  entities.post[postById];

            
        };

        this.unsubscribe = store.subscribe(onStoreChange);
    };


    

    componentDidMount() {
        let { cacheEntities } = this.props;
        let { slug, id } = this.props.match.params;
        let  postById = `post${id}`;

        let { post, currentUser } = cacheEntities;
        post = post && post[postById];
        console.log(post)

        if(post){
            let timeStamp = post.timeStamp;

            const getTimeState = new GetTimeStamp({timeStamp});
            let menDiff        = parseInt(getTimeState.menutes());
            console.log(parseInt(menDiff)  + ' ' + 'Menutes ago')
                
               
            if (menDiff <= 5 && post.post) {
                this.setState({postById })
                console.log('Post found from cachedEntyties')
                store.dispatch(action.getPostPending(postById));
                store.dispatch(action.getPostSuccess(postById, post.post));
                return 
            }
        }
        console.log('Fetching post from the server' )      
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
        var post = props.entities.post;
        post = post && post[postById]
        console.log(post, props)       
                  
        return (
            <div>
               <PartalNavigationBar {...props}/>
               <NavigationBarBigScreen {...props} />
                { post?
                    <div  className="app-box-container">
                        <UnconfirmedUserWarning {...props}/>
                    { post.isLoading?
                        <div className="page-spin-loder-box">
                           <AjaxLoader/>
                        </div>
                        :
                        <Post {...props}/>
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
    var postState = props.entities.post[postById];
    let post      = postState.post;
    var postProps = {...props, post}

	return(
        <div className="post-page"> 
            <div className="post-container"> 
                <PostComponent {...postProps }  />
            </div>
        </div>
    );
};


