
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.utils import build_absolute_uri
from django.conf import settings
from django.template.loader import render_to_string

email_template_nam = """\
<html>
  <head></head>
    <body>

    </body>
</html>
"""


template_name = 'account/email/email_confirmation_message.html'
class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):

        host = settings.ALLOWED_HOSTS[0]
        http = "https://"

        if settings.DEBUG:
        	http = "http://"
        	host = host + ":8000"

        url = http + host + "/registration/account/confirm/" + emailconfirmation.key + "/"
        print(url)
        context = {'activate_url':url}

        #url = render_to_string(template_name, context)

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


    


