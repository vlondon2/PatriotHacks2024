from django.urls import path
from . import views

urlpatterns = [
    path('tos-summarize/', views.summarize_tos, name='summarize_tos'),
    path('bullets-get/', views.get_bullets, name='get_bullets')
]