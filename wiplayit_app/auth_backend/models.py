import requests
import tempfile
import hashlib
import urllib
from django.core.files.base import ContentFile

from django.core import files
from django.db import models
from django.conf import settings
from django.contrib.auth.models import PermissionsMixin
from guardian.mixins import GuardianUserMixin
from guardian.shortcuts import assign_perm
from django.contrib.auth.base_user import AbstractBaseUser
from .managers import UserManager
from rest_framework.authtoken.models import Token
from allauth.account.signals import user_signed_up
from allauth.socialaccount.models import SocialAccount


from django.db.models.signals import post_save
from django.dispatch import receiver
from PIL import Image

from app_backend.slug_generator import generate_unique_slug



class User(AbstractBaseUser, PermissionsMixin, GuardianUserMixin):
    email           = models.CharField(verbose_name='email address', max_length=50, unique=True )
    first_name      = models.CharField('first name', max_length=15,blank=True)
    last_name       = models.CharField('last name', max_length=15,blank=True)
    date_joined     = models.DateTimeField('date joined', auto_now_add=True)
    slug            = models.SlugField('slug', max_length=50, unique=True, blank=True) 
    is_active       = models.BooleanField('active',default=True)
    is_staff        = models.BooleanField('staff', default=False)
    is_confirmed    = models.BooleanField('confirmed', default=False)
    

    
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
    user, _  = CustomUser.objects.get_or_create(first_name="Anonymous")
    return user

class Profile (models.Model):
    live            = models.CharField(max_length=100, blank=True)
    credential      = models.CharField(max_length=150, blank=True)
    phone_number    = models.CharField(max_length=100, null=True)
    country         = models.CharField(max_length=100, blank=True)
    favorite_quote  = models.TextField(max_length=200, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/%y/%m/%d/', blank=True)
    followers       = models.IntegerField(default=0)
    followings      = models.IntegerField(default=0)
    
    user            = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="profile"
                        ,verbose_name='list of users', blank=True)


    def __str__(self):
        return (self.user.email)

    class Meta:
        db_table = "profile"
        
        


       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):
    #print(instance)

    first_name = instance.get_short_name()
    if created and not kwargs.get('raw', False):

        profile = Profile(user=instance)

        if first_name != settings.ANONYMOUS_USER_NAME:
            profile.save()
            
            assign_perm("change_user", instance,  instance)
            assign_perm("delete_user", instance,  instance)


@receiver(user_signed_up)
def confirm_social_login(request, user,  sociallogin=None, **kwargs):
    pass


@receiver(user_signed_up)
def retrieve_social_data(request, user,  sociallogin=None, **kwargs):
    if not sociallogin:
        return
    """Signal, that gets extra data from sociallogin and put it to profile."""
    # get the profile where i want to store the extra_data
    profile = Profile.objects.filter(user=user)
    print(profile)
    # in this signal I can retrieve the obj from SocialAccount
    data = SocialAccount.objects.filter(user=user, provider='facebook')
    data_google = SocialAccount.objects.filter(user=user, provider='google')
    #print(data_google)
    # check if the user has signed up via social media

    if data_google:
        picture = data_google[0].get_avatar_url()
        print(picture)

        url = download_file_from_url(picture)
        print(url)

        try:
            image = requests.get(picture, stream=True)
        except requests.exceptions.RequestException as e:
            return None

        print(image)

        
        if image:
            content_file = ContentFile(image)
            print(content_file)

            profile = profile[0]
            profile.profile_picture = content_file
            print(profile.profile_picture) 
            profile.save()



def download_file_from_url(url):
    # Stream the image from the url
    try:
        request = requests.get(url, stream=True)
    except requests.exceptions.RequestException as e:
        # TODO: log error here
        return None

    print(request)

    if request.status_code != requests.codes.ok:
        
        return None

    # Create a temporary file
    lf = tempfile.NamedTemporaryFile()

    # Read the streamed image in sections
    for block in request.iter_content(1024 * 8):

        # If no more file then stop
        if not block:
            break

        # Write image block to temporary file
        lf.write(block)

    return files.File(lf)




@receiver(user_signed_up)
def social_login_fname_lname_profilepic(request, user,  sociallogin=None, **kwargs):
    if sociallogin == None:
        return

    preferred_avatar_size_pixels=256

    picture_url = "http://www.gravatar.com/avatar/{0}?s={1}".format(
        hashlib.md5(user.email.encode('UTF-8')).hexdigest(),
        preferred_avatar_size_pixels
    )

    if sociallogin:
        # Extract first / last names from social nets and store on User record
        if sociallogin.account.provider == 'twitter':
            name = sociallogin.account.extra_data['name']
            user.first_name = name.split()[0]
            user.last_name = name.split()[1]

        if sociallogin.account.provider == 'facebook':
            f_name = sociallogin.account.extra_data['first_name']
            l_name = sociallogin.account.extra_data['last_name']
            if f_name:
                user.first_name = f_name
            if l_name:
                user.last_name = l_name

            #verified = sociallogin.account.extra_data['verified']
            picture_url = "http://graph.facebook.com/{0}/picture?width={1}&height={1}".format(
                sociallogin.account.uid, preferred_avatar_size_pixels)

        if sociallogin.account.provider == 'google':
            f_name = sociallogin.account.extra_data['given_name']
            l_name = sociallogin.account.extra_data['family_name']
            if f_name:
                user.first_name = f_name
            if l_name:
                user.last_name = l_name
            #verified = sociallogin.account.extra_data['verified_email']
            picture_url = sociallogin.account.extra_data['picture']


    #avatar = urllib.request.urlopen(picture_url)
    #url_pic = ContentFile(avatar.read())
    print(picture_url)
    user.save()
    profile = Profile.objects.filter(user=user)[0]
    profile.profile_picture = picture_url
    profile.save()        