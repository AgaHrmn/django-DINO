from django import forms
from .models import Route

ACTIVITIES_CHOICES =(
    ("Run", "Run"),
    ("Walk", "Walk"),
    ("Hike", "Hike"),
    ("Bike", "Bike"),
)

class RouteForm(forms.ModelForm):
    activity_type = forms.ChoiceField(choices=ACTIVITIES_CHOICES)  # predefine actibvities to select from list

    def __init__(self, *args, **kwargs):
        # Retrieve 'readonly_length' argument from kwargs, defaulting to False
        readonly_length = kwargs.pop('readonly_length', False)
        super().__init__(*args, **kwargs)

        if readonly_length:
            self.fields['length'].widget = forms.TextInput(attrs={'readonly': 'readonly'})
            print("Length field is read-only")
        else:
            self.fields['length'].widget = forms.TextInput()
            print("Length field is editable")

    class Meta: #  Meta class tells django which model to base the form on and which fields to include in the form.
        model = Route
        fields = ['title', 'length', 'activity_type', 'waypoints_list', 'trackpoints_list'] # same as in models!
        labels = {'title' : 'Title', 'length' : 'Length', 'activity_type' : 'Activity Type'} 
        widgets = {
            'waypoints_list': forms.HiddenInput(),
            'trackpoints_list': forms.HiddenInput(),
            
        }