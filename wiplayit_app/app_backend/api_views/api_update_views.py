
from app_backend.views import (UserView,PostView, PostCommentView, PostReplyView, 
                                QuestionView, AnswerView, AnswerCommentView, AnswerReplyView )
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



