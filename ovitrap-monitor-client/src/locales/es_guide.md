# Guía de inicio rápido

**Ovitrap monitor** es una aplicación web para contar huevos de mosquito en fotografías de ovitrampas,
específicamente aquellas que usan paletas de madera o depresores linguales como sustrato.
Consta de tres partes principales: el algoritmo de conteo, la base de datos y los reportes automáticos.
El algoritmo de recuento se basa en rutinas de [OpenCV](https://github.com/opencv/opencv-python)
y [Numpy](https://numpy.org/).
En primer lugar, identificará el cuadro delimitador en el que se encuentra la paleta y, a continuación,
realizará la identificación de los huevos y el recuento mediante un umbral de sensibilidad que se puede modificar
hasta obtener un recuento aceptable.
Cada recuento se guarda en la base de datos, que es luego la fuente para la generación de los reportes.

### Procedimiento en pocas palabras:

1. Cree un usuario y una contraseña y acceda a la aplicación.

![Ejemplo login](src/assets/img/login_es.png)

1. Vaya a **Configuración** y cargue un archivo GeoJSON con las ubicaciones geográficas y códigos de las ovitrampas.


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

1. **Suba** las fotos de las paletas, una u opcionalmente dos por estación. No olvide añadir el código de la ovitrampa. Éste debe coincidir con el código que aparece en el archivo GeoJSON.

![Subir fotografía](src/assets/img/upload_es.png)

![Subir mas fotografías](src/assets/img/upload_more_es.png)

1. En la sección **Base de datos** verá todas las imágenes subidas. Puede filtrar por código, fecha o estado de la fotografia (procesada/no procesada).

![Sección base de datos](src/assets/img/db_es.png)

1. Haga clic sobre una fotografía no procesada. Mueva la barra de deslizamiento hasta que esté satisfecho con el recuento, y guarde. Haga esto para todas las imágenes.

![Comenzar a procesar](src/assets/img/click_process_es.png)

![Contar y guardar](src/assets/img/count_and_save_es.png)

![Fotografías procesadas](src/assets/img/processed_es.png)

1. Vea las estadísticas de resumen, el gráfico de la serie temporal y los mapas en la sección **Reporte**. Los gráficos pueden ser agregados semanal o mensualmente y pueden ser descargados. Los datos también pueden descargarse.

![Sección de Reportes](src/assets/img/report_es.png)

> **Importante**: Al hacer las fotos de las paletas de ovitrampas, asegúrese de tener un fondo en contraste pero homogéneo, y sin sombras. Si utiliza un teléfono móvil, ajuste la calidad a fina. Las buenas condiciones de iluminación son imprescindibles y aconsejamos construir un montaje en el que la paleta esté en posición vertical y recta.

Para más información, consulte el [manual detallado y guía del usuario](es_detailed_user_guide.md).

## Financiamiento y condiciones de uso

Esta herramienta ha sido desarrollada en el marco del proyecto H2020 EXPOSURE de la Comisión Europea,
con el número de subvención 734541. El consorcio del proyecto la ofrece como software libre y de
código abierto para la investigación y el uso por parte de las organizaciones sanitarias.
Su uso comercial no está permitido sin el permiso explícito de los desarrolladores.