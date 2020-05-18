

from wiplayit_app.settings.common import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SITE_ID = 3


EMAIL_USE_SSL = False
EMAIL_USE_TLS = True
EMAIL_PORT    = 25


EMAIL_HOST          = 'smtpout.secureserver.net' 
EMAIL_HOST_USER     =  'info@wiplayit.com' 
EMAIL_HOST_PASSWORD =  'SilasValoi1990@?'   

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL       = EMAIL_HOST_USER
EMAIL_FROM         = EMAIL_HOST_USER 

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



