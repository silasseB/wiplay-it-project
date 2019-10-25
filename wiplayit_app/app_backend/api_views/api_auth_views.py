
from django.utils.translation import ugettext_lazy as _

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_auth.social_serializers import TwitterLoginSerializer 
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter	
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter	

from rest_auth.registration.views import SocialLoginView

from allauth.account.utils import complete_signup,  send_email_confirmation
from allauth.account import app_settings as allauth_settings

from rest_auth.registration.views import RegisterView 
from rest_auth.registration.serializers import  VerifyEmailSerializer

from allauth.account.models import  EmailConfirmationHMAC
from rest_auth.views import LoginView
from rest_framework.decorators import api_view

from app_backend.models import User
from app_backend.auth_serializers import CustomRegisterSerializer, CustomLoginSerializer



class CustomRegisterView(RegisterView):
	queryset = User.objects.all()
	serializer_class       = CustomRegisterSerializer

	def create(self, request, *args, **kwargs):
		
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
				
		
		user = serializer.save(request)
		
		user.set_password(request.data['password'])

		user.save()

		complete_signup(self.request._request, user,
                        allauth_settings.EMAIL_VERIFICATION,
                        None)
		
		headers = self.get_success_headers(serializer.data)


		return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)



	

		
		
class CustomLoginView(LoginView):
	serializer_class = CustomLoginSerializer
	
	
	def post(self, request, *args, **kwargs):
		email = request.data.get("email")
		password = request.data.get("password")
		self.request = request

		self.serializer = self.get_serializer(data=self.request.data,
                                              context={'request': request})
		self.serializer.is_valid(raise_exception=True)

		self.login()
		return self.get_response()



class CustomVerifyEmailView(APIView):
	permission_classes = (AllowAny,)
	

	def get(self, *args, **kwargs):
		return self.post(*args, **kwargs)
		

	def get_serializer(self, *args, **kwargs):
		return VerifyEmailSerializer(*args, **kwargs)


	def get_object(self, queryset=None):
		key = self.kwargs['key']
		emailconfirmation = EmailConfirmationHMAC.from_key(key)	
		return emailconfirmation
        


	def post(self, request, *args, **kwargs):
		
		serializer = self.get_serializer(data=kwargs)

		serializer.is_valid(raise_exception=True)
		
		self.kwargs['key'] = serializer.validated_data['key']
		confirmation       = self.get_object()
		confirmation.confirm(self.request)

		if confirmation:
			#Finally confirm the user 
			user = confirmation.email_address.user
			user.is_confirmed = True 

			user.save()

			msg = """Your Account has been successfully confirmed."""
			return Response({'detail': _(msg)}, status=status.HTTP_200_OK)
			
		return Response({},status=status.HTTP_404_NOT_FOUND )
			



class SendEmailConfirimationView(APIView):
	permission_classes = (AllowAny,)

	def get_serializer(self, *args, **kwargs):
		return EmailSerializer(*args, **kwargs)

	def post(self, request, *args, **kwargs):
		
		serializer = self.get_serializer(data=request.data)	
		

		if serializer.is_valid(raise_exception=True):
			user = serializer.validated_data.get('user', False)
			email = serializer.validated_data['email']

			if user:
				
				send_email_confirmation(self.request, user)
				msg = _('Account confirmation e-mail has been resent')
				return Response({'email': email, 'detail': msg},status=status.HTTP_201_CREATED,)
				
			else:

				return Response(serializer.data)
					
	




class FacebookLogin(SocialLoginView):
	adapter_class    = FacebookOAuth2Adapter
	#serializer_class = CustomSocialLoginSerializer


	def post(self, request, *args, **kwargs):
		self.request = request
		print(request.data)

		self.serializer = self.get_serializer(data=self.request.data,
                                              context={'request': request})
		self.serializer.is_valid(raise_exception=True)

		self.login()
		return self.get_response()
	

class TwitterLogin(SocialLoginView):
	serializer_class = TwitterLoginSerializer
	adapter_class = TwitterOAuthAdapter




class GoogleLogin(SocialLoginView):
	adapter_class = GoogleOAuth2Adapter






