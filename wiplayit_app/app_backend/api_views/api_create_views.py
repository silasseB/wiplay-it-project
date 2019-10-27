
from django.shortcuts import get_object_or_404
from app_backend.helpers import get_objects_perms

from app_backend.models import ( User, Question, Post, Answer, AnswerComment, AnswerReply,
	                  PostComment, PostReply, DraftEditorMediaContent )
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
	queryset = DraftEditorMediaContent.objects.all()
	serializer_class = DraftEditorContentsSerializer
	permissions = get_objects_perms('draft_editor_contents_perms')

	def post(self, request):
		editor_file = request.data.get('draft_editor_file')
		
		data = {
		  'draft_editor_file' : editor_file,
		}

		serializer = self.create(data)

		return serializer
	
	

