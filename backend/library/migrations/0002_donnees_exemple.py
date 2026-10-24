from django.db import migrations


def charger(apps, schema_editor):
    g = lambda n: apps.get_model("library", n)
    for pk, nom, prenom, nat in [(1, "Hugo", "Victor", "Française"), (2, "Camus", "Albert", "Française"), (3, "Orwell", "George", "Britannique")]:
        g("Auteur").objects.create(id_auteur=pk, nom=nom, prenom=prenom, nationalite=nat)
    for pk, nom in [(1, "Roman"), (2, "Science-fiction"), (3, "Philosophie")]:
        g("Categorie").objects.create(id_categorie=pk, nom_categorie=nom)
    for pk, nom in [(1, "Gallimard"), (2, "Le Livre de Poche"), (3, "Penguin Books")]:
        g("Editeur").objects.create(id_editeur=pk, nom_editeur=nom)
    for pk, nom, prenom, mail, tel in [
        (1, "Diallo", "Awa", "awa.diallo@mail.com", "0612345678"),
        (2, "Traore", "Moussa", "moussa.traore@mail.com", "0698765432"),
    ]:
        g("Membre").objects.create(id_membre=pk, nom=nom, prenom=prenom, email=mail, telephone=tel)
    for pk, titre, isbn, an, nb, dispo, a, e, c in [
        (1, "Les Misérables", "9782253096344", 1862, 3, 3, 1, 2, 1),
        (2, "L'Étranger", "9782070360024", 1942, 5, 3, 2, 1, 3),
        (3, "1984", "9780451524935", 1949, 4, 4, 3, 3, 2),
    ]:
        g("Livre").objects.create(id_livre=pk, titre=titre, isbn=isbn, annee_publication=an, nb_exemplaires=nb,
                                  nb_disponibles=dispo, auteur_id=a, editeur_id=e, categorie_id=c)
    for pk, l, m, d1, d2, d3, st in [
        (1, 1, 1, "2026-09-16", "2026-09-30", "2026-09-16", "Retourne"),
        (2, 2, 2, "2026-09-16", "2026-09-30", None, "En cours"),
        (3, 2, 1, "2026-09-16", "2026-10-06", None, "En cours"),
    ]:
        g("Emprunt").objects.create(id_emprunt=pk, livre_id=l, membre_id=m, date_emprunt=d1,
                                    date_retour_prevue=d2, date_retour_effective=d3, statut=st)


class Migration(migrations.Migration):
    dependencies = [("library", "0001_initial")]
    operations = [migrations.RunPython(charger, migrations.RunPython.noop)]
