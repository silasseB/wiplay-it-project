
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.contrib.auth import views
from django.urls import path, include, register_converter, re_path
#from rest_framework_jwt.views import obtain_jwt_token


from .api_views.api_create_views import *
from .api_views.api_detail_views import *
from .api_views.api_update_views import *

app_name = 'question_app'

urlpatterns = [
		path("", index, name='index'),
        path("api/question/<int:pk>/", QuestionDetailView.as_view({'get':'retrieve'})),
        path("api/post/<int:pk>/", PostRetrieveView.as_view({'get':'retrieve'})),
        path("api/question/<int:pk>/edit/", UpdateQuestionView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/<int:pk>/edit/", UpdateAnswerView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/comment/<int:pk>/edit/", UpdateAnswerCommentView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/reply/<int:pk>/edit/", UpdateAnswerReplyView.as_view({'get':'retrieve','put':'put' })),

        path("api/question/list/", QuestionListView.as_view({'get':'list'}), name="question_list"),
        path("api/answer/<int:pk>/comment/list/", GetAnswerCommentListView.as_view({'get':'list','post':'post' }), name="comment_list"),
        path("api/answer/comment/<int:pk>/reply/list/", GetAnswerReplyListView.as_view({'get':'list','post':'post' }), name="reply_list"),
        path("api/answer/reply/<int:pk>/children/list/", GetAnswerReplyChildrenListView.as_view({'get':'list'}), name="reply_list"),
 
        path("api/create/question/", CreateQuestion.as_view({'get':'get','post':'post' }), name="question_create"),
        path("api/create/post/",    CreatePost.as_view({'get':'get','post':'post' }), name="post_create"),
        
        path("api/create/question/<int:pk>/answer/", CreateAnswer.as_view({'get':'get','post':'post' })),
        path("api/create/answer/<int:pk>/comment/",  CreateAnswerCommentView.as_view({'get':'get','post':'post' })),

        path("api/create/answer/comment/<int:pk>/reply/", CreateAnswerReplyView.as_view({'get':'get','post':'post' })),
        path("api/create/answer/reply/<int:pk>/child/", CreateAnswerReplyChildView.as_view({'get':'get','post':'post' })),

         
        path("api/question/<int:pk>/followers/", GetQuestionFollowers.as_view({'get': 'list'})),
        path("api/answer/<int:pk>/upvoters/", GetAnswerUpVoters.as_view({'get': 'list'})),
        path("api/answer/comment/<int:pk>/upvoters/", GetAnswerCommentUpVoters.as_view({'get': 'list'})),
        path("api/answer/reply/<int:pk>/upvoters/", GetAnswerReplyUpVoters.as_view({'get': 'list'})),

        path("api/draft/editor/contents/", CreateDraftEditorContentsView.as_view({'get':'get','post':'post' })),


        path("api/post/list/", PostListView.as_view({'get':'list'}), name="post_list"),
        path("api/post/<int:pk>/comment/list/", GetPostCommentListView.as_view({'get':'list', }), name="{post_comment_list"),
        path("api/post/comment/<int:pk>/reply/list/", GetPostReplyListView.as_view({'get':'list' }), name="{post_reply_list"),
        path("api/post/reply/<int:pk>/children/list/", GetPostReplyChildrenListView.as_view({'get':'list' }), name="reply_list"),
        path("api/post/<int:pk>/upvoters/", GetPostUpVoters.as_view({'get': 'list'})),
        path("api/post/comment/<int:pk>/upvoters/", GetPostCommentUpVoters.as_view({'get': 'list'})),
        path("api/post/reply/<int:pk>/upvoters/", GetPostReplyUpVoters.as_view({'get': 'list'})),

        path("api/create/post/<int:pk>/comment/", CreatePostCommentView.as_view({'get':'get','post':'post' })),
        path("api/create/post/comment/<int:pk>/reply/", CreatePostReplyView.as_view({'get':'get','post':'post' })),
        path("api/create/post/reply/<int:pk>/child/", CreatePostReplyChildView.as_view({'get':'get','post':'post' })),

        path("api/post/<int:pk>/edit/", UpdatePostView.as_view({'get':'retrieve','put':'put' })),
        path("api/post/comment/<int:pk>/edit/", UpdatePostCommentView.as_view({'get':'retrieve','put':'put' })),
        path("api/post/reply/<int:pk>/edit/", UpdatePostReplyView.as_view({'get':'retrieve','put':'put' })),
        
        path("api/user/<int:pk>/followers/", GetUserFollowers.as_view({'get': 'list'})),
        path("api/user/<int:pk>/followings/", GetUserFollowings.as_view({'get': 'list'})),  
         
        path("api/current/user/", current_user, name="api-current-user"),
        path('api/profile/<int:pk>/', GetUserProfileView.as_view({'get':'retrieve'}), name='profile'),
        path('api/user/list/', UserView.as_view({'get': 'list'}), name="get-user-list"),
           
        path('api/profile/<int:pk>/edit/', UpdateUserProfileView.as_view({'get':'retrieve','put':'put' }), name='update-user-profile'), 


        ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
