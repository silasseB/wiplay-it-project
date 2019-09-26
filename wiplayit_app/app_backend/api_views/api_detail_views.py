import os
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import get_object_or_404, render

from app_backend.views import *
from app_backend.serializers import IndexSerializer
from app_backend.mixins.views_mixins import RetrieveMixin



def index(request):
	return render(request, 'build/index.html')


class IndexView(BaseView, APIView):
	serializer_class = IndexSerializer
		
	def get(self, *args, **kwargs):
		print(os.path.abspath(__file__))
	
		kwargs['context'] = self.get_serializer_context()
		serializer = self.serializer_class(*args, **kwargs)
		return Response(serializer.data,  status=status.HTTP_200_OK )
		
		



class PostListView(RetrieveMixin, PostDetailView):
	pass
	


class QuestionListView( RetrieveMixin, QuestionView):
		
	def get_action_data(self, request):
		serializer = self.list(request)
		return Response(serializer.data, status=status.HTTP_200_OK)
			
	   	


class PostRetrieveView(RetrieveMixin, PostDetailView):
	pass
		



class QuestionDetailView(QuestionDetailView):

	def get_action_data(self, request):
		serializer = self.retrive(request)
		return Response(serializer.data, status=status.HTTP_200_OK)

	
		


class GetAnswerCommentListView(AnswerCommentDetailView):
		
	def get_queryset(self):
		return AnswerComment.objects.filter(answer=self.kwargs['pk'])
			
	
	

class GetAnswerReplyListView(AnswerReplyDetailView):
	
	def get_queryset(self):
		return  AnswerReply.objects.filter(comment=self.kwargs['pk'])
		
		
class GetAnswerReplyChildrenListView(GetAnswerReplyListView):
	
	def get_queryset(self):
		return AnswerReply.objects.filter(parent=self.kwargs['pk'])
			
	



class GetQuestionFollowers(RetrieveMixin, UserView):
	
	
	def get_queryset(self):
		question = get_object_or_404(Question, pk=self.kwargs['pk'])
		followers_perms = self.get_obj_permissions('question_perms', 'followers_perms')
		return get_users_with_permissions(question, followers_perms)
		
	


class GetAnswerUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		upvotes_perm =  self.get_obj_permissions('answer_perms', 'upvotes_perms')
		answer = get_object_or_404(Answer, pk=self.kwargs['pk'])
		return get_users_with_permissions(answer, upvotes_perm)
		



		
class GetAnswerCommentUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		comment = get_object_or_404(AnswerComment, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('answer_comment_perms', 'upvotes_perms')
		return get_users_with_permissions(comment, upvotes_perm)
		


class GetAnswerReplyUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		reply = get_object_or_404(AnswerReply, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('answer_reply_perms', 'upvotes_perms')
		return get_users_with_permissions(reply, upvotes_perm)
		



class GetPostCommentListView(PostCommentDetailView):
		
	def get_queryset(self):
		return PostComment.objects.filter(post=self.kwargs['pk'])
		
	

class GetPostReplyListView(PostReplyDetailView):
	
	def get_queryset(self):
		return  PostReply.objects.filter(comment=self.kwargs['pk'])
		
		


class GetPostReplyChildrenListView(GetPostReplyListView):
	
	def get_queryset(self):
		return PostReply.objects.filter(parent=self.kwargs['pk'])
		




class GetPostUpVoters(RetrieveMixin, UserView ):

	def get_queryset(self):
		upvotes_perm = self.get_obj_permissions('post_perms', 'upvotes_perms')
		post = get_object_or_404(Post, pk=self.kwargs['pk'])
		return get_users_with_permissions(post, upvotes_perm)
		
		
		
	
class GetPostCommentUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		comment = get_object_or_404(PostComment, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('post_comment_perms', 'upvotes_perms')
		return get_users_with_permissions(comment, upvotes_perm)
		
		



		
class GetPostReplyUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		reply = get_object_or_404(PostReply, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('post_reply_perms', 'upvotes_perms')
		return get_users_with_permissions(reply, upvotes_perm)
		

		
		
class GetUserFollowers(RetrieveMixin, UserView):
	 
	def get_queryset(self):
		user = get_object_or_404(User, pk=self.kwargs['pk'])
		followers_perms = self.get_obj_permissions('user_perms', 'followers_perms')
		return get_users_with_permissions(user, followers_perms)
		


		
class GetUserFollowings(RetrieveMixin, UserView):
	
	def get_queryset(self):
		user = get_object_or_404(User, pk=self.kwargs['pk'])
		followings_perms = self.get_obj_permissions('user_perms', 'followings_perms')
		return get_users_with_permissions(user, followings_perms)
		
	
		

class GetUserProfileView(UserView):
	serializer_class = UserProfileSerializer
	

		

@api_view(['GET'])
def current_user(request):
	#Determine the current user by their token, and return their data
	serializer = BaseUserSerializer(request.user)
	return Response(serializer.data)

		
		
		
		
		
