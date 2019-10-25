
from django.shortcuts import get_object_or_404
from app_backend.models import DraftEditorMediaContnent

from app_backend.serializers import DraftEditorContentsSerializer

from app_backend.views import (BaseApiView, PostView, PostCommentView, PostReplyView, PostChildReplyView,
	                            QuestionView, AnswerView, AnswerCommentView, AnswerReplyView, AnswerChildReplyView)
from app_backend.mixins.views_mixins import CreateMixin




class CreatePostView(CreateMixin, PostView):

	def get_object(self):
		pass    
	


class CreatePostCommentView(CreateMixin, PostCommentView):
		
	def get_object(self):
		print(self.kwargs['pk'])
		return get_object_or_404(Post, id=self.kwargs['pk']) 
    
		



class CreatePostReplyView(CreateMixin,  PostReplyView):
		
	def get_object(self):
		return get_object_or_404(PostComment, id=self.kwargs['pk'])  
   



class CreatePostReplyChildView(CreateMixin, PostChildReplyView):
		
	def get_object(self):
		return get_object_or_404(PostReply, id=self.kwargs['pk'])  
    
		

class CreateQuestionView(CreateMixin , QuestionView):

	def get_object(self):
		pass    
    	

class CreateAnswerView(CreateMixin, AnswerView):
		
	def get_object(self):
		return get_object_or_404(Question, id=self.kwargs['pk'])  
    
	

class CreateAnswerCommentView(CreateMixin, AnswerCommentView):
		
	def get_object(self):
		return get_object_or_404(Answer, id=self.kwargs['pk']) 
    
	

class CreateAnswerReplyView(CreateMixin, AnswerReplyView):
	
	def get_object(self):
		
		return get_object_or_404(AnswerComment, id=self.kwargs['pk'])  
    




class CreateAnswerReplyChildView(CreateMixin , AnswerChildReplyView):
		
	def get_object(self):
		
		return get_object_or_404(AnswerReply, id=self.kwargs['pk'])  
    
			



class CreateDraftEditorContentsView(CreateMixin, BaseApiView):
	queryset = DraftEditorMediaContnent.objects.all()
	serializer_class = DraftEditorContentsSerializer
	permissions = 'view_draft_editor_files'

	def post(self, request):
		editor_file = request.data.get('draft_editor_file')
		
		data = {
		'draft_editor_file' : editor_file,
		}

		serializer = self.create(data, permissions)

		return serializer
	
	

