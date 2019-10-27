
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri


class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):
        url = "https://valoi.pythonanywhere.com/#/registration/account/confirm/" + emailconfirmation.key + "/"
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


    


