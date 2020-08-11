

from django.urls import path


from app_backend.api_views.api_update_views import (UpdateQuestionView, 
                                                    UpdateAnswerView,
                                                    UpdateAnswerCommentView,
                                                    UpdateAnswerReplyView,
                                                    UpdatePostView,
                                                    UpdatePostCommentView,
                                                    UpdatePostReplyView)

app_name = 'update_apis'



urlpatterns = [
		
        path("api/question/<int:pk>/edit/", 
             UpdateQuestionView.as_view({'get':'retrieve','put':'put' })),

        path("api/answer/<int:pk>/edit/",
             UpdateAnswerView.as_view({'get':'retrieve','put':'put' })),

        path("api/answer/comment/<int:pk>/edit/",
             UpdateAnswerCommentView.as_view({'get':'retrieve','put':'put' })),

        path("api/answer/reply/<int:pk>/edit/", 
             UpdateAnswerReplyView.as_view({'get':'retrieve','put':'put' })),

        path("api/post/<int:pk>/edit/", 
            UpdatePostView.as_view({'get':'retrieve','put':'put' })),

        path("api/post/comment/<int:pk>/edit/",
            UpdatePostCommentView.as_view({'get':'retrieve','put':'put' })),
        
        path("api/post/reply/<int:pk>/edit/", 
            UpdatePostReplyView.as_view({'get':'retrieve','put':'put' })),
                        
       
        ]

