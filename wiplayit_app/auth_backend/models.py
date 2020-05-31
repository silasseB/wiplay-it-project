from PIL import Image
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import PermissionsMixin
from guardian.mixins import GuardianUserMixin
from guardian.shortcuts import assign_perm
from django.contrib.auth.base_user import AbstractBaseUser
from .managers import UserManager
from django.db.models.signals import post_save
from app_backend.slug_generator import generate_unique_slug
from auth_backend.utils import (is_using_phone_number,
                                get_phone_number_region)

class User(AbstractBaseUser, PermissionsMixin, GuardianUserMixin):
    email         = models.CharField(
                        verbose_name='email or phone number', 
                        max_length=50, 
                        unique=True
                        )

    first_name      = models.CharField('first name', max_length=15,blank=True)
    last_name       = models.CharField('last name', max_length=15,blank=True)
    date_joined     = models.DateTimeField('date joined', auto_now_add=True)
    slug            = models.SlugField('slug', max_length=50, unique=True, blank=True) 
    is_active       = models.BooleanField('active',default=True)
    is_staff        = models.BooleanField('staff', default=False)
    is_confirmed    = models.BooleanField('Is confirmed', default=False)
    country         = models.CharField(max_length=50, null=True)
        
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    class Meta:
        db_table = "user" 
        permissions = (
                ("change_user_followers", "Can Profile Followers"),
                ("change_user_followings", "Can User Followings"),
            )

           
    def get_my_token(self):
        return Token.objects.get(user=self.user)
    my_token = property(get_my_token) 
        

    def get_full_name(self):
        full_name = '{0} {1}'.format(self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name
    

    def save(self, *args, **kwargs):
        slug_exist = self.__class__.objects.filter(slug=self.slug).exists()
        if not self.slug or not slug_exist:
            self.slug = generate_unique_slug(self.__class__, self.get_full_name())

        if not self.password:
            pass
            #self.set_password(self.password)    
               
        super().save()         


def get_anonymous_user_instance(CustomUser):
    user, _  = User.objects.get_or_create(first_name="Anonymous")
    return user

class Profile (models.Model):
    live            = models.CharField(max_length=100, blank=True)
    credential      = models.CharField(max_length=150, blank=True)
    favorite_quote  = models.TextField(max_length=200, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/%y/%m/%d/', blank=True)
    followers       = models.IntegerField(default=0)
    followings      = models.IntegerField(default=0)
    
    user            = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="profile"
                        ,verbose_name='list of users', blank=True)


    def __str__(self):
        return (self.user.email)


    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = "profile"
        
        


       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):

    first_name = instance.get_short_name()
    if created and not kwargs.get('raw', False):

        profile = Profile(user=instance)

        if first_name != settings.ANONYMOUS_USER_NAME:
            profile.save()
            
            assign_perm("change_user", instance,  instance)
            assign_perm("delete_user", instance,  instance)




class PhoneNumber (models.Model):
    primary_number  = models.CharField(max_length=50, null=True)
    national_format = models.CharField(max_length=50, null=True)
    inter_format    = models.CharField(max_length=50, null=True)
    verified        = models.BooleanField(default=False)
    primary         = models.BooleanField(default=False)
    user            = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="phone_number", blank=True)


    def __str__(self):
        return (self.user.email)
    
    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = 'user_phone_number'

    def get_national_format(self, phone_number):
        pass

    def get_inter_format(self, phone_number):
        pass

    def is_verified(self, phone_number):
        return  self.verified

    def is_primary(self, phone_number):
        pass
        

       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_phone_number(sender, instance, created, **kwargs):

    if created and not kwargs.get('raw', False):
        phone_number = PhoneNumber(user=instance)
        phone_number.save()



class Country (models.Model):
    long_name  = models.CharField(max_length=50, null=True)
    short_name = models.CharField(max_length=5, null=True) 
    user          = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="user_country", blank=True)

    def __str__(self):
        return (self.user.email)
    
    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = 'user_country'

            

       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_country(sender, instance, created, **kwargs):

    if created and not kwargs.get('raw', False):
        country = Country(user=instance)
        country.save()



class PhoneNumberSmsCode(models.Model):
    verify_sms_code   = models.CharField(max_length=5, null=True)
    password_sms_code = models.CharField(max_length=5, null=True)
    user              = models.OneToOneField(settings.AUTH_USER_MODEL,
                            on_delete= models.CASCADE, 
                            related_name="sms_code",
                            blank=True)

    def __str__(self):
        return (self.user.email)
    
    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = 'sms_code'

    def confirm_password_change(self, request):
        pass

    def confirm_verification_change(self, request):
        pass
        

       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_phone_number_sms__code(sender, instance, created, **kwargs):

    if created and not kwargs.get('raw', False):
        if is_using_phone_number(instance.email):
            print('Creating phone number sms code')
            phone_number_sms_code = PhoneNumberSmsCode(user=instance)
            phone_number_sms_code.save()



