from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views

router = DefaultRouter()
router.register("livres", views.LivreViewSet)
router.register("membres", views.MembreViewSet)
router.register("emprunts", views.EmpruntViewSet)
router.register("auteurs", views.AuteurViewSet)
router.register("categories", views.CategorieViewSet)
router.register("editeurs", views.EditeurViewSet)

urlpatterns = [
    path("auth/login/", obtain_auth_token),
    path("stats/", views.stats),
    path("", include(router.urls)),
]
