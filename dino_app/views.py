from django.shortcuts import render

def index(request):
    """Home page for DINO"""
    return render(request, 'dino_app/index.html')


