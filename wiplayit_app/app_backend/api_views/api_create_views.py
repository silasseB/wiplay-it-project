from rest_framework.views import APIView
from rest_framework import generics, response, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
#from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_guardian import filters
from django.db.models.query import QuerySet

from .permissions import CustomObjectPermissions
from guardian.shortcuts import assign_perm, remove_perm, get_users_with_perms
from guardian.core import ObjectPermissionChecker

from mainApp.slug_generator import generate_unique_slug
from .models import *

from .serializers import *
from .serializers import UserSerializer
from mainApp.views import *
from mainApp.mixins.views_mixins import CreateMixin




class CreatePost(CreateMixin, PostView):

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
    
		

class CreateQuestion(CreateMixin , QuestionView):

	def get_object(self):
		pass    
    	

class CreateAnswer(CreateMixin, AnswerView):
		
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
	
	

