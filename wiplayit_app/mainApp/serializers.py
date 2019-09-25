from rest_framework import serializers
from .models import *
from django.utils import timezone
from django.utils.timezone import get_current_timezone  
import pytz
from guardian.core import ObjectPermissionChecker
from guardian.shortcuts import assign_perm, remove_perm
from mainApp.mixins.serializer_mixins import SerializerMixin, ModelSerializerMixin
from userApp.serializers import  BaseUserSerializer
from mainApp.helpers import get_users_with_permissions, get_objects_perms


class BaseSerializer(ModelSerializerMixin, serializers.ModelSerializer):
	user_can_edit   = serializers.SerializerMethodField()
	
	
	def get_user_can_edit(self, obj):
		checker = self.checker()
		edit_perms = self.get_obj_permissions('edit_perms')
		
		if edit_perms:
			return checker.has_perm(edit_perms[0], obj) or checker.has_perm(edit_perms[1], obj)
			
		return False
		
	def checker(self):
		request = self.context.get('request', None)
		return ObjectPermissionChecker(request.user)
		
		
	
		
		
	def get_obj_permissions(self, perm_to=None):
		permissions = self.context.get('permissions', None)

		return  permissions.get(perm_to, None)

	
		
		 	
	
class BaseChildSerializer(BaseSerializer):
	upvoted    = serializers.SerializerMethodField()
	created_by = BaseUserSerializer(read_only=True)
	
				
	def get_upvoted(self, obj):
		perms = self.get_obj_permissions('upvotes_perms')

		if perms:
			return self.checker().has_perm(perms, obj)

		return False

		
	


class UserSerializer(BaseSerializer, BaseUserSerializer):
	user_is_following = serializers.SerializerMethodField()
				                
	def get_user_is_following(self, obj):
		perms = self.get_obj_permissions('followers_perms')
		return self.checker().has_perm(perms, obj)
	



class BaseReplySerializer(BaseChildSerializer):
	children     = serializers.SerializerMethodField()
	has_children = serializers.SerializerMethodField()
	child_count  = serializers.SerializerMethodField()
	
	def get_children(self, obj):
		children = obj.get_children()
		child_serializer =	self.children_serializer(children)
		return child_serializer
		
	def get_has_children(self, obj):
		return not obj.is_leaf_node() 	
		
	def get_child_count(self, obj):
		if not obj.is_leaf_node():
			return obj.get_children().count()
		return 0 	
	

class AnswerReplySerializer(BaseChildSerializer):
		
	class Meta:
		model = AnswerReply 
		fields = '__all__'

		
class AnswerReplyReadSerializer(BaseReplySerializer):
	
	class Meta:
		model = AnswerReply 
		fields = '__all__'
		
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('answer_reply_perms')
		return AnswerReplyReadSerializer(children_queryset, context=self.context, many=True).data
		
		
	
			



class AnswerCommentSerializer(BaseChildSerializer):
		

	class Meta:
		model = AnswerComment
		fields = '__all__'


class AnswerCommentReadSerializer(AnswerCommentSerializer):
	replies    = serializers.SerializerMethodField()

	def get_replies(self, obj):
		self.update_serializer_obj_perms('answer_reply_perms')
		return AnswerReplyReadSerializer(obj.replies, context=self.context, many=True).data

	




class PostReplySerializer(BaseChildSerializer):
	
	class Meta:
		model = PostReply 
		fields = '__all__'



class PostReplyReadSerializer(BaseReplySerializer):
	
	class Meta:
		model = PostReply 
		fields = '__all__'
		
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('post_reply_perms')
		return PostReplyReadSerializer(children_queryset, context=self.context, many=True).data


class PostCommentSerializer(BaseChildSerializer):

	class Meta:
		model = PostComment 
		fields = '__all__'



class PostCommentReadSerializer(PostCommentSerializer):
	replies    = serializers.SerializerMethodField()

	def get_replies(self, obj):
		self.update_serializer_obj_perms('post_reply_perms')
		return PostReplyReadSerializer(obj.replies, context=self.context, many=True).data


	

class PostSerializer(BaseChildSerializer):
		
	class Meta:
		model = Post 
		fields = '__all__'
		

class PostReadSerializer(PostSerializer):
	comments    = serializers.SerializerMethodField()


	def get_comments(self, obj):
		self.update_serializer_obj_perms('post_comment_perms')
		return PostCommentReadSerializer(obj.comments, context=self.context, many=True).data
	






class AnswerSerializer(BaseChildSerializer):
	
	class Meta:
		model = Answer 
		fields = '__all__'
		
		
	

	

class AnswerReadSerializer(AnswerSerializer):
	comments   = serializers.SerializerMethodField()
	question   =  serializers.SerializerMethodField()

	def get_comments(self, obj):

		self.update_serializer_obj_perms('answer_comment_perms')
		return AnswerCommentReadSerializer(obj.comments, context=self.context, many=True).data


	def get_question(self, obj):

		self.update_serializer_obj_perms('question_perms')
		question = obj.question
		question = Question.objects.get(id=question.id)
		
		return QuestionSerializer(question ,context=self.context, many=False).data



	



class QuestionSerializer(BaseChildSerializer):
	upvoted = None
	user_is_following =  serializers.SerializerMethodField()
	user_has_answer   =  serializers.SerializerMethodField()
	answer_count      =  serializers.SerializerMethodField()
	
	def get_user_is_following(self, obj):
		perms = self.get_obj_permissions('followers_perms')
		return self.checker().has_perm(perms, obj)
		
		
	
	def get_user_has_answer(self, obj):
		request = self.context.get('request', None)
		if request:
			return obj.answers.filter(created_by=request.user).exists()
		return 	False
		
	def get_answer_count(self, obj):
		return obj.answers.count()
		
	
	class Meta:
		model = Question 
		fields = '__all__'



	



class QuestionReadSerializer(QuestionSerializer):
	answers          = serializers.SerializerMethodField()

	def get_answers(self, obj):
		self.update_serializer_obj_perms('answer_perms')
		return AnswerReadSerializer(obj.answers, context=self.context, many=True).data
	
	

class UserProfileSerializer(UserSerializer):
	questions    = serializers.SerializerMethodField()
	posts        = serializers.SerializerMethodField()
	answers      = serializers.SerializerMethodField()
	followers    = serializers.SerializerMethodField()
	followings   = serializers.SerializerMethodField()
	
		
			                
	def get_questions(self, obj):
		questions  =  Question.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('question_perms')
		return QuestionSerializer(questions, context=self.context, many=True).data
	  
	def get_posts(self, obj):
		posts  =  Post.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('post_perms')
		return PostSerializer(posts, context=self.context ,many=True).data
		
		  
	def get_answers(self, obj):
		answers  =  Answer.objects.filter(created_by=obj)
		self.update_serializer_obj_perms('answer_perms')
		return AnswerSerializer(answers, context=self.context ,many=True).data
		
	  
	def get_followers(self, obj):
		users  = get_users_with_permissions(obj,  "change_user_followers")
		self.update_serializer_obj_perms('user_perms')
		return UserSerializer(users, context=self.context ,many=True).data
	  
	def get_followings(self, obj):
		users  = get_users_with_permissions(obj, "change_user_followings")
		self.update_serializer_obj_perms('user_perms')
		return  UserSerializer(users,context=self.context , many=True).data 
		
			
		
		
		
	
		
class DraftEditorContentsSerializer(serializers.ModelSerializer):
	class Meta:
		model = DraftEditorMediaContnent 
		fields = '__all__'



		


class IndexSerializer(SerializerMixin, serializers.Serializer):
	questions = serializers.SerializerMethodField()
	answers   = serializers.SerializerMethodField()
	posts     = serializers.SerializerMethodField() 
	
	
	def get_questions(self, obj):
		questions = Question.objects.all()
		self.update_serializer_obj_perms('question_perms')		       
		return QuestionSerializer(questions, context=self.context, many=True).data
		
		
	def get_answers(self, obj):

		answers = Answer.objects.all()
		self.update_serializer_obj_perms('answer_perms')
		return AnswerReadSerializer(answers, context=self.context, many=True).data
	
	
	def get_posts(self, obj):
		posts = Post.objects.all()
		self.update_serializer_obj_perms('post_perms')

		return PostReadSerializer(posts, context=self.context, many=True).data
		
		
	
	
	
	
