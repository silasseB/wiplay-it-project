
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri
from django.conf import settings



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
	'''
    
	def save_user(self, request, sociallogin, form=None):
		u = sociallogin.user
		u.set_unusable_password()
		print(u)

		sociallogin.save(request)

		return u

	'''	


    


