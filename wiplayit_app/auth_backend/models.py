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

#file_path = os.path.join(dest_folder, filename)

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



