#!/usr/bin/env bash
# Build Render : frontend React -> backend Django
set -o errexit
(cd frontend && npm install && npm run build)
cd backend
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py init_admin
