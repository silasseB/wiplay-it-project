

from wiplayit_app.settings.common import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SITE_ID = 2

ALLOWED_HOSTS = ['baloyi.pythonanywhere.com','valoi.pythonanywhere.com', 'silasi.pythonanywhere.com' ]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Baloyi$wiplayitdb',
        'USER': 'Baloyi',
        'PASSWORD': 'siLasValoi9020$?',
        'HOST': 'Baloyi.mysql.pythonanywhere-services.com',
        'PORT': '',
        'OPTIONS': {'charset': 'utf8mb4'},
        
    }
}



