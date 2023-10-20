# Quick start guide

**Ovitrap monitor** is a web app to count mosquito eggs in pictures of ovitraps' wooden sticks.
It consists of three main parts: the counting algorithm, the database and the reports.
The counting algorithm is based on [OpenCV](https://github.com/opencv/opencv-python)
and [Numpy](https://numpy.org/) routines.
It will first identify the bounding box where the stick is, and then perform eggs identification
and counting via a sensitivity threshold that users can modify until they get an acceptable count.
Each count is saved in the database, which is then the source for the summary report.

### In a nutshell:

1. Create a user and password and login into the app.

![Login example](src/assets/img/login.png)

1. Go to **Settings** and upload a GeoJSON file with ovitrap locations and codes. This is how a GeoJSON file looks like:

```
        {
        "type": "FeatureCollection",
        "name": "ovis_cba_4326",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
        { "type": "Feature", "properties": { "id": "CE16" }, "geometry": { "type": "Point", "coordinates": [ -64.233792594323717, -31.382644735276333 ] } },
        { "type": "Feature", "properties": { "id": "NO12" }, "geometry": { "type": "Point", "coordinates": [ -64.217827642817312, -31.398976461490523 ] } }
        ]
        }
```

1. **Upload** ovitrap sticks pictures, one or optionally two per ovitrap station. Do not forget to add the ovitrap location code. It must coincide with the code in the GeoJSON file.

![Upload ovitrap picture](src/assets/img/upload.png)

![Upload ovitrap picture](src/assets/img/upload_more.png)

1. In the **Database** section you'll see all uploaded pictures by default. You can filter by location code, date or process status.

![Database section](src/assets/img/db.png)

1. Click over an unprocessed ovitrap record. Move the slide bar until you are happy with the count, and save. Do this for all records.

![Proceed to process](src/assets/img/click_process.png)

![Count and save](src/assets/img/count_and_save.png)

![Show processed pictures](src/assets/img/processed.png)

1. See summary stats, time series plot and maps under the **Report** section. Plots can be aggregated weekly or monthly and they can be downloaded. Data can also be downloaded.

![Report page](src/assets/img/report.png)

> **Important**: When taking ovitrap sticks pictures, make sure you have a contrasting but homogeneous background, and no shadows. If you are using a mobile phone, set the quality to fine. Good illumination conditions are a must and we advice to build a setting where the stick is in straight standing position.

For further information, see the [detailed manual and user guide](en_detailed_user_guide.md).

## Funding and app use

This tool has been developed under the European Comission
H2020 EXPOSURE project, grant number 734541. The project
consortium provides it as an open source for research and
use by health organisations. Deviation and exploitation
for commercial use are not allowed without the explicit
permission of the developers.