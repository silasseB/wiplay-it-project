
from django.urls import path, re_path
from app_backend.api_views.api_detail_views import ( RetrieveQuestionView, RetrieveQuestionListView,
                                                    RetrieveAnswerCommentListView, RetrieveAnswerReplyListView,
                                                    RetrieveAnswerReplyChildrenListView,RetrieveQuestionFollowers,
                                                    RetrieveAnswerUpVoters, RetrieveAnswerCommentUpVoters,
                                                    RetrieveAnswerReplyUpVoters )

from app_backend.api_views.api_detail_views import ( RetrievePostView, RetrievePostListView,
                                                     RetrievePostCommentListView, RetrievePostReplyListView,
                                                     RetrievePostReplyChildrenListView, RetrievePostUpVoters,
                                                     RetrievePostCommentUpVoters, RetrievePostReplyUpVoters
                                                    )
from app_backend.api_views.api_detail_views import ( index, IndexView )
from app_backend.api_views.api_detail_views import ( UserView, RetrieveUserFollowers, RetrieveUserFollowings,
                                                     RetrieveUserProfileView, retrieve_current_user ) 



app_name = 'retrive_apis'



urlpatterns = [
		path("", index, name='index'),
        path("api/main/", IndexView.as_view(), name='main'),


        path("api/question/<int:pk>/", RetrieveQuestionView.as_view({'get':'retrieve'}), name="question"),
        path("api/question/list/", RetrieveQuestionListView.as_view({'get':'list'}), name="question_list"),
        path("api/answer/<int:pk>/comment/list/", RetrieveAnswerCommentListView.as_view({'get':'list','post':'post' }), 
                                                                                               name="comment_list"),
        path("api/answer/comment/<int:pk>/reply/list/", RetrieveAnswerReplyListView.as_view({'get':'list','post':'post' }),
                                                                                                 name="reply_list"),
        path("api/answer/reply/<int:pk>/children/list/", RetrieveAnswerReplyChildrenListView.as_view({'get':'list'}),
                                                                                                 name="reply_list"),
        path("api/question/<int:pk>/followers/", RetrieveQuestionFollowers.as_view({'get': 'list'})),
        path("api/answer/<int:pk>/upvoters/", RetrieveAnswerUpVoters.as_view({'get': 'list'})),
        path("api/answer/comment/<int:pk>/upvoters/", RetrieveAnswerCommentUpVoters.as_view({'get': 'list'})),
        path("api/answer/reply/<int:pk>/upvoters/", RetrieveAnswerReplyUpVoters.as_view({'get': 'list'})),


        path("api/post/<int:pk>/", RetrievePostView.as_view({'get':'retrieve'})),
        path("api/post/list/", RetrievePostListView.as_view({'get':'list'}), name="post_list"),
        path("api/post/<int:pk>/comment/list/", RetrievePostCommentListView.as_view({'get':'list', }), 
                                                                             name="{post_comment_list"),
        path("api/post/comment/<int:pk>/reply/list/", RetrievePostReplyListView.as_view({'get':'list' }), 
                                                                                name="{post_reply_list"),
        path("api/post/reply/<int:pk>/children/list/", RetrievePostReplyChildrenListView.as_view({'get':'list' }), 
                                                                                      name="reply_list"),
        path("api/post/<int:pk>/upvoters/", RetrievePostUpVoters.as_view({'get': 'list'})),
        path("api/post/comment/<int:pk>/upvoters/", RetrievePostCommentUpVoters.as_view({'get': 'list'})),
        path("api/post/reply/<int:pk>/upvoters/", RetrievePostReplyUpVoters.as_view({'get': 'list'})),

        
        
        path("api/user/<int:pk>/followers/", RetrieveUserFollowers.as_view({'get': 'list'})),
        path("api/user/<int:pk>/followings/", RetrieveUserFollowings.as_view({'get': 'list'})),  
        path("api/current/user/", retrieve_current_user, name="api-current-user"),
        path('api/profile/<int:pk>/', RetrieveUserProfileView.as_view({'get':'retrieve'}), name='profile'),
        path('api/user/list/', UserView.as_view({'get': 'list'}), name="get-user-list"),
           
         

        ]


