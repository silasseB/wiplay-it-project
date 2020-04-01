from rest_framework import serializers
from auth_backend.models import User
from .models import (Question, Post, Answer, AnswerComment, AnswerReply,
	                  PostComment, PostReply, DraftEditorMediaContent)

from .mixins.serializer_mixins import   SerialiizerMixin
from auth_backend.serializers import  BaseUserSerializer, UserSerializer
from .helpers import get_users_with_permissions,  has_perm



class BaseModelSerializer(SerialiizerMixin, serializers.ModelSerializer):
	user_can_edit   = serializers.SerializerMethodField()

	

class BaseSerializer(SerialiizerMixin, serializers.Serializer):
	pass
		
		 	
	
class BaseChildSerializer(BaseModelSerializer):
	upvoted    = serializers.SerializerMethodField()
	created_by = BaseUserSerializer(read_only=True)
	
				
	def get_upvoted(self, obj):
		perms = self.get_obj_permissions('upvotes_perms')

		if perms:
			return has_perm(self.current_user(), perms, obj)

		return False

		
	

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
		return has_perm(self.current_user(), perms, obj)
		
		
	
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
	

class DraftEditorContentsSerializer(BaseModelSerializer):
	class Meta:
		model = DraftEditorMediaContent
		fields = '__all__'


class IndexSerializer(BaseSerializer):
	questions = serializers.SerializerMethodField()
	answers   = serializers.SerializerMethodField()
	posts     = serializers.SerializerMethodField() 
	users     = serializers.SerializerMethodField()
	
	
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

	def get_users(self, obj):
		self.update_serializer_obj_perms('user_perms')
		users = User.objects.exclude(
						first_name="Anonymous"
					).filter(
						is_confirmed=True
					).filter(
						is_superuser=False
					)

		user_list = UserSerializer(users, context=self.context, many=True).data
		return user_list
		
		
	
	
	
	
