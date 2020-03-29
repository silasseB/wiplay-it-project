

from wiplayit_app.settings.common import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SITE_ID = 2

ALLOWED_HOSTS = ['valoi.pythonanywhere.com', 'silasi.pythonanywhere.com']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Valoi$wiplayitdb',
        'USER': 'Valoi',
        'PASSWORD': 'siLasValoi9020$?',
        'HOST': 'Valoi.mysql.pythonanywhere-services.com',
        'PORT': '',
        'OPTIONS': {'charset': 'utf8mb4'},
        
    }
}



