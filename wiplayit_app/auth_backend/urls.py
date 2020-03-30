from django.conf.urls import url
from django.urls import path
from .views import ( 
                   FacebookLogin, TwitterLogin, 
                   GoogleLogin ,  CustomRegisterView,
                   CustomLoginView, CustomVerifyEmailView, 
                   SendEmailConfirimationView )

from .views import ( UserView, RetrieveUserProfileView,
                     retrieve_current_user, RetrieveUserFollowers,
                     RetrieveUserFollowings, UpdateUserProfileView ) 

app_name = 'rest_auth_apis'

urlpatterns = [
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('rest-auth/registration/', CustomRegisterView.as_view()),
    path('rest-auth/login/', CustomLoginView.as_view()),
    url(r'^rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$', CustomVerifyEmailView.as_view(),
        name='account_confirm_email'),

    path('rest-auth/resend/account/confirm/email/', SendEmailConfirimationView.as_view(),
       name='account_confirm_email'),

    path("api/user/<int:pk>/followers/", RetrieveUserFollowers.as_view({'get': 'list'})),
    path("api/user/<int:pk>/followings/", RetrieveUserFollowings.as_view({'get': 'list'})),  

    path("api/current/user/", retrieve_current_user, name="api-current-user"),
    path('api/profile/<int:pk>/', RetrieveUserProfileView.as_view({'get':'retrieve'}), name='profile'),
    path('api/user/list/', UserView.as_view({'get': 'list'}), name="get-user-list"),   
    path('api/profile/<int:pk>/edit/', UpdateUserProfileView.as_view({'get':'retrieve','put':'put' }), 
                                                                             name='update-user-profile'), 

]
