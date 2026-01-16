from django.contrib import admin
from .models import UserProfile, Chat

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email', 'bio')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    fieldsets = (
        ('User Information', {
            'fields': ('user', 'bio', 'avatar')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('user', 'message_preview', 'response_preview', 'timestamp')
    list_filter = ('timestamp', 'user')
    search_fields = ('user__username', 'message', 'response')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)
    date_hierarchy = 'timestamp'

    fieldsets = (
        ('Chat Information', {
            'fields': ('user', 'message', 'response')
        }),
        ('Timestamps', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )

    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'

    def response_preview(self, obj):
        return obj.response[:50] + '...' if len(obj.response) > 50 else obj.response
    response_preview.short_description = 'Response'
