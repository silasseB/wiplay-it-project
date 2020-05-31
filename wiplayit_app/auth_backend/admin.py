from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from mptt.admin import MPTTModelAdmin

#from .admin_forms import UserAdminCreationForm, UserAdminChangeForm
#from .models.main_models import *
from .models import *



class Userdmin(admin.ModelAdmin):
    fields = ['first_name', 'last_name', 'email', 
     		 'is_confirmed', 'is_active' , 'is_staff', 'is_superuser' ]

admin.site.register(User,Userdmin)


class Priofiledmin(admin.ModelAdmin):
    fields =['live', 'credential', 'favorite_quote', 
            'profile_picture', 'followers', 'followings', 'user'
        ]

admin.site.register(Profile,Priofiledmin)


class PhoneNumberAdmin(admin.ModelAdmin):
	fields = ['user', 'inter_format','primary_number',
	          'national_format', 'verified', 'primary']

admin.site.register(PhoneNumber, PhoneNumberAdmin)


class CountryAdmin(admin.ModelAdmin):
	fields = ['user', 'short_name', 'long_name']

admin.site.register(Country, CountryAdmin)



class PhoneNumberSmsCodeAdmin(admin.ModelAdmin):
	fields = ['user', 'verify_sms_code', 'password_sms_code']

admin.site.register(PhoneNumberSmsCode, PhoneNumberSmsCodeAdmin)

