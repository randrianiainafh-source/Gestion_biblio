import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Crée (ou met à jour) l'administrateur (ADMIN_USER / ADMIN_PASSWORD, défaut lalaina / admin4321)"

    def handle(self, *args, **opts):
        name = os.environ.get("ADMIN_USER", "lalaina")
        User = get_user_model()
        u, _ = User.objects.get_or_create(username=name)
        u.is_staff = u.is_superuser = True
        u.email = "herilalaina@gmail.com"
        u.set_password(os.environ.get("ADMIN_PASSWORD", "admin4321"))
        u.save()
        self.stdout.write(self.style.SUCCESS(f"Superuser '{name}' prêt."))
