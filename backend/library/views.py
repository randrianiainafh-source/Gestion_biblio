from datetime import date
from django.db import transaction
from django.db.models import F, Sum
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Auteur, Categorie, Editeur, Livre, Membre, Emprunt
from .serializers import (AuteurSerializer, CategorieSerializer, EditeurSerializer,
                          LivreSerializer, MembreSerializer, EmpruntSerializer)


class Base(viewsets.ModelViewSet):
    pagination_class = None


class AuteurViewSet(Base):
    queryset = Auteur.objects.order_by("id_auteur")
    serializer_class = AuteurSerializer


class CategorieViewSet(Base):
    queryset = Categorie.objects.order_by("id_categorie")
    serializer_class = CategorieSerializer


class EditeurViewSet(Base):
    queryset = Editeur.objects.order_by("id_editeur")
    serializer_class = EditeurSerializer


class MembreViewSet(Base):
    queryset = Membre.objects.order_by("id_membre")
    serializer_class = MembreSerializer


class LivreViewSet(Base):
    queryset = Livre.objects.select_related("auteur", "editeur", "categorie").order_by("id_livre")
    serializer_class = LivreSerializer


class EmpruntViewSet(Base):
    queryset = Emprunt.objects.select_related("livre", "membre").order_by("-id_emprunt")
    serializer_class = EmpruntSerializer

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.statut != "Retourne":
            Livre.objects.filter(pk=obj.livre_id).update(nb_disponibles=F("nb_disponibles") + 1)
        obj.delete()
        return Response(status=204)

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def retourner(self, request, pk=None):
        obj = self.get_object()
        if obj.statut != "Retourne":
            obj.statut = "Retourne"
            obj.date_retour_effective = date.today()
            obj.save(update_fields=["statut", "date_retour_effective"])
            Livre.objects.filter(pk=obj.livre_id).update(nb_disponibles=F("nb_disponibles") + 1)
        return Response(self.get_serializer(obj).data)


@api_view(["GET"])
def stats(request):
    en_cours = Emprunt.objects.exclude(statut="Retourne")
    tot = Livre.objects.aggregate(t=Sum("nb_exemplaires"), d=Sum("nb_disponibles"))
    recents = Emprunt.objects.select_related("livre", "membre").order_by("-id_emprunt")[:5]
    return Response({
        "livres": Livre.objects.count(),
        "exemplaires": tot["t"] or 0,
        "disponibles": tot["d"] or 0,
        "membres": Membre.objects.count(),
        "emprunts_en_cours": en_cours.count(),
        "en_retard": en_cours.filter(date_retour_prevue__lt=date.today()).count(),
        "recents": EmpruntSerializer(recents, many=True).data,
    })
