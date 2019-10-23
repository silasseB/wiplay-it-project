

from wiplayit_app.settings.common import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False


ALLOWED_HOSTS = ['valoi.pythonanywhere.com']
INSTALLED_APPS.append('whitenoise')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Valoi$wiplayit_project',
        'USER': 'Valoi',
        'PASSWORD': 'siLasValoi9020$?',
        'HOST': 'valoi.pythonanywhere.com',
        'PORT': '',
    }
}



