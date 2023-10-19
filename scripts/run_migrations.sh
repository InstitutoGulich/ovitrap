#!/bin/bash

docker compose exec  server /bin/bash -c "python manage.py makemigrations" && \
docker compose exec  server /bin/bash -c "python manage.py migrate" && \
docker compose exec server /bin/bash -c "python manage.py collectstatic"





