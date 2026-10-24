from datetime import date, timedelta
from django.db import transaction
from rest_framework import serializers
from .models import Auteur, Categorie, Editeur, Livre, Membre, Emprunt


class AuteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auteur
        fields = "__all__"


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = "__all__"


class EditeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Editeur
        fields = "__all__"


class MembreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membre
        fields = "__all__"
        extra_kwargs = {"date_inscription": {"required": False}}


class LivreSerializer(serializers.ModelSerializer):
    auteur_nom = serializers.SerializerMethodField()
    editeur_nom = serializers.SerializerMethodField()
    categorie_nom = serializers.SerializerMethodField()

    class Meta:
        model = Livre
        fields = "__all__"
        read_only_fields = ["nb_disponibles"]
        extra_kwargs = {"nb_exemplaires": {"min_value": 1}}

    def get_auteur_nom(self, o):
        return str(o.auteur) if o.auteur else "—"

    def get_editeur_nom(self, o):
        return o.editeur.nom_editeur if o.editeur else "—"

    def get_categorie_nom(self, o):
        return o.categorie.nom_categorie if o.categorie else "—"

    def create(self, vd):
        vd["nb_disponibles"] = vd.get("nb_exemplaires", 1)
        return super().create(vd)

    def update(self, inst, vd):
        if "nb_exemplaires" in vd:
            empruntes = inst.nb_exemplaires - inst.nb_disponibles
            if vd["nb_exemplaires"] < empruntes:
                raise serializers.ValidationError(
                    {"nb_exemplaires": f"{empruntes} exemplaire(s) sont actuellement empruntés."})
            vd["nb_disponibles"] = vd["nb_exemplaires"] - empruntes
        return super().update(inst, vd)


class EmpruntSerializer(serializers.ModelSerializer):
    livre_titre = serializers.CharField(source="livre.titre", read_only=True)
    membre_nom = serializers.SerializerMethodField()
    en_retard = serializers.SerializerMethodField()

    class Meta:
        model = Emprunt
        fields = "__all__"
        read_only_fields = ["statut", "date_retour_effective"]
        extra_kwargs = {"date_retour_prevue": {"required": False}, "date_emprunt": {"required": False}}

    def get_membre_nom(self, o):
        return str(o.membre)

    def get_en_retard(self, o):
        return o.statut != "Retourne" and o.date_retour_prevue < date.today()

    def validate(self, a):
        debut = a.get("date_emprunt") or (self.instance.date_emprunt if self.instance else date.today())
        fin = a.get("date_retour_prevue")
        if fin and fin < debut:
            raise serializers.ValidationError({"date_retour_prevue": "Doit être postérieure à la date d'emprunt."})
        return a

    @transaction.atomic
    def create(self, vd):
        livre = Livre.objects.select_for_update().get(pk=vd["livre"].pk)
        if livre.nb_disponibles < 1:
            raise serializers.ValidationError({"livre": "Aucun exemplaire disponible pour ce livre."})
        vd.setdefault("date_emprunt", date.today())
        vd.setdefault("date_retour_prevue", vd["date_emprunt"] + timedelta(days=14))
        vd["statut"] = "En cours"
        livre.nb_disponibles -= 1
        livre.save(update_fields=["nb_disponibles"])
        return super().create(vd)

    def update(self, inst, vd):
        vd.pop("livre", None)
        vd.pop("membre", None)
        return super().update(inst, vd)
