from rest_framework import serializers
from auth_backend.models import User
from app_backend.models import ( Question, Post, Answer, AnswerComment, AnswerReply,
	                  PostComment, PostReply, DraftEditorMediaContent,
	                  AboutCompany)
 
from app_backend.mixins.serializer_mixins import   SerialiizerMixin
from auth_backend.serializers import  BaseUserSerializer, UserSerializer
from app_backend.helpers import get_users_with_permissions,  has_perm

from app_backend.serializers import (BaseSerializer, 
	                                 BaseQuestionSerializer,
	                                 AnswerSerializer,
	                                 AnswerCommentSerializer,
	                                 AnswerReplySerializer,
	                                 PostSerializer,
	                                 PostCommentSerializer,
	                                 PostReplySerializer,)


class AdminSerializer(BaseSerializer):
	questions              = serializers.SerializerMethodField()
	answers                = serializers.SerializerMethodField()
	answer_comments        = serializers.SerializerMethodField()
	posts                  = serializers.SerializerMethodField()
	post_comments          = serializers.SerializerMethodField()
	post_comment_replies   = serializers.SerializerMethodField()
	answer_comment_replies = serializers.SerializerMethodField()


	def get_questions(self, obj):
		questions = Question.objects.all()
		return BaseQuestionSerializer(questions, context=self.context, many=True).data

	def get_answers(self, obj):
		answers = Answer.objects.all()
		return AnswerSerializer(answers, context=self.context, many=True).data

	def get_answer_comments(self, obj):
		comments = AnswerComment.objects.all()
		return AnswerCommentSerializer(comments, context=self.context, many=True).data

	def get_answer_comment_replies(self, obj):
		comments = AnswerComment.objects.all()
		return AnswerCommentSerializer(comments, context=self.context, many=True).data


	def get_posts(self, obj):
		posts = Post.objects.all()
		return PostSerializer(posts, context=self.context, many=True).data


	def get_post_comments(self, obj):
		comments = PostComment.objects.all()
		return PostCommentSerializer(comments, context=self.context, many=True).data

	def get_post_comment_replies(self, obj):
		replies = PostReply.objects.all()
		return PostReplySerializer(replies, context=self.context, many=True).data




	

