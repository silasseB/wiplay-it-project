
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

from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.template import loader
from allauth.account.models import  EmailConfirmationHMAC
from rest_auth.views import LoginView

from app_backend.mixins.views_mixins import RetrieveMixin, UpdateObjectMixin
from app_backend.views import BaseApiView
from .models import User
from .serializers import (  CustomRegisterSerializer,
                            CustomLoginSerializer,
                            EmailSerializer,
                            BaseUserSerializer,
                            UserSerializer,
                            UserProfileSerializer )
from app_backend.helpers import ( get_users_with_permissions,
	                              has_perm,
	                              get_objects_perms, 
	                              get_model_fields)



def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        """
        Send a django.core.mail.EmailMultiAlternatives to `to_email`.
        """
        subject = loader.render_to_string(subject_template_name, context)
        # Email subject *must not* contain newlines
        subject = ''.join(subject.splitlines())
        body = loader.render_to_string(email_template_name, context)

        email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
        if html_email_template_name is not None:
            html_email = loader.render_to_string(html_email_template_name, context)
            email_message.attach_alternative(html_email, 'text/html')

        email_message.send()




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
		print(confirmation)
		
		if confirmation:
			#Finally confirm the user 
			confirmation.confirm(self.request)

			user = confirmation.email_address.user
			user.is_confirmed = True 

			user.save()

			msg = """Your Account has been successfully confirmed."""
			return Response({'detail': _(msg)}, status=status.HTTP_200_OK)

		msg = """Could not confirm your account with this link"""
		return Response({'detail':msg}, status=status.HTTP_400_BAD_REQUEST )
			



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
				user.is_active = False
					
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




class UserView(BaseApiView):
	#queryset = User.objects.exclude(first_name="Anonymous")
	serializer_class = UserSerializer
	is_user = True
	permissions      = get_objects_perms('user_perms')
	fields_to_update = get_model_fields('user_model_fields') 

	def get_queryset(self):
		users = User.objects.exclude(
						first_name="Anonymous"
					).filter(
						is_confirmed=True
					).filter(
						is_superuser=False
					)

		return users


		

class RetrieveUserProfileView(UserView):
	serializer_class = UserProfileSerializer


		
class RetrieveUserFollowers(RetrieveMixin, UserView):
	 
	def get_queryset(self):
		user = get_object_or_404(User, pk=self.kwargs['pk'])
		followers_perms = self.get_obj_permissions('user_perms', 'followers_perms')
		return get_users_with_permissions(user, followers_perms)
		


		
class RetrieveUserFollowings(RetrieveMixin, UserView):
	
	def get_queryset(self):
		user = get_object_or_404(User, pk=self.kwargs['pk'])
		followings_perms = self.get_obj_permissions('user_perms', 'followings_perms')
		return get_users_with_permissions(user, followings_perms)
					
		
		
	
@api_view(['GET'])
def retrieve_current_user(request):
	#Determine the current user by their token, and return their data
	serializer = BaseUserSerializer(request.user)
	return Response(serializer.data)


		
class UpdateUserProfileView(UpdateObjectMixin, UserView):
	pass