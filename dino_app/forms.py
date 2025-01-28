from django import forms
from .models import Route

ACTIVITIES_CHOICES =(
    ("Run", "Run"),
    ("Walk", "Walk"),
    ("Hike", "Hike"),
    ("Road bike", "Road bike"),
    ("Mountain bike", "Mountain bike"),
)

class RouteForm(forms.ModelForm):
    activity_type = forms.ChoiceField(choices=ACTIVITIES_CHOICES)  # predefine actibvities to select from list

    class Meta: #  Meta class tells django which model to base the form on and which fields to include in the form.
        model = Route
        fields = ['title', 'length', 'activity_type', 'waypoints_list', 'trackpoints_list'] # same as in models!
        labels = {'title' : 'Title', 'length' : 'Length', 'activity_type' : 'Activity Type', 'waypoints_list' : 'Waypoints', 'trackpoints_list' : 'Trackpoints'} # don't generate labels for text fields