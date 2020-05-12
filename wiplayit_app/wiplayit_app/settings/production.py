

from wiplayit_app.settings.common import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SITE_ID = 3
SECURE_SSL_REDIRECT = True
CORS_ORIGIN_WHITELIST = [
	'https://baloyi.pythonanywhere.com',
	'https://wiplayit.com',
	'http://wiplayit.com',
	'https://www.wiplayit.com',
	'http://www.wiplayit.com' ]

ALLOWED_HOSTS = [
	'baloyi.pythonanywhere.com',
	'wiplayit.com',
	'www.wiplayit.com',
	'valoi.pythonanywhere.com', 
	'silasi.pythonanywhere.com' ]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Baloyi$wiplayitdb',
        'USER': 'Baloyi',
        'PASSWORD': 'siLasValoi9020$?',
        'HOST': 'Baloyi.mysql.pythonanywhere-services.com',
        'PORT': '',
        'OPTIONS': {
        	'charset': 'utf8mb4',
        	'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        	},
        
    }
}



