from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse


class Article(models.Model):
    CATEGORY_CHOICES = [
        ('commerciale', 'Diritto Commerciale'),
        ('privato', 'Diritto Civile'),
        ('lavoro', 'Diritto del Lavoro'),
        ('penale', 'Diritto Penale'),
    ]
    
    title = models.CharField(max_length=255, verbose_name='Titolo')
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField(verbose_name='Contenuto')
    summary = models.TextField(max_length=300, verbose_name='Riassunto', help_text='Breve riassunto dell\'articolo')
    image = models.ImageField(upload_to='articles/', blank=True, null=True, verbose_name='Immagine', help_text='Immagine principale dell\'articolo')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Categoria')
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE, verbose_name='Autore')
    published = models.BooleanField(default=False, verbose_name='Pubblicato')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Data creazione')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data ultima modifica')
    
    class Meta:
        verbose_name = 'Articolo'
        verbose_name_plural = 'Articoli'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['published']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('news:article_detail', kwargs={'slug': self.slug})
    
    def get_category_display_name(self):
        return dict(self.CATEGORY_CHOICES)[self.category]


class ArticleImage(models.Model):
    article = models.ForeignKey(Article, related_name='gallery_images', on_delete=models.CASCADE, verbose_name='Articolo')
    image = models.ImageField(upload_to='articles/gallery/', verbose_name='Immagine')
    caption = models.CharField(max_length=255, blank=True, verbose_name='Didascalia')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordine')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data creazione')
    
    class Meta:
        verbose_name = 'Immagine Articolo'
        verbose_name_plural = 'Immagini Articolo'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.article.title} - Immagine {self.order}"


class AboutUs(models.Model):
    title = models.CharField(max_length=255, default='Chi Siamo', verbose_name='Titolo')
    content = models.TextField(verbose_name='Contenuto', help_text='Descrizione dell\'azienda e dei suoi scopi')
    mission = models.TextField(blank=True, verbose_name='Missione', help_text='La nostra missione')
    vision = models.TextField(blank=True, verbose_name='Visione', help_text='La nostra visione')
    image = models.ImageField(upload_to='about/', blank=True, null=True, verbose_name='Immagine principale')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data creazione')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data ultima modifica')
    
    class Meta:
        verbose_name = 'Chi Siamo'
        verbose_name_plural = 'Chi Siamo'
    
    def __str__(self):
        return self.title


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('director', 'Direttore'),
        ('editor', 'Editore'),
        ('lawyer', 'Avvocato'),
        ('journalist', 'Giornalista'),
        ('researcher', 'Ricercatore'),
        ('other', 'Altro'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nome e Cognome')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, verbose_name='Ruolo')
    bio = models.TextField(verbose_name='Biografia')
    image = models.ImageField(upload_to='team/', blank=True, null=True, verbose_name='Foto')
    email = models.EmailField(blank=True, verbose_name='Email')
    linkedin_url = models.URLField(blank=True, verbose_name='LinkedIn')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordine di visualizzazione')
    is_active = models.BooleanField(default=True, verbose_name='Attivo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data creazione')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data ultima modifica')
    
    class Meta:
        verbose_name = 'Membro del Team'
        verbose_name_plural = 'Membri del Team'
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"
    
    def get_role_display_name(self):
        return dict(self.ROLE_CHOICES)[self.role]
