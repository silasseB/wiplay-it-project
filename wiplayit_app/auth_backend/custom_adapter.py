
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri
from django.conf import settings
from allauth.account.adapter import get_adapter as get_account_adapter
import requests
import tempfile
import hashlib
from django.core import files



class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):
        
        path = "/registration/account/confirm/" + emailconfirmation.key + "/"
        if settings.DEBUG:
            uri = request.build_absolute_uri(path)
        else:
            uri = request.build_absolute_uri(request, path) 
        
        return uri





class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed up social login. In case of auto-signup,
        the signup form is not available.
        """
        print(sociallogin.account.get_avatar_url())
        user = sociallogin.user
        user.is_confirmed = True
        user.save()

        self.save_profile_picture(user, sociallogin)

        user.set_unusable_password()
        if form:
            get_account_adapter().save_user(request, user, form)
        else:
            get_account_adapter().populate_username(request, user)
        sociallogin.save(request)
        return user
    
    def save_profile_picture(self, user, sociallogin):
        if sociallogin == None:
            return

        preferred_avatar_size_pixels=256

        picture_url = "http://www.gravatar.com/avatar/{0}?s={1}".format(
            hashlib.md5(user.email.encode('UTF-8')).hexdigest(),
            preferred_avatar_size_pixels
        )



        print(picture_url)
        avatar_url = sociallogin.account.get_avatar_url()
        avatar = download_file_from_url(avatar_url)
        print(avatar)
        profile = user.profile 
        profile.profile_picture = avatar
        profile.save()        




def download_file_from_url(url):
    # Stream the image from the url
    try:
        request = requests.get(url, stream=True)
    except requests.exceptions.RequestException as e:
        # TODO: log error here
        return None

   
    if request.status_code != requests.codes.ok:
        return None

    img_temp = tempfile.NamedTemporaryFile(delete=True)
    img_temp.write(request.content)
    img_temp.flush()

    file_name = 'social-login-picture.png'
    return files.File(img_temp, name=file_name)

