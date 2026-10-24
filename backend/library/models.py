from datetime import date
from django.db import models

# Tables créées par les migrations Django (SQLite par défaut).

class Auteur(models.Model):
    id_auteur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    nationalite = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "auteur"

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    nom_categorie = models.CharField(max_length=100)

    class Meta:
        db_table = "categorie"

    def __str__(self):
        return self.nom_categorie


class Editeur(models.Model):
    id_editeur = models.AutoField(primary_key=True)
    nom_editeur = models.CharField(max_length=150)

    class Meta:
        db_table = "editeur"

    def __str__(self):
        return self.nom_editeur


class Livre(models.Model):
    id_livre = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=255)
    isbn = models.CharField(max_length=20, unique=True, null=True, blank=True)
    annee_publication = models.IntegerField(null=True, blank=True)
    nb_exemplaires = models.IntegerField(default=1)
    nb_disponibles = models.IntegerField(default=0)
    auteur = models.ForeignKey(Auteur, models.SET_NULL, db_column="id_auteur", null=True, blank=True)
    editeur = models.ForeignKey(Editeur, models.SET_NULL, db_column="id_editeur", null=True, blank=True)
    categorie = models.ForeignKey(Categorie, models.SET_NULL, db_column="id_categorie", null=True, blank=True)

    class Meta:
        db_table = "livre"

    def __str__(self):
        return self.titre


class Membre(models.Model):
    id_membre = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.CharField(max_length=150, unique=True, null=True, blank=True)
    telephone = models.CharField(max_length=20, null=True, blank=True)
    date_inscription = models.DateField(default=date.today)

    class Meta:
        db_table = "membre"

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Emprunt(models.Model):
    id_emprunt = models.AutoField(primary_key=True)
    livre = models.ForeignKey(Livre, models.CASCADE, db_column="id_livre")
    membre = models.ForeignKey(Membre, models.CASCADE, db_column="id_membre")
    date_emprunt = models.DateField(default=date.today)
    date_retour_prevue = models.DateField()
    date_retour_effective = models.DateField(null=True, blank=True)
    statut = models.CharField(max_length=20, default="En cours")

    class Meta:
        db_table = "emprunt"
