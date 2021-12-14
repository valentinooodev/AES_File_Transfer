from django.urls import path

from . import views

app_name = 'chat'

urlpatterns = [
    path('', views.index, name='index'),
    path('room/<str:room_name>/', views.room, name='room'),
    path('file/', views.file, name='file'),
    path('test/', views.test, name='test')
]
