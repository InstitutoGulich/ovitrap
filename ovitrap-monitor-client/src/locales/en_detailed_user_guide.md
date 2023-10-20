---
title: "Ovitrap Monitor detailed user guide"
author: "Veronica Andreo and Charles Hamesse"
date: 2022-08-16
---

# Overview

*Ovitrap Monitor* is an open source, user-friendly web application
that allows to count mosquito eggs from low-medium resolution
mobile phones pictures and generates automatic indices, plots and maps.
It can be used in all operating systems and devices with internet access.
Users can register, upload pictures and ovitrap location data,
and once they process the pictures, i.e., perform the mosquito egg counting,
the records are saved in an electronic database from where automated
time series plots and maps are built.

The counting algorithm (back-end) is written in Python and it is
based on [OpenCV](https://github.com/opencv/opencv-python) and
[Numpy](https://numpy.org/) routines. It consists of two main parts:

- ovitrap stick isolation within the picture, and
- eggs' identification and counting.

The ovitrap stick isolation part involves color space conversion,
Canny edge detection and morphological closing operation,
thresholding and bounding box computation to extract the area
to be further used only.
Once the picture only features the ovitrap stick, the second
part, i.e., eggs identification and counting starts.
Three parameters are computed automatically based on the
image width: the minimum egg area, maximum egg area and maximum
cluster area. Finally, the algorithm requires the user to input
a threshold value that will be used to separate the eggs from
the rest of the stick based on their darkness. After some
intermediate checks, for each retained single egg candidate,
the counter is incremented by one and for each retained cluster
candidate, the algorithm estimates the number of eggs by dividing
its area by the average single egg area and increment the counter
accordingly.

As the algorithm and application was developed in the context
of an operational surveillance system, we assume weekly data
input (i.e., the date assigned to each uploaded picture is that of
the previous Monday). Furthermore, our counting algorithm was
mostly tested with wooden sticks, especially tongue depressors,
as this is the egg laying substrate used by the Health Ministry
authorities from Cordoba province in Argentina, whom we
collaborated with.

This tool has been developed under the European Commission
H2020 [EXPOSURE](http://www.h2020-eoxposure.eu/) project,
grant number 734541.
The project consortium provides it as open source software for
research and use by health organisations.
Commercial use is not allowed without the explicit permission
of the developers.

# Using the *Ovitrap Monitor* app

## Register/Log in

*Ovitrap Monitor* requires users to create their account to be able to use the application,
as the database and storage of pictures works on a per-user basis.
Once the user is registered, they need to log in with their username and password to access
all of the application's functionalities.

## Upload ovitrap locations

If users are interested in getting map representations of their data, they should upload
a `GeoJSON` file with ovitrap's location code and coordinates. The codes in this file will
then be used to match ovitrap pictures codes and join with the counts for each time step.
To upload ovitrap locations go to "Settings". The `GeoJSON` file should be of the following
form:

~~~~~~~ {.json}
{
  "type": "FeatureCollection",
  "name": "ovitraps_locations_epsg_4326",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": { "id": "CE16" },
      "geometry": {
        "type": "Point",
        "coordinates": [ -64.233792594323717, -31.382644735276333 ]
      }
    },
    {
      "type": "Feature",
      "properties": { "id": "NO12" },
      "geometry": {
        "type": "Point",
        "coordinates": [ -64.217827642817312, -31.398976461490523 ]
      }
    }
  ]
}
~~~~~~~

and coordinates should be in EPSG:4326.

## Upload ovitrap pictures

Users can upload one or optionally two (front and back) pictures per ovitrap station
(Figure \ref{fig:upload}).
Importantly, they must not forget to add or select from the dropdown menu, the ovitrap
location code. This will ensure a proper join of the counts performed afterwards with
old records in the database.

![Upload a picture\label{fig:upload}](src/assets/img/upload.png){ width=75% }

## Process the ovitrap pictures

Once the user completed the upload of positive ovitrap pictures, they will find all of
them under the **Database** section. There, users are able to filter and sort records
by location code, date or process status (i.e., processed or not).
To process each ovitrap picture just click over a record in the database and the
counting interface window will open with a threshold value set by default. Users
can zoom in and out, update the bounding box and move the slider until they are
happy with the egg count obtained (Figure \ref{fig:count}).
Furthermore, they can directly edit the count
by inputing a corrected value, if for some reason, usually stained stick, low
contrast or debris, any of the above options does not provide an acceptable egg count.
Once happy with the count obtained, users should save the count and proceed with
the next record. The database will be updated accordingly.

![Count window\label{fig:count}](src/assets/img/count_and_save.png){ width=75% }

## See the automatic report

Once the counting is complete for all ovitraps of a certain date, users will get
some basic stats, plots and maps automatically. The application computes the
positive ovitrap rate, the mean number of eggs and the change rate with respect
to the previous week (Figure \ref{fig:report}).
The time series plot shows the mean number of eggs per week
bounded by the 10th and 90th percentile. The time series is displayed by default
with weekly time steps, but it can also be aggregated and displayed monthly.
Users can download both the weekly or monthly plots and csv files with the data,
i.e., ovitrap code, date and counts. Furthermore, if the user uploaded the
`GeoJSON` file with the ovitrap locations, they will get two interactive maps
displayed: one with the ovitrap counts represented by the size of the symbols and
the second representing the change in egg counts regarding the previous week.
Blue dots will show locations where the egg counts decreased and red dots, locations
where egg counts increased.

![Report section\label{fig:report}](src/assets/img/report.png){ width=75% }

# Recommendations for better results

## Camera quality

Users should set the quality of their mobile phone cameras to **fine** in order
to get the best possible resolution. This is very important as the size of eggs is
dependant on image size.

## Background and light conditions

When taking ovitrap sticks pictures, users should search for a contrasting
but homogeneous background, and no shadows. Good illumination conditions are a
must and we advice to build a setting where the stick is in straight standing
position. It's also recommended to use a tripod to hold the phone and avoid
getting blurry pictures.

## Editing counts

If after several trials and errors, the user is not happy with the egg count
obtained, they can always edit the count to the estimated number themselves
(Figure \ref{fig:edit}). They just need to click over the count to be able to edit it.

![Edit counts\label{fig:edit}](src/assets/img/edit_count.png){ width=75% }

## Adding negative ovitraps to the database

Users do not need to take pictures of negative ovitraps (i.e., ovitraps with
no eggs). Instead, to keep track of all ovitraps in the surveillance, they
can just add the ovitrap code and (zero) count under the upload section
(Figure \ref{fig:zero}). This record will then be stored with the others
in the database.

![Add records with zero eggs\label{fig:zero}](src/assets/img/count_zero.png){ width=75% }

# A note on data storage

Ovitrap pictures uploaded by users are stored on an AWS S3 bucket.
There's currently no limit for the picture storage. However, users
should be aware that this can change in the future if Amazon policy
changes. Therefore, if users want to keep copies of the ovitrap pics,
they are recommended to do regular back-ups.

All metadata and egg counts on the other hand, are stored in a
free Heroku SQL database. All data is stored together, but
users can only see and modify data of their own. The limit
of this database is a total amount of 10000 rows. Again, users
are encouraged to back up their data, i.e. download the records
from time to time.

# Links to the source code and sample data set

- Web application (Fron-end): <https://gitlab.com/charles.hamesse/ovitrap-monitor-client>
- Egg counting algorithm (Back-end): <https://gitlab.com/charles.hamesse/ovitrap-monitor-server>
- Sample data set (300 ovitrap pictures and observed counts): <https://zenodo.org/record/6962536>

If you want to report bugs or errors, please contact us
via the issue tracking system within the repositories,
or via email at: <Charles.Hamesse@ugent.be> and
<veroandreo@gmail.com>.