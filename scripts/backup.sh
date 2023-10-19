#!/bin/bash

source ../.env

PG_CONTAINER_NAME=$PG_CONTAINER_NAME
DB_NAME=$POSTGRES_DBNAME
DB_USER=$POSTGRES_USER
DB_PASSWORD=$POSTGRES_PASSWORD
BACKUP_DIR=$BACKUP_DIR
BACKUP_FILE="backup_$(date +%Y%m%d%H%M%S).dump"

# Comando pg_dump para crear el backup
docker exec -i $PG_CONTAINER_NAME pg_dump  -U $DB_USER  -F t $DB_NAME > $BACKUP_DIR/$BACKUP_FILE
echo "Se ha creado el backup: $BACKUP_DIR/$BACKUP_FILE"

