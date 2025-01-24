from django.db import models

class Route(models.Model):
    '''Route user wants to create'''
    title = models.CharField(max_length=200)
    length = models.FloatField()
    activity_type = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    waypoints_list = models.JSONField()
    icon = models.CharField(default="")

    def __str__(self):
        '''Return string representation of the model'''
        return self.title
