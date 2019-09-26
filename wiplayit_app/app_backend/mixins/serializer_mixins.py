
from app_backend.helpers import  get_objects_perms

class BaseSerialiizerMixin(object):
	"""docstring for BaseSerialiizerMixin"""
	is_mixin = "Im a mixin Base Class"

	def update_serializer_obj_perms(self, perms_to=None):

		if perms_to:
			permissions = get_objects_perms(perms_to)
			self.context['permissions'] = permissions
			return self.context	

		return 


class ModelSerializerMixin(BaseSerialiizerMixin):
 	"""docstring for ModelSerializerMixin"BaseSerializer"""


class SerializerMixin(BaseSerialiizerMixin):
 	"""docstring for ModelSerializerMixin"BaseSerializer"""



 		 		 
		