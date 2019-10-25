
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.contrib.auth import views
from django.urls import path, include, register_converter, re_path


from app_backend.api_views.api_update_views import ( UpdateQuestionView, UpdateAnswerView, UpdateAnswerCommentView,
                                          UpdateAnswerReplyView, UpdatePostView,UpdatePostCommentView,
                                         UpdatePostReplyView, UpdateUserProfileView)

app_name = 'update_apis'



urlpatterns = [
		
        path("api/question/<int:pk>/edit/", UpdateQuestionView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/<int:pk>/edit/", UpdateAnswerView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/comment/<int:pk>/edit/", UpdateAnswerCommentView.as_view({'get':'retrieve','put':'put' })),
        path("api/answer/reply/<int:pk>/edit/", UpdateAnswerReplyView.as_view({'get':'retrieve','put':'put' })),

        path("api/post/<int:pk>/edit/", UpdatePostView.as_view({'get':'retrieve','put':'put' })),
        path("api/post/comment/<int:pk>/edit/", UpdatePostCommentView.as_view({'get':'retrieve','put':'put' })),
        path("api/post/reply/<int:pk>/edit/", UpdatePostReplyView.as_view({'get':'retrieve','put':'put' })),
                        
        path('api/profile/<int:pk>/edit/', UpdateUserProfileView.as_view({'get':'retrieve','put':'put' }), 
                                                                             name='update-user-profile'), 

        ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
