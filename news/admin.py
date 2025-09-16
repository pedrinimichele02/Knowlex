from django.contrib import admin
from adminsortable2.admin import SortableInlineAdminMixin, SortableAdminBase
from .models import Article, ArticleImage, AboutUs, TeamMember


class ArticleImageInline(SortableInlineAdminMixin, admin.TabularInline):
    model = ArticleImage
    extra = 1
    fields = ('image', 'caption')
    readonly_fields = ('order',)


@admin.register(Article)
class ArticleAdmin(SortableAdminBase, admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'published', 'created_at']
    list_filter = ['category', 'published', 'created_at', 'author']
    search_fields = ['title', 'content', 'summary']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informazioni generali', {
            'fields': ('title', 'slug', 'category', 'author')
        }),
        ('Contenuto', {
            'fields': ('summary', 'content', 'image')
        }),
        ('Galleria Immagini', {
            'fields': tuple()
        }),
        ('Pubblicazione', {
            'fields': ('published',)
        }),
        ('Metadati', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    inlines = [ArticleImageInline]
    
    def save_model(self, request, obj, form, change):
        if not change:  # Se è un nuovo articolo
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informazioni Principali', {
            'fields': ('title', 'content')
        }),
        ('Missione e Visione', {
            'fields': ('mission', 'vision')
        }),
        ('Immagine', {
            'fields': ('image',)
        }),
        ('Metadati', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def has_add_permission(self, request):
        # Allow only one AboutUs instance
        return not AboutUs.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of AboutUs content
        return False


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'order', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['name', 'bio']
    list_editable = ['order', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Informazioni Personali', {
            'fields': ('name', 'role', 'bio', 'image')
        }),
        ('Contatti', {
            'fields': ('email', 'linkedin_url')
        }),
        ('Impostazioni', {
            'fields': ('order', 'is_active')
        }),
        ('Metadati', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
