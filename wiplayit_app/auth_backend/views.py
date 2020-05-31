
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.contrib.auth import (
    login as django_login,
    logout as django_logout
)
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_auth.social_serializers import TwitterLoginSerializer 
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter	
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter	

from rest_auth.registration.views import SocialLoginView, RegisterView

from allauth.account.utils import complete_signup,  send_email_confirmation
from allauth.account import app_settings as allauth_settings
from rest_auth.registration.serializers import (
										   VerifyEmailSerializer,
										   SocialLoginSerializer
										)
from django.contrib.auth.models import update_last_login
#from django.contrib.sites.shortcuts import get_current_site
#from django.core.mail import EmailMultiAlternatives
from django.template import loader
from allauth.account.models import  EmailConfirmationHMAC
from rest_auth.views import (LoginView,
							 PasswordResetView,
							 PasswordResetConfirmView)
from rest_framework_jwt.settings import api_settings
from rest_auth.app_settings import (TokenSerializer,
                                    JWTSerializer,
                                    create_token)
from rest_auth.utils import jwt_encode
from auth_backend.utils import (is_using_phone_number,
								is_using_email_address,
								_get_pin,
								send_pin,_verify_pin,
								get_intern_number_format)
from app_backend.mixins.views_mixins import RetrieveMixin, UpdateObjectMixin
from app_backend.views import BaseApiView
from .models import User, PhoneNumberSmsCode, PhoneNumber
from .serializers import (CustomRegisterSerializer,
                          CustomLoginSerializer,
                          CustomPasswordResetConfirmSerializer,
                          CustomPasswordResetSerializer,
                          SmsCodeSerializer,
                          EmailSerializer,
                          BaseUserSerializer,
                          UserSerializer,
                          UserProfileSerializer )
from app_backend.helpers import ( get_users_with_permissions,
	                              has_perm,
	                              get_objects_perms, 
	                              get_model_fields)



JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


class CustomRegisterView(RegisterView):
	queryset = User.objects.all()
	serializer_class       = CustomRegisterSerializer

	def get_response_data(self, user):

		if allauth_settings.EMAIL_VERIFICATION == \
								allauth_settings.EmailVerificationMethod.MANDATORY:
			return {"detail": _("Verification e-mail sent.")}

		if getattr(settings, 'REST_USE_JWT', False):
			response_data = jwt_response_payload_handler(self.token, user, self.request)
			return response_data

		else:
			return TokenSerializer(user.auth_token).data

	def create(self, request, *args, **kwargs):
		usarname = request.data.get('email', None)
		self.is_phone_number  = is_using_phone_number(usarname)
		self.is_email_address = is_using_email_address(usarname)
			
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = self.perform_create(serializer)
		user.set_password(request.data['password'])
		user.save()

		django_login(self.request, user, 
					backend='django.contrib.auth.backends.ModelBackend'
					)
				
		headers = self.get_success_headers(serializer.data)

		return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)

	def perform_create(self, serializer):
		user = serializer.save(self.request)
		
		if getattr(settings, 'REST_USE_JWT', False):
			self.token = jwt_encode(user)

		else:
			create_token(self.token_model, user, serializer)

		if self.is_phone_number:
			phone_number = user.email
			code = _get_pin()
			sms_body = 'Your Account confirmation code is {0}'.format(code)
			send_pin(phone_number, sms_body)

			phone_number_sms_codes = PhoneNumberSmsCode.objects.filter(user=user)
			for sms_code in phone_number_sms_codes:
				sms_code.verify_sms_code = code
				sms_code.save()

		else:
			complete_signup(self.request._request, user,
                        allauth_settings.EMAIL_VERIFICATION,
                       None)

		return user

	

		
		
class CustomLoginView(LoginView):
	serializer_class = CustomLoginSerializer

	def get_response(self):
		if getattr(settings, 'REST_USE_JWT', False):
			response_data = jwt_response_payload_handler(self.token, self.user, self.request)
			response = Response(response_data, status=status.HTTP_200_OK)

		else:
			serializer_class = self.get_response_serializer()
			serializer = serializer_class(instance=self.token,
                                          context={'request': self.request})
			response = Response(serializer.data, status=status.HTTP_200_OK)

		if getattr(settings, 'REST_USE_JWT', False):
			from rest_framework_jwt.settings import api_settings as jwt_settings

			if jwt_settings.JWT_AUTH_COOKIE:
				from datetime import datetime
				expiration = (datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA)
				response.set_cookie(jwt_settings.JWT_AUTH_COOKIE,
                                    self.token,
                                    expires=expiration,
                                    httponly=True)
		return response

	

class VerifyEmailView(APIView):
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
		
		if confirmation:
			#Finally confirm the user 
			confirmation.confirm(self.request)
			user = confirmation.email_address.user
			user.is_confirmed = True 
			user.save()

			payload = JWT_PAYLOAD_HANDLER(user)
			jwt_token = JWT_ENCODE_HANDLER(payload)
			update_last_login(None, user)

			msg   = """Your Account has been successfully confirmed."""
			
			response_data = jwt_response_payload_handler(jwt_token, user, request)
			return Response(response_data, status=status.HTTP_200_OK)

		msg = """Could not confirm your account with this link"""
		return Response({'detail':msg}, status=status.HTTP_400_BAD_REQUEST )

			
class VerifyPhoneNumberView(APIView):
	permission_classes = (AllowAny,)
	
	def get_object(self, request):
		sms_code = request.data.get('sms_code')
		phone_number_confirmation = PhoneNumberSmsCode.objects.get(verify_sms_code=sms_code)	
		return phone_number_confirmation

	def get_serializer(self, *args, **kwargs):
		return SmsCodeSerializer(*args, **kwargs)

	def post(self, request, *args, **kwargs):
		pin = request.data.get('sms_code')
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		
		confirmation       = self.get_object(request)
		if confirmation:
			user = confirmation.user
			user.is_confirmed = True
			user.save()
			confirmation.verify_sms_code = '' #Delete verified code
			confirmation.save()

			payload = JWT_PAYLOAD_HANDLER(user)
			jwt_token = JWT_ENCODE_HANDLER(payload)
			update_last_login(None, user)

			msg   = """Your Account has been successfully confirmed."""
			
			response_data = jwt_response_payload_handler(jwt_token, user, request)
			return Response(response_data, status=status.HTTP_200_OK)

		msg = """Could not confirm your account with this code"""
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
				return Response({'email': email, 'detail': msg},
					            status=status.HTTP_201_CREATED,)
				
			else:

				return Response(serializer.data)
					
	
class ComfirmSmsCodeView(APIView):
	permission_classes = (AllowAny,)

	def get_serializer(self, *args, **kwargs):
		return SmsCodeSerializer(*args, **kwargs)

	def post(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		sms_code = request.data.get('sms_code')
		msg   = """Code is valid."""
		response_data = {'detail': msg, 'sms_code':sms_code}
		return Response(response_data, status=status.HTTP_200_OK)


class CustomPasswordResetView(PasswordResetView):
    """
    Calls Django Auth PasswordResetForm save method.

    Accepts the following POST parameters: email
    Returns the success/fail message.
    """
    def post(self, request, *args, **kwargs):
        # Create a serializer with request.data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return the success message with OK HTTP status
        
        user_identify = request.data.get('email')
        if is_using_phone_number(user_identify):
        	phone_numbers = PhoneNumber.objects.filter(primary_number=user_identify)
        	if not phone_numbers:
        		phone_numbers = PhoneNumber.objects.filter(national_format=user_identify)

        	national_format = None
        	if phone_numbers:
        		for number in phone_numbers:
        			national_format = number.national_format
        			print(number, user_identify, national_format)

        	msg =  "Password reset code has been sent."

        	response_data = {
        		'phone_number':national_format,
        		'detail':msg
        		}
        	return Response(response_data, status=status.HTTP_200_OK)

        msg = _("Password reset e-mail has been sent.")
        response_data = {
        		'detail' : msg,
        		'email' : user_identify,
        		}
        return Response(response_data, status=status.HTTP_200_OK)



class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    """
    Password reset e-mail link is confirmed, therefore
    this resets the user's password.

    Accepts the following POST parameters: token, uid, sms_code,
        new_password1, new_password2
    Returns the success/fail message.
    """
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": _("Password has been reset with the new password.")}
        )

class FacebookLogin(SocialLoginView):
	adapter_class    = FacebookOAuth2Adapter
	serializer_class = SocialLoginSerializer


class TwitterLogin(SocialLoginView):
	serializer_class = TwitterLoginSerializer
	adapter_class = TwitterOAuthAdapter

class GoogleLogin(SocialLoginView):
	adapter_class = GoogleOAuth2Adapter
	serializer_class = SocialLoginSerializer



class UserView(BaseApiView):
	#queryset = User.objects.exclude(first_name="Anonymous")
	serializer_class = UserSerializer
	is_user          = True
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

	def get_queryset(self):
		return User.objects.exclude(first_name="Anonymous")


		
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


def jwt_response_payload_handler(token, user=None, request=None):
	
	serializer = BaseUserSerializer(user)
	return {
        'token': token,
        'user': serializer.data
    }
		
class UpdateUserProfileView(UpdateObjectMixin, UserView):
	pass


		
class UpdatePhoneNumberView(UpdateObjectMixin, UserView):
	pass
