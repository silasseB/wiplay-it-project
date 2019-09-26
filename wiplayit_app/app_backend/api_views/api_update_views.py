from app_backend.models import *

from app_backend.serializers import *
from app_backend.views import *
from app_backend.mixins.views_mixins import  UpdateObjectMixin


				
		
class UpdateUserProfileView(UpdateObjectMixin, UserView):
	pass
		



class UpdateQuestionView( UpdateObjectMixin, QuestionView):
	pass
			
		
	
class UpdateAnswerView(UpdateObjectMixin, AnswerView):
	pass
	


class UpdateAnswerCommentView(UpdateObjectMixin, AnswerCommentView):
	pass

	
class UpdateAnswerReplyView(UpdateObjectMixin, AnswerReplyView):
	pass





class UpdatePostView(UpdateObjectMixin, PostView):
	pass





class UpdatePostCommentView(UpdateObjectMixin, PostCommentView ):
	pass
	
	
	

class UpdatePostReplyView(UpdateObjectMixin, PostReplyView):
	pass



