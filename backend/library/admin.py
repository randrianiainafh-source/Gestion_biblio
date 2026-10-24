from django.contrib import admin
from .models import Auteur, Categorie, Editeur, Livre, Membre, Emprunt

for m in (Auteur, Categorie, Editeur, Livre, Membre, Emprunt):
    admin.site.register(m)
