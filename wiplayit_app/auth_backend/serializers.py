import random

import phonenumbers
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder

from django.contrib.sites.shortcuts import get_current_site
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, get_user_model
from django.core.validators import validate_email , RegexValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers, exceptions
from rest_framework.authtoken.models import Token
from django.contrib.sites.models import Site
try:
	from allauth.account.models import EmailAddress
	from allauth.account.utils import user_field
	from allauth.account import app_settings as allauth_settings
	from allauth.utils import (email_address_exists)
	from allauth.account.adapter import get_adapter
except ImportError:
	raise ImportError("allauth needs to be added to INSTALLED_APPS.")

from rest_auth.serializers import (LoginSerializer,
								    PasswordResetConfirmSerializer, 
								   PasswordResetSerializer)
from rest_auth.registration.serializers import RegisterSerializer, SocialLoginSerializer

from app_backend.models import Question, Post, Answer
from .models import  (
					User,
					Profile,
					Country,
					PhoneNumber,
					PhoneNumberSmsCode)
from app_backend.mixins.serializer_mixins import SerialiizerMixin
from app_backend import serializers  as app_serializers
from app_backend.helpers import  has_perm, get_users_with_permissions
from auth_backend.utils import (is_using_phone_number,
								is_using_email_address,
								get_phone_number_region,
								phone_number_exists,
								get_national_number_format,
								get_inter_number_format,
								get_verified_number,
								email_is_verified,
								_get_pin,
								send_pin,
								get_intern_number_format)


UserModel = get_user_model()




class CustomLoginSerializer(LoginSerializer):
	username = None
	email    = serializers.CharField(required=False, allow_blank=True)
	password = serializers.CharField(style={'input_type': 'password'})

	def get_phone_number(self, phone_number):
		if not phone_number_exists(phone_number):
			msg = _('Account with this phone number does not exists')
			raise serializers.ValidationError(msg)

		user = PhoneNumber.objects.filter()
		return user[0]

	def _validate_phone_number(self, phone_number, password):
		
		user = None
		verified_number =  get_verified_number(phone_number)
		email = verified_number.user.email
		
		user = authenticate(email=email, password=password)
		return user

	def _validate_email(self, email, password):
		user = None
		if not email_address_exists(email):
			msg = _('Account with this email address does not exists.')
			raise serializers.ValidationError(msg)

		user = authenticate(email=email, password=password)
		return user

	def validate(self, attrs):
		email    = attrs.get('email')
		password = attrs.get('password')
		self.is_phone_number  = is_using_phone_number(email)
		self.is_email_address = is_using_email_address(email)

		user     = None
		if self.is_email_address:
			user = self._validate_email(email, password)

		if self.is_phone_number:
			user = self._validate_phone_number(email, password)

		# Did we get back an user?
		self.can_authenticate(user)
		
		attrs['user'] = user
		return attrs

	def can_authenticate(self, user):
		if not user:
			msg = _('Unable to log in with provided credentials.')
			raise exceptions.ValidationError(msg)

		if  not user.is_active:
			msg = _('User account is disabled.')
			raise exceptions.ValidationError(msg)

		if not user.is_confirmed:
			msg = _('Your account is not confirmed.')
			raise exceptions.ValidationError(msg)


class CustomRegisterSerializer(RegisterSerializer):
	username   = None
	password1  = None
	password2  = None
	first_name = serializers.CharField(required=True)
	last_name  = serializers.CharField(required=True)
	email      = serializers.CharField(required=True)
	country    = serializers.CharField(required=False, allow_blank=True)
	password   = serializers.CharField(write_only=True)

	def _validate_email():
		pass

	def validate_phone_number(self, phone_number):
		if allauth_settings.UNIQUE_EMAIL:
			if phone_number and phone_number_exists(phone_number):
				print('phone exists')
				msg = _("A user is already registered with this phone number.")
				raise serializers.ValidationError(msg)
		return phone_number

	def validate_email(self, email):
		email = get_adapter().clean_email(email)
		self.is_phone_number  = is_using_phone_number(email)
		self.is_email_address = is_using_email_address(email)

		if self.is_phone_number:
			phone_number = email
			return self.validate_phone_number(phone_number)
		
		if allauth_settings.UNIQUE_EMAIL:
			if email and email_address_exists(email):
				msg = _("A user is already registered with this e-mail address.")
				raise serializers.ValidationError(msg)
				
		return email

	def validate(self, data):
		_data = {}
		usarname = data.get('email', None)
		self.is_phone_number  = is_using_phone_number(usarname)
		self.is_email_address = is_using_email_address(usarname)

		if self.is_phone_number:
			country = data.get('country')
			self.usarname   = get_intern_number_format(country, usarname)
			_data['email'] = self.usarname 
					
		data.update(_data)
		return data

	def user_exist(self, email):
		return User.objects.filter(email=email).exists()

	def custom_signup(self, request, user):
		country = request.data.get('country')
		phone_number = request.data.get('email')
		
		if self.is_phone_number:
			user_phone_numbers = PhoneNumber.objects.filter(user=user)
			for number in user_phone_numbers:
				number.primary_number  = phone_number
				number.national_format = get_national_number_format(country, phone_number)
				number.inter_format =  get_inter_number_format(country, phone_number)
				number.save()
			

		if country and self.is_phone_number:
			country_long_name = get_phone_number_region(country, phone_number) 
			
			user_countries = Country.objects.filter(user=user)
			for c in user_countries:
				c.short_name = country
				c.long_name  = country_long_name 
				c.save()
			
		return user

	def get_cleaned_data(self):
		super(CustomRegisterSerializer, self).get_cleaned_data()
				
		return {
            'first_name' : self.validated_data.get('first_name', ''),
            'last_name'  : self.validated_data.get('last_name', ''),
            'email'      : self.validated_data.get('email', ''),
            'password'   : self.validated_data.get('password', ''),
            'country'    : self.validated_data.get('country', '') 
        }




class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')


 
class SmsCodeSerializer(serializers.Serializer):
    sms_code = serializers.CharField()

    def get_sms_code(self, code):
    	sms_code = PhoneNumberSmsCode.objects.filter(verify_sms_code=code)
    	if not sms_code:
    		sms_code = PhoneNumberSmsCode.objects.filter(password_sms_code=code)
    		if not sms_code:
    			msg = "Code is invalid"
    			raise serializers.ValidationError(msg)
    	return sms_code[0] or None


    def validate(self, attrs):
    	sms_code = attrs.get('sms_code')
    	self.get_sms_code(sms_code)
    	return attrs


class EmailSerializer(serializers.Serializer):
	email    = serializers.EmailField(required=False, allow_blank=True)

	def validate(self, attrs):
		email = attrs.get('email')
		users = User.objects.filter(email=email)
		
		if not users:
			msg = _('Account with this email address does not exists')
			raise serializers.ValidationError(msg)

		return attrs


class CustomPasswordResetForm(PasswordResetForm):

	def get_users(self, email):
		email_field_name = UserModel.get_email_field_name()

		return UserModel._default_manager.filter(**{
            '%s__iexact' % email_field_name: email,
            'is_active': True,
            'is_confirmed':True,
        })
        
	

class CustomPasswordResetSerializer(PasswordResetSerializer):
	email = serializers.CharField()
	

	def validate_phone_number(self, value):
		phone_number = value

		if not phone_number_exists(phone_number):
			msg = _('Account with this phone number does not exists.')
			raise serializers.ValidationError(msg)

		phone_number = get_verified_number(phone_number)	
		if not phone_number:
			msg = _('You must confirm your account before you can change a password.')
			raise serializers.ValidationError(msg)	

		self.send_sms_code(phone_number)
		return value

	def send_sms_code(self, phone_number):
		to_number = phone_number.user.email
		code = _get_pin()
		sms_body = 'Your Account password change code is {0}'.format(code)
		send_pin(to_number, sms_body)
		
		phone_number_sms_codes = PhoneNumberSmsCode.objects.filter(user=phone_number.user)
		
		for sms_code in phone_number_sms_codes:
			sms_code.password_sms_code = code
			sms_code.save()


	def validate_email(self, value):
		# Create PasswordResetForm with the serializer
		email = value
		self.is_phone_number = is_using_phone_number(value)
		if self.is_phone_number:
			return self.validate_phone_number(value)
			
		if not email_address_exists(email):
			msg = _('Account with this email address does not exists.')
			raise serializers.ValidationError(msg)

		if  not email_is_verified(email):
			msg = _('You must confirm your account before you can change a password.')
			raise serializers.ValidationError(msg)

		self.reset_form = CustomPasswordResetForm(data=self.initial_data)
		if not self.reset_form.is_valid():
			raise serializers.ValidationError(self.reset_form.errors)

		return value

	def save(self):
		if self.is_phone_number:
			return

		request = self.context.get('request')
		# Set some values to trigger the send_email method.
		opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
            'email_template_name' : 'password_reset_email.html',
        }
		opts.update(self.get_email_options())
		self.reset_form.save(**opts)  



class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
	uid = serializers.CharField(required=False, allow_blank=True)
	token = serializers.CharField(required=False, allow_blank=True)
	sms_code = serializers.CharField(required=False, allow_blank=True)
	

	def _validate_uid(uid):
		pass

	def validate_token_based(self, attrs):
		self._errors = {}
		# Decode the uidb64 to uid to get User object

		try:
			uid = force_text(uid_decoder(attrs['uid']))
			self.user = UserModel._default_manager.get(pk=uid)
		except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
			raise ValidationError({'uid': ['Invalid value']})

		self.custom_validation(attrs)
		# Construct SetPasswordForm instance
		self.set_password_form = self.set_password_form_class(user=self.user, data=attrs)

		if not self.set_password_form.is_valid():
			raise serializers.ValidationError(self.set_password_form.errors)
		if not default_token_generator.check_token(self.user, attrs['token']):
			raise ValidationError({'token': ['Invalid value']})
		return attrs

	def validate_sms_code_based(self, attrs):
		sms_code = attrs.get('sms_code')
		sms_code = PhoneNumberSmsCode.objects.filter(password_sms_code=sms_code)

		if sms_code:
			sms_code = sms_code[0]

			self.user = sms_code.user
		else:
			raise ValidationError({'sms_code': ['Invalid code']})

		self.custom_validation(attrs)
		# Construct SetPasswordForm instance
		self.set_password_form = self.set_password_form_class(user=self.user, data=attrs)
		if not self.set_password_form.is_valid():
			raise serializers.ValidationError(self.set_password_form.errors)

		sms_code.password_sms_code = ''
		sms_code.save()
		return attrs

	def custom_validation(self, attrs):
		pass

	def validate(self, attrs):
		print(attrs)
		if attrs.get('uid') and attrs.get('token'):
			self.validate_token_based(attrs)
		else:
			self.validate_sms_code_based(attrs)

		return attrs
		

        


class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile 
		fields = '__all__'

			    
class BaseUserSerializer(SerialiizerMixin, serializers.ModelSerializer):
	profile    = ProfileSerializer(read_only=False)
	
	class Meta():
		model  = User
		fields = '__all__'
		extra_kwargs = {'password' : {'write_only': True}, }

	
	def validate(self, data):
		print('validated' ,data)
		return data
	
		                
	def update(self, instance, validated_data):
		profile_data = validated_data.pop('profile')
		# Unless the application properly enforces that this field is
		# always set, the follow could raise a `DoesNotExist`, which
		# would need to be handled.
		country = profile_data.get('country ')
		phone_number = profile_data.get('phone_number')

		print(phone_number,country)
		
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


class UserSerializer(BaseUserSerializer):
	user_is_following = serializers.SerializerMethodField()
	user_can_edit     = serializers.SerializerMethodField()
				                
	def get_user_is_following(self, obj):
		perms = self.get_obj_permissions('followers_perms')
		return has_perm(self.current_user() ,perms, obj)	  
	
	
	
	

class UserProfileSerializer(UserSerializer):
	questions    = serializers.SerializerMethodField()
	posts        = serializers.SerializerMethodField()
	answers      = serializers.SerializerMethodField()
	followers    = serializers.SerializerMethodField()
	followings   = serializers.SerializerMethodField()
	
		
			                
	def get_questions(self, obj):
		questions  =  Question.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('question_perms')
		return app_serializers.QuestionSerializer(questions, context=self.context, many=True).data
	  
	def get_posts(self, obj):
		posts  =  Post.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('post_perms')
		return app_serializers.PostSerializer(posts, context=self.context ,many=True).data
		
		  
	def get_answers(self, obj):
		answers  =  Answer.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('answer_perms')
		return app_serializers.AnswerReadSerializer(answers, context=self.context ,many=True).data
		
	  
	def get_followers(self, obj):
		users  = get_users_with_permissions(obj,  "change_user_followers")
		self.update_serializer_obj_perms('user_perms')
		return UserSerializer(users, context=self.context ,many=True).data
	  
	def get_followings(self, obj):
		users  = get_users_with_permissions(obj, "change_user_followings")
		self.update_serializer_obj_perms('user_perms')
		return  UserSerializer(users,context=self.context , many=True).data 

