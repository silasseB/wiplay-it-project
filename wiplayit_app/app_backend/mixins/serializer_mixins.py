
from app_backend.helpers import  get_objects_perms, has_perm

class SerialiizerMixin(object):
	"""docstring for BaseSerialiizerMixin"""
	is_mixin = "Im a mixin Base Class"

	def current_user(self):
		request =  self.context.get('request', None)
		if request:
			return request.user
		return None


		
	def get_obj_permissions(self, perm_to=None):
		permissions = self.context.get('permissions', None)

		return  permissions.get(perm_to, None)

	def update_serializer_obj_perms(self, perms_to=None):

		if perms_to:
			permissions = get_objects_perms(perms_to)
			self.context['permissions'] = permissions
			return self.context	

		return 





