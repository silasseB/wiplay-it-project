
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.urls import path, include, register_converter, re_path
from rest_auth.views import PasswordResetConfirmView
from app_backend.api_views.api_auth_views import *
from allauth.account.views import confirm_email



#register_converter(converters.FourDigitYearConverter, 'yyyy')

app_name = 'user_app'

urlpatterns = [
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('rest-auth/registration/', CustomRegisterView.as_view()),
    path('rest-auth/login/', CustomLoginView.as_view()),
    url(r'^registration/account-confirm-email/(?P<key>[-:\w]+)/$', CustomVerifyEmailView.as_view(),
        name='account_confirm_email'),

    path('rest-auth/resend/account/confirm/email', SendEmailConfirimationView.as_view(),
       name='account_confirm_email'),


    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
         empty_view, name='reset'),

    
  
        
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
