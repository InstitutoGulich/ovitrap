#!/bin/bash

# Variables
source ../.env

PG_CONTAINER_NAME=$PG_CONTAINER_NAME
DB_NAME=$POSTGRES_DBNAME
DB_USER=$POSTGRES_USER
DB_PASSWORD=$POSTGRES_PASSWORD
BACKUP_FILE="../database/backup/db.dump"

# Restore database
docker exec -i $PG_CONTAINER_NAME pg_restore -U $DB_USER -d $DB_NAME -c < $BACKUP_FILE
echo "Restored database: $BACKUP_FILE"