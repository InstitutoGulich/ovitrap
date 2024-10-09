## Ovitrap Monitor


# Overview

Ovitrap Monitor is a web application to process ovitrap stick pictures, count eggs and visualize overviews of mosquito activity with plots and maps. It also offers the possibility to download data.

There is a free instance of the application currently running at: https://ovitrap-monitor.gulich.unc.edu.ar/ (needs registration). Further details about the algorithm and the functioning of the application can be found in Hamese et al (2023), a scientific paper published in Ecological Informatics and the user guide within the application. 

The Ovitrap Monitor application is composed of a backend and a frontend. The back-end runs server-side and it is developed using Python and the Django framework. It connects to AWS S3 to store and retrieve the ovitrap pictures and it uses a PostgreSQL/Postgis local database to register and retrieve the result of  processing pictures. The front-end connects to an API and it is developed with the Vue.js framework. 

# What's in this repo?

This repository is the result of dockerizing the whole system, which consists of the frontend, the backend, a database and uses S3 on AWS to store the pictures. The original code has not been modified except for the API access endpoints which now include the prefix "api" (i.e. /api/records and /api/stations).

Two database recovery and database backup scripts (scripts folder) have been added to the original development, along with the WSGI Gunicorn server and a reverse proxy with NGINX to run the system in production.

In the ovitrap-monitor-client/nginx/nginx/nginx.conf file, you can customize the necessary parameters, such as setting security for access to the Django admin. In the file docker-compose.yml you can configure parameters for Gunicorn. Furthermore, if you want to run your own instance, you'll need to get your own AWS S3 bucket.

## Install steps

# Clone this repository

The stable version of the system is in the main branch. The stable version but in development (about to migrate to main), in develop. 
Any other version in development you will find it in a branch with its version.

```
git clone https://github.com/InstitutoGulich/ovitrap/tree/main
```

#Set parameters for your system
```
cp env_template .env
nano .env
```

#Set parameters for the client
```
cp ~/ovitrap/ovitrap-monitor-client/env_template ~/ovitrap/ovitrap-monitor-client/.env
nano ~/ovitrap/ovitrap-monitor-client/.env
```

#Deploy system
```
docker compose up -d --build
```

#Generate the database structure
```
bash scripts/run_migration.sh
```

# Change password for admin and other users
See instructions in scripts/change_admin_passwd.txt

## (Optional) Restore an existing database
If you already have a database and you are migrating or reinstalling the system, you could use the `scripts/restore_db.sh` script. Edit what you need such as the path 
to the db backup file, among others.

#Edit as needed
```
nano scripts/restore_db.sh
```

# Run the restore
```
bash scripts/restore_db.sh
```

# Restart the system
```
docker compose restart
```

## Sample data set
A sample of 300 pictures and the observed counts are provided as open data for testing purposes at: https://doi.org/10.5281/zenodo.6962536.

## Funding info and license
This tool has been developed under the European Commission H2020 EXPOSURE project, grant number 734541. The project consortium provides it as an open source for research and use by health organizations. Deviation and exploitation for commercial use are not allowed without the explicit permission of the developers.
