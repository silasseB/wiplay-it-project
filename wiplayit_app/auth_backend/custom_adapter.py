
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri
from django.conf import settings
from allauth.account.adapter import get_adapter as get_account_adapter
import requests
import tempfile
from django.core.files.base import ContentFile
from django.core import files



template_name = 'account/email/email_confirmation_message.html'
class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):

        host = settings.ALLOWED_HOSTS[0]
        http = "https://"

        if settings.DEBUG:
        	http = "http://"
        	host = host + ":8000"

        url = http + host + "/registration/account/confirm/" + emailconfirmation.key + "/"
        
        ret = build_absolute_uri(
            request,
            url)
        return ret





class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    pass
    