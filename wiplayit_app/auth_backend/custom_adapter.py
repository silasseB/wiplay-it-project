
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri
from django.conf import settings
from django.contrib.sites.models import Site
from django.contrib.sites.shortcuts import get_current_site
from allauth.account.adapter import get_adapter as get_account_adapter

import requests
import tempfile
from django.core.files.base import ContentFile
from django.core import files
from django.urls import reverse
from django.http.request import HttpRequest



template_name = 'account/email/email_confirmation_message.html'
class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):
        uri = request.build_absolute_uri( 
                    "/registration/account/confirm/" + emailconfirmation.key + "/")
        
        return uri





class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed up social login. In case of auto-signup,
        the signup form is not available.
        """
        user = sociallogin.user
        user.is_confirmed = True
        user.save()

        user.set_unusable_password()
        if form:
            get_account_adapter().save_user(request, user, form)
        else:
            get_account_adapter().populate_username(request, user)
        sociallogin.save(request)
        return user
    
    