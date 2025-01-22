from django import forms
from .models import Route

class RouteForm(forms.ModelForm):
    # waypoints_list = forms.CharField(widget=forms.HiddenInput(), required=False)  # Hidden field for GeoJSON data

    class Meta: #  Meta class tells django which model to base the form on and which fields to include in the form.
        model = Route
        fields = ['title', 'length', 'activity_type', 'waypoints_list'] # same as in models!
        labels = {'title' : 'Title', 'length' : 'Length', 'activity_type' : 'Activity Type', 'waypoints_list' : 'Waypoints'} # don't generate labels for text fields