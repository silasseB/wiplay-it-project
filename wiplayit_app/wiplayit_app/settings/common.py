"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


SECRET_KEY = '(sm1(p$as-5c)a@)^vthx1g%t+kil^rzxx%mx*!vp@8rbqm7t2'


#LOGOUT_REDIRECT_URL  = 'user_app:login'
#LOGIN_REDIRECT_URL = 'user_app:api-login'
AUTH_USER_MODEL = 'app_backend.User'

GUARDIAN_MONKEY_PATH = False
ANONYMOUS_USER_NAME = "Anonymous"
GUARDIAN_GET_INIT_ANONYMOUS_USER = 'app_backend.models.get_anonymous_user_instance'

EMAIL_USE_TLS = True
EMAIL_USE_SSL=False

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'silassibaloy@gmail.com'
EMAIL_HOST_PASSWORD = 'SilasValoi2020@?'
EMAIL_PORT = 587

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'

ACCOUNT_ADAPTER = 'app_backend.configs.custom_adapter.CustomAccountAdapter'
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_ADAPTER = 'app_backend.configs.custom_adapter.CustomSocialAccountAdapter'
SOCIALACCOUNT_QUERY_EMAIL = True
ACCOUNT_LOGOUT_ON_GET = False
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
SOCIALACCOUNT_AVATAR_SUPPORT = True
 

APPEND_SLASH = True

AUTHENTICATION_BACKENDS = (

        'django.contrib.auth.backends.ModelBackend',
        'guardian.backends.ObjectPermissionBackend',
        'allauth.account.auth_backends.AuthenticationBackend',
        )

REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
   ),


}


REST_AUTH_SERIALIZERS = {
   'USER_DETAILS_SERIALIZER'   : 'app_backend.auth_serializers.CustomRegisterSerializer',
   'TOKEN_SERIALIZER'          : 'app_backend.auth_serializers.TokenSerializer',
   'PASSWORD_RESET_SERIALIZER' : 'app_backend.auth_serializers.CustomPasswordResetSerializer',
}


REST_AUTH_REGISTER_SERIALIZERS = {
       
}


JWT_AUTH = { 
    'JWT_AUTH_HEADER_PREFIX': 'JWT'
    #'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=300)
}

# Application definition


INSTALLED_APPS = [
    'rest_auth.registration',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sites',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_auth',
    'rest_framework.authtoken',
    'corsheaders',
    'django.contrib.admin',
    'webpack_loader',
    'app_backend',
    'django_countries',
    'twilio',
    'guardian',
    'mptt',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
]




MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
    
]

CORS_ORIGIN_ALLOW_ALL = False


CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR + "/templates/",],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'wiplayit_app.wsgi.application'

ROOT_URLCONF = 'wiplayit_app.urls'



# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATICFILES_FINDERS = "django.contrib.staticfiles.finders.AppDirectoriesFinder",
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'dist'),
    
]


STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'




WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'dist/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
            
            
        }
}

