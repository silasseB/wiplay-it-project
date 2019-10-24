import json
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate

from allauth.account import app_settings as allauth_settings

from rest_framework import serializers, exceptions

from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.core.serializers.json import Serializer, DjangoJSONEncoder
from rest_auth.serializers import UserDetailsSerializer,LoginSerializer,  PasswordResetSerializer
from rest_auth.registration.serializers import RegisterSerializer, VerifyEmailSerializer,SocialLoginSerializer
from rest_framework.authtoken.models import Token
from allauth.account.utils import complete_signup,  send_email_confirmation
from allauth.account.forms import ResetPasswordForm
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

from .models import  User, Profile


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')



class CustomSocialLoginSerializer(SocialLoginSerializer):
    access_token = serializers.CharField(required=False, allow_blank=True)
    code = None 

    
    def get_social_login(self, adapter, app, token, response):
        """
        :param adapter: allauth.socialaccount Adapter subclass.
            Usually OAuthAdapter or Auth2Adapter
        :param app: `allauth.socialaccount.SocialApp` instance
        :param token: `allauth.socialaccount.SocialToken` instance
        :param response: Provider's response for OAuth1. Not used in the
        :returns: A populated instance of the
            `allauth.socialaccount.SocialLoginView` instance
        """
        request = self._get_request()
        social_login = adapter.complete_login(request, app, token, response=response)
        social_login.token = token
        email = social_login.user.email

        users = User.objects.filter(email__iexact=email)

        if users:
        	for user in users:
        		#Is the user account confirmed?
        		if not user.is_confirmed:
        			msg = _('Your account has not been confirmed.')
        			raise exceptions.ValidationError(msg)

        
        user = User(
			first_name = social_login.user.first_name,
		    last_name  = social_login.user.last_name, 
            email      = social_login.user.email,
            password   = social_login.user.password,
            is_confirmed = True
            )


        user.save()

        u = social_login.user
        u.set_unusable_password()
        print(u.password)
        #profile = {
         #       "profile_picture": social_login.user.picture
          #    }

        Profile.objects.get_or_create(user=user,) 

        return social_login

    

class EmailSerializer(serializers.Serializer):
	email    = serializers.EmailField(required=False, allow_blank=True)
	

	def validate(self, attrs):
		email = attrs.get('email')
		
		users = User.objects.filter(email=email)
		
		if users:
			for user in users:
				attrs['user'] = user
		else:
			msg = _('Account with this email address does not exists')
			raise serializers.ValidationError(msg)

		return attrs


class CustomPasswordResetSerializer (PasswordResetSerializer):
    
    def get_email_options(self):
        """Override this method to change default e-mail options"""
        return {"domain_override": "valoi.pythonanywhere.com/#/"}


    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        
        email = value
        

        if not User.objects.filter(email=email).exists():
        	msg = _('Account with this email address does not exists.')
        	raise serializers.ValidationError(msg)

        else:
        	self.reset_form = self.password_reset_form_class(data=self.initial_data)

        	if not self.reset_form.is_valid():
        		raise serializers.ValidationError(self.reset_form.errors)

        return value    


    
    


class CustomLoginSerializer(LoginSerializer):
	username = None
	email    = serializers.EmailField(required=False, allow_blank=True)
	password = serializers.CharField(style={'input_type': 'password'})


	def _validate_email(self, email, password):
		user = None

		if not User.objects.filter(email=email).exists():
			msg = _('Account with this email address does not exists')
			raise serializers.ValidationError(msg)

		else:
			user = authenticate(email=email, password=password)


		return user


	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')
		user = None

		print(attrs)
		

		user = self._validate_email(email, password)


		# Did we get back an confirmed user?
		if user:
			print(user)
			if not user.is_confirmed:
				msg = _('Your account has not been confirmed.')
				raise exceptions.ValidationError(msg)

		else:
			msg = _('Unable to log in with provided credentials.')
			raise exceptions.ValidationError(msg)


		attrs['user'] = user

		return attrs


		



class CustomRegisterSerializer(RegisterSerializer):
	#A sub class of rest auth Register Serializer. it
	#ovarrides default fields and define custom ones for authentication    
	username   = None
	password1  = None
	password2  = None
	first_name = serializers.CharField(required=True)
	last_name  = serializers.CharField(required=True)
	email      = serializers.EmailField(required=True)
	password   = serializers.CharField(write_only=True)


	def validate(self, data):
		email = data['email']
		if self.user_exist(email):
			print('errors')
			raise serializers.ValidationError(
            	          _("A user is already registered with this e-mail address.")
            	        )
		
		return data

		

	def user_exist(self, email):

		return User.objects.filter(email=email).exists()	


	def get_cleaned_data(self):
		super(CustomRegisterSerializer, self).get_cleaned_data()


		return {

            'first_name' : self.validated_data.get('first_name', ''),
            'last_name'  : self.validated_data.get('last_name', ''),
            'email'      : self.validated_data.get('email', ''),
            'password'   : self.validated_data.get('password', ''),
            
        }



class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile 
		fields = '__all__'


			    
class BaseUserSerializer(serializers.ModelSerializer):
	profile    = ProfileSerializer(read_only=False)
	
	class Meta():
		model  = User
		fields = '__all__'
		extra_kwargs = {'password' : {'write_only': True}, }
		                
	def update(self, instance, validated_data):
		profile_data = validated_data.pop('profile')
		# Unless the application properly enforces that this field is
		# always set, the follow could raise a `DoesNotExist`, which
		# would need to be handled.

		profile = instance.profile
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name  = validated_data.get('last_name', instance.last_name)  
		instance.save()
		
		profile.followers = profile_data.get(
			    'followers',	profile.followers
			)

		
		profile.live = profile_data.get(
			    'live',	profile.live
			)


		profile.favorite_quote = profile_data.get(
			    'favorite_quote',	profile.favorite_quote
			)

		profile.credential = profile_data.get(
     		'credential',  profile.credential

			)

		profile.profile_picture = profile_data.get(
     		'profile_picture',  profile.profile_picture

			)

		profile.phone_number = profile_data.get(
     		'phone_number',  profile.phone_number

			)

		profile.country  = profile_data.get(
     		'country ',  profile.country 

			)


		profile.save()

		
		return instance	

	

	  
	
	
	
	
	
	
	
		
