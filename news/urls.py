from django.urls import path
from . import views

app_name = 'news'

urlpatterns = [
    path('', views.home, name='home'),
    path('articoli/', views.article_list, name='article_list'),
    path('categoria/<str:category>/', views.article_list, name='category_articles'),
    path('articolo/<slug:slug>/', views.article_detail, name='article_detail'),
    path('chi-siamo/', views.about_us, name='about_us'),
    path('team/', views.team, name='team'),
    path('test-images/', views.test_images, name='test_images'),
]
