import os
from django.conf import settings
from django.db import models 
from PIL import Image

from app_backend.slug_generator import generate_unique_slug
import mptt
from mptt.models import MPTTModel, TreeForeignKey




#Quetion model
class Question(models.Model):
	add_question = models.TextField('what is you question',  blank=True)
	slug         = models.SlugField(max_length=250, blank=True, unique=True)
	followers    = models.IntegerField(default=0)
	created_at   = models.DateTimeField(auto_now_add=True, blank=True)
	created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
	deleted      = models.BooleanField('deleted', default=False)

	class Meta:
		permissions = (
                ('change_question_followers', 'Can Change Question Followers'),

            )
		db_table = "question"


	#@models.permalink
	def get_absolute_url(self):
		from django.urls import reverse
		return reverse('retrieve_apis : question', args=[self.id, self.slug])

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = generate_unique_slug(self.__class__, self.add_question)
		super().save(*args,**kwargs)

	def __str__(self):
		return self.add_question


    

class Answer(models.Model):
	add_answer   = models.TextField(null=True)
	question     = models.ForeignKey( Question, on_delete=models.CASCADE, related_name="answers",blank=True)
	created_at   = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
	upvotes      = models.IntegerField(default=0)
	deleted      = models.BooleanField(default=False)
	
	
	class Meta:
		db_table = "answers"
		permissions = ( ('change_answer_upvotes', 'Can Change Answer  Upvotes'),)
                
	
	def __str__(self):
		return "{0}".format(self.add_answer)
		
		
	def get_absolute_url(self):
		from django.urls import reverse
		return reverse('question_app:answer-page', args=[self.id])






class AnswerComment(models.Model):
	comment     = models.TextField(null=True)
	answer      = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name="comments",blank=True)
	created_at   = models.DateTimeField(auto_now_add=True, blank=True)
	created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
	upvotes      = models.IntegerField(default=0)
	
	
	class Meta:
		db_table = "Answercomments"
		permissions = (('change_answer_comment_upvotes', 'Can Change Answer Comment Uvotes'),)
                
                
	def __str__(self):
		return self.comment





class AnswerReply(MPTTModel):
    reply          = models.TextField(null=True)
    created_at     = models.DateTimeField( auto_now_add=True, blank=True)
    created_by     = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE, related_name="user",blank=True)
    parent         = TreeForeignKey('self', on_delete=models.CASCADE, 
                                null=True, blank=True, related_name='children')
    comment        = models.ForeignKey(AnswerComment, on_delete=models.CASCADE,
                                related_name="replies", blank=True, null=True)
    upvotes        = models.IntegerField(default=0)


    class Meta:
        db_table = "replies"
        permissions = (('change_answer_reply_upvotes', 'Can Change Answer Reply Uvotes'),)

    class MPTTMeta:
        order_insertion_by = ['parent']
        parent_attr = 'parent'

    
    def save(self, *args, **kwargs):
        if not self.id:
            AnswerReply.objects.insert_node(self, self.parent)
        super(AnswerReply, self).save(*args, **kwargs)
    


    def serializable_object(self):
        children = []
        for child in AnswerReply.objects.filter(parent=self.pk):
            children.append(child)
        return children

    def children(self):
        return AnswerReply.objects.filter(parent=self.pk)

    
    def __str__(self):
        return self.reply
    





class Post(models.Model):
    add_title  = models.CharField(max_length=250, blank=True)
    add_post   = models.TextField(null=True)
    slug       = models.SlugField(max_length=250, blank=True, unique=True)
    created_at   = models.DateTimeField(auto_now_add=True, blank=True)
    created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    upvotes      = models.IntegerField(default=0)
    deleted    = models.BooleanField('deleted', default=False)




    class Meta:
        db_table = "posts"
        permissions = ( ('change_post_upvotes', 'Can Change Post Uvotes'), )


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.__class__, self.add_title)
        super().save(*args,**kwargs)

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('post_app:post-page', args=[self.slug])

    def __str__(self):
        return self.add_post


class PostComment(models.Model):
    comment      = models.TextField(null=True)
    post         = models.ForeignKey(Post, on_delete=models.CASCADE,blank=True, related_name="comments")
    created_at   = models.DateTimeField(auto_now_add=True, null=True ,blank=True)
    created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    upvotes      = models.IntegerField(default=0)

    class Meta:
        db_table = "post_comment"
        permissions = ( ('change_post_comment_upvotes', 'Can Change Post Comment  Uvotes'),)


    def __str__(self):
        return self.comment






class PostReply(MPTTModel):
    reply      = models.TextField(null=True)
    parent     = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,related_name='children')
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    comment    = models.ForeignKey(PostComment, on_delete=models.CASCADE,
                                        blank=True, null=True, related_name="replies")
    
    upvotes    = models.IntegerField(default=0)


    class Meta:
        db_table = "post_replies"
        permissions = (('change_post_reply_upvotes', 'Can Change Post Reply Uvotes'),
                )

    class MPTTMeta:
        order_insertion_by = ['reply']

    def save(self, *args, **kwargs):
        if not self.id:
            PostReply.objects.insert_node(self, self.parent)
        super(PostReply, self).save(*args, **kwargs)


    def serializable_object(self):
        obj = []
        for child in PostReply.objects.filter(parent=self.pk):
            obj.append(child)
        return obj

    def children(self):
        return PostReply.objects.filter(parent=self.pk)

    def __str__(self):
        return self.reply




class TermsAndService(models.Model):
    terms    = models.TextField( blank=True)
    service    = models.TextField( blank=True)

    def __str__(self):
        return self.terms


    
class PrivacyAndPolicy(models.Model):
    policy    = models.TextField( blank=True)
    privacy    = models.TextField( blank=True)

    def __str__(self):
        return self.policy


    

class FootballClubs(models.Model):
    name    = models.CharField(max_length=50, blank=True)
    badge   = models.ImageField(upload_to='badge_image/',blank=True)
    followers = models.IntegerField(default=0)


    PSL_FOOTBALL_CLUBS = (
            ('ACT','Ajax Cape town'),
            ('AMU','Amazulu'),
            ('BAR','Baroka'),
            ('BW','Bidvest Wits'),
            ('BFC', 'Bloemfontein Celtic'),
            ('CTC', 'Cape Town city'),
            ('CHU', 'Chippa United'),
            ('FS', 'Free State stars'),
            ('GD', 'Golden Arrows'),
            ('KC', 'Kaizer Chiefs'),
            ('MU', 'Maritzburg United'),
            ('MS', 'Mamelodi Sundowns'),
            ('OP', 'Orlando Pirates'),
            ('PS', 'Platnum Stars'),
            ('PC', 'Polokwane City'),
            ('SU', 'SuperSport United'),
            )

    def __str__(self):
        return self.name


    class Meta:
         permissions = (

                ('change_followers', 'Can Change Followers'),
                )



class SendMessage(models.Model):
    messsage = models.TextField(blank=True)



 

class DraftEditorMediaContent(models.Model):
    

    #Stores draft editor content files 
    def get_upload_path(self, filename):
        return os.path.join('draft-editor-files', filename) 

    draft_editor_file = models.FileField(upload_to=get_upload_path, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE, 
                              blank=True, null=True) 


    class Meta:
        db_table = "draft_editor_contents"
        permissions = (
            ('view_draft_editor_files', 'Can View Draft Editor Files'),
        )
    
    def __str__(self):
        return "{0}".format(self.id)


