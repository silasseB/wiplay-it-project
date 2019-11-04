from django.conf.urls import url
from django.urls import path
from app_backend.api_views.api_auth_views import ( FacebookLogin, TwitterLogin, GoogleLogin,
                                                   CustomRegisterView, CustomLoginView, CustomVerifyEmailView,
                                                   SendEmailConfirimationView )


app_name = 'rest_auth_apis'

urlpatterns = [
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('rest-auth/registration/', CustomRegisterView.as_view()),
    path('rest-auth/login/', CustomLoginView.as_view()),
    url(r'^rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$', CustomVerifyEmailView.as_view(),
        name='account_confirm_email'),

    path('rest-auth/resend/account/confirm/email', SendEmailConfirimationView.as_view(),
       name='account_confirm_email'),
        
    ]

