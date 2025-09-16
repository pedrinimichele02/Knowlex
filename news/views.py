from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from .models import Article, AboutUs, TeamMember


def home(request):
    # Mostra gli ultimi 6 articoli pubblicati
    featured_articles = Article.objects.filter(published=True).order_by('-created_at')[:6]
    
    # Articoli con immagini per il carosello della homepage
    carousel_articles = Article.objects.filter(
        published=True,
        image__isnull=False
    ).exclude(image='').order_by('-created_at')[:20]  # Massimo 20 immagini per il carosello
    
    context = {
        'featured_articles': featured_articles,
        'carousel_articles': carousel_articles,
    }
    return render(request, 'news/home.html', context)


def article_list(request, category=None):
    articles = Article.objects.filter(published=True)
    
    if category:
        articles = articles.filter(category=category)
        category_name = dict(Article.CATEGORY_CHOICES).get(category)
    else:
        category_name = 'Tutte le Categorie'
    
    paginator = Paginator(articles, 10)  # 10 articoli per pagina
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'category': category,
        'category_name': category_name,
    }
    return render(request, 'news/article_list.html', context)


def article_detail(request, slug):
    article = get_object_or_404(Article, slug=slug, published=True)
    
    # Articoli correlati nella stessa categoria
    related_articles = Article.objects.filter(
        category=article.category, 
        published=True
    ).exclude(id=article.id)[:3]
    
    context = {
        'article': article,
        'related_articles': related_articles,
    }
    return render(request, 'news/article_detail.html', context)


def test_images(request):
    articles = Article.objects.filter(published=True, image__isnull=False).exclude(image='')
    return render(request, 'test_images.html', {'articles': articles})


def about_us(request):
    # Get the first (and hopefully only) AboutUs instance
    about = AboutUs.objects.first()
    
    context = {
        'about': about,
    }
    return render(request, 'news/about_us.html', context)


def team(request):
    # Get active team members ordered by their display order
    team_members = TeamMember.objects.filter(is_active=True).order_by('order', 'name')
    
    context = {
        'team_members': team_members,
    }
    return render(request, 'news/team.html', context)
