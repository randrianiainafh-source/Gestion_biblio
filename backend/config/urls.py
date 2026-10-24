from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, Http404
from django.urls import path, include, re_path


def spa(request, *args, **kwargs):
    """Renvoie l'application React pour toute page qui n'est ni /api ni /admin."""
    index = settings.FRONTEND_DIST / "index.html"
    if not index.exists():
        raise Http404("Frontend non compilé : lancez « npm run build » dans frontend.")
    return FileResponse(open(index, "rb"), content_type="text/html")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("library.urls")),
    re_path(r"^(?!api/|admin/|static/|assets/).*$", spa),
]
