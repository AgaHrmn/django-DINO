from django import forms
from .models import Route

class RouteForm(forms.ModelForm):
    class Meta: #  Meta class tells django which model to base the form on and which fields to include in the form.
        model = Route
        fields = ['title', 'length', 'activity_type'] # same as in models!
        labels = {'title' : 'Title', 'length' : 'Length', 'activity_type' : 'Activity Type'} # don't generate labels for text fields