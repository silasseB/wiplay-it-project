from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from mptt.admin import MPTTModelAdmin

#from .admin_forms import UserAdminCreationForm, UserAdminChangeForm
#from .models.main_models import *
from .models import *



class Userdmin(admin.ModelAdmin):
    fields = ['first_name', 'last_name', 'email', 
     'is_confirmed', 'is_active' , 'is_staff', 'is_superuser'
    ]

admin.site.register(User,Userdmin)


class Priofiledmin(admin.ModelAdmin):
    fields =['live', "credential", "favorite_quote", 'country', 
            "profile_picture", "followers", "followings", "user"
        ]

admin.site.register(Profile,Priofiledmin)


