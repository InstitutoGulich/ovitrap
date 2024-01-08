# Ovitrap Monitor

Ovitrap Monitor is a web application to process ovitrap stick pictures, count eggs and visualize overviews of mosquito activity.
This repo holds the code for the application's back-end and front-end. It is developed using Python, Django framework, Vue.js and PostgreSQL/Postgis . It connects to AWS S3 to store, retrieves and processes ovitrap pictures.

This repository is the result of dockerizing the full system, which is composed of the [front-end](https://gitlab.com/charles.hamesse/ovitrap-monitor-client) and [back-end](https://gitlab.com/charles.hamesse/ovitrap-monitor-server), the database and keep the connection to AWS for storage in S3. 

The original code has not been modified, except the endpoints which now includes the "api" prefix (i.e /api/records).

Two scripts are added to restore the database and backup the database (scripts folder).

Finally, WSGI Gunicorn server added to run the system in production.

## Install

```bash
    #copy and setting parameters in .env
    cp env_template .env 
    # up system
    docker compose up -d --build    
```

## Initialization db (if you have an backup)

```bash
    # make migrations
    bash scripts/run_migration.sh
    # edit scripts/restore_db.sh and set parameters
    nano scripts/restore_db.sh
    # run process
    bash scripts/restore_db.sh
    docker compose restart
```

## Change password admin
```
You can see the instructions in file: scripts/change_admin_passwd.txt
```

## make a backup of database
```bash
    # edit scripts/backup.sh and set parameters
    nano scripts/backup.sh
    # run process
    cd scritps
    bash backup.sh
    #(getting the backup in ./database/backup)
```

## Authors

Pablo Zader
Jorge Rubio
Veronica Andreo

CONAE - IG 



