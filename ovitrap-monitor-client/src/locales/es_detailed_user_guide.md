---
title: "Ovitrap Monitor: Guía de uso detallada"
author: "Veronica Andreo y Charles Hamesse"
date: 2022-08-16
---

# Resumen

*Ovitrap Monitor* es una aplicación web de código abierto y fácil de usar
que permite contar huevos de mosquito a partir de fotos de ovitrampas
tomadas con camaras de teléfonos móviles (es decir, fotos de baja y media
resolución), y que genera índices, gráficos y mapas de manera automática.
*Ovitrap Monitor* puede utilizarse en todos los sistemas operativos y
dispositivos con acceso a Internet.
Los usuarios que se registren, pueden subir sus fotos y los datos de
localización de las ovitrampas, y una vez que procesan las fotos, es
decir, realizan el recuento de huevos de mosquito, los registros se
guardan en una base de datos electrónica a partir de la cual se
construyen gráficos y mapas de manera automática.

El algoritmo de conteo (back-end) está escrito en Python y se basa
en rutinas de [OpenCV](https://github.com/opencv/opencv-python) y
[Numpy](https://numpy.org/). Consta de dos partes principales:

- el aislamiento de las paletas de la ovitrampa dentro de la imagen, y
- la identificación y el recuento de los huevos.

La parte de aislamiento de las paletas implica una conversión del
espacio de color, la detección de bordes de Canny y una operación de cierre
morfológico, estimación del umbral y el cálculo de la caja delimitadora para extraer el
área que se utilizará posteriormente. Una vez que la imagen sólo presenta la
paleta, comienza la segunda parte, es decir, la identificación
y el recuento de los huevos. Se calculan automáticamente tres parámetros en
función del ancho de la imagen: el área mínima de los huevos, el área
máxima de los huevos y el área máxima de las agrupaciones de huevos.
Por último, el algoritmo requiere que el usuario introduzca un valor de
umbral que se utilizará para separar los huevos del resto de la paleta en
función de su oscuridad. Después de algunas comprobaciones intermedias, para
cada candidato a huevo único retenido, el contador se incrementa en uno y
para cada candidato a agrupación retenido, el algoritmo estima el número de huevos
dividiendo su área por el área media de los huevos únicos e incrementa el
contador en consecuencia.

Como el algoritmo y la aplicación se desarrollaron en el contexto de un sistema
de vigilancia operativa, suponemos que la entrada de datos es semanal (es decir,
la fecha asignada a cada imagen cargada es la del lunes anterior).
Además, nuestro algoritmo de recuento se probó principalmente con paletas de
madera, especialmente depresores de lengua, ya que éste es el sustrato de puesta
de huevos utilizado por las autoridades del Ministerio de Salud de la provincia
de Córdoba en Argentina, con las que colaboramos.

Esta herramienta ha sido desarrollada en el marco del proyecto H2020
[EXPOSURE](http://www.h2020-eoxposure.eu/)
de la Comisión Europea, con el número de subvención 734541. El consorcio del
proyecto la ofrece como software libre y de código abierto para la investigación
y el uso por parte de las organizaciones sanitarias. El uso comercial no está
permitido sin la autorización explícita de sus desarrolladores.

# Usando la aplicación *Ovitrap Monitor*

## Registro/Inicio de sesión

*Ovitrap Monitor* requiere que los usuarios creen su cuenta para poder
utilizar la aplicación, ya que la base de datos y el almacenamiento de
imágenes funciona por usuario.
Una vez que el usuario se ha registrado, tiene que iniciar sesión con
su nombre de usuario y contraseña para acceder a todas las funcionalidades
de la aplicación.

## Cargar ubicaciones de las ovitrampas

Si los usuarios están interesados en obtener representaciones cartográficas
de sus datos, deben subir un archivo `GeoJSON` con el código de localización
y las coordenadas de ovitrap. Los códigos de este archivo se se utilizarán
para hacer coincidir los códigos de las imágenes de ovitrap y se unirán con
los recuentos de cada paso de tiempo. Para cargar las localizaciones de
ovitrap vaya a "Settings". El archivo `GeoJSON` debe tener la siguiente forma:

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

y las coordenadas deben estar en EPSG:4326.

## Cargar imágenes de las ovitrampas

Los usuarios pueden subir una u, opcionalmente, dos imágenes
(frontal y trasera) por estación de ovitrampas (Figura \ref{fig:upload}). Es importante
que no olviden añadir o seleccionar en el menú desplegable el
código de ubicación de ovitrap código de localización. Esto
asegurará una correcta unión de los recuentos realizados
posteriormente con los registros anteriores de la base de datos.

![Cargar una fotografía\label{fig:upload}](src/assets/img/upload_es.png){ width=75% }

## Procesar las imágenes de las ovitrampas

Una vez que el usuario haya completado la carga de imágenes de
ovitrampas positivas, encontrará todas en la sección
**Base de datos**. Allí, los usuarios pueden filtrar y ordenar
los registros por código de localización, fecha o estado del
proceso (es decir, procesado o no). Para procesar cada imagen
de ovitrampas, basta con hacer clic sobre un registro de la base
de datos y se abrirá la ventana de la interfaz de recuento con
un umbral. se abrirá la ventana de la interfaz de recuento con un
valor de umbral establecido por defecto. Los usuarios Los usuarios
pueden acercarse y alejarse, actualizar el cuadro delimitador y
mover el control deslizante hasta que estén satisfechos con el
recuento de huevos obtenido (Figura \ref{fig:count}).
Además, pueden editar directamente
el recuento si por alguna razón, normalmente por una paleta con
manchas, bajo contraste o presencia de residuos, cualquiera de
las opciones anteriores proporciona un recuento de huevos
aceptable. Una vez satisfechos con el recuento obtenido,
los usuarios deben guardar el recuento y proceder al siguiente
registro.

![Ventana de conteo\label{fig:count}](src/assets/img/count_and_save_es.png){ width=75% }

## Visualizar los reportes automáticos

Una vez completado el recuento de todas las ovitrampas de una fecha
determinada, los usuarios obtendrán algunas estadísticas básicas,
gráficos y mapas automáticamente. La aplicación calcula la tasa de
ovitrampas positivas, el número medio de huevos y la tasa de cambio
con respecto con respecto a la semana anterior (Figura \ref{fig:report}).
El gráfico de la serie
temporal muestra el número medio de huevos por semana delimitado por
los percentiles 10 y 90. La serie temporal se muestra por defecto
con pasos de tiempo semanales, pero también puede agregarse y mostrarse
mensualmente. Los usuarios pueden descargar los gráficos semanales o
mensuales y un archivo csv con los datos, es decir, el código ovitrap,
la fecha y los recuentos.Además, si el usuario uloaded el Además, si el
usuario carga el archivo `GeoJSON` con las ubicaciones de las ovitrampas,
obtendrá dos mapas interactivos interactivos: uno con los recuentos de
ovitrampas representados por el tamaño de los símbolos y el segundo
representando el cambio en los recuentos de huevos con respecto a la
semana anterior. Los puntos azules mostrarán las localizaciones donde los
recuentos de huevos disminuyeron y los puntos rojos, las localizaciones
donde los recuentos de huevos aumentaron.

![Sección de Reportes\label{fig:report}](src/assets/img/report_es.png){ width=75% }

# Recomendaciones para mejorar los resultados

## Calidad de las imágenes

Los usuarios deben ajustar las cámaras de sus teléfonos móviles a
calidad fina a fin de obtener la mejor resolución posible. Esto es muy
importante, ya que el tamaño de los huevos depende de la resolución
de la imagen.

## Condiciones de fondo y luz

Cuando se toman fotos de las paletas de las ovitrampas, se debe buscar
un fondo con buen contraste y homogéneo. Asimismo, es recomendable evitar
las sombras en las fotografías.
Las buenas condiciones de iluminación son imprescindibles y se aconseja
construir algún dispositivo para que la paleta esté en posición vertical.
También se recomienda utilizar un trípode para colocar el teléfono y
así evitar que las fotos salgan borrosas.

## Edición de los recuentos

Si después de varios ensayos y errores, la persona no está satisfecha con
el recuento obtenido, siempre se puede editar el número estimado (Figura \ref{fig:edit}).
Para ello, basta sólo hacer clic sobre el recuento e insertar el número editado.

![Edición de conteos\label{fig:edit}](src/assets/img/edit_count_es.png){ width=75% }

## Añadir ovitrampas negativas a la base de datos

No es necesario tomar fotos a las ovitrampas negativas (es decir, ovitrampas
sin huevos) para incluir el registro en la base de datos. En su lugar, basta
con añadir el código de la ovitrampas y el recuento (cero) en la sección de
carga (Figura \ref{fig:zero}). Este registro se almacenará entonces con los
demás en la base de datos.

![Añadir registros con conteo cero\label{fig:zero}](src/assets/img/count_zero_es.png){ width=75% }

# Sobre el almacenamiento de datos

Las imágenes subidas por los usuarios se almacenan en un *AWS S3 bucket*.
Actualmente no hay límite para el almacenamiento de imágenes. Sin embargo,
los usuarios deben ser conscientes de que esto puede cambiar en el futuro
si la política de Amazon cambia. Por lo tanto, si se desea mantener copias
de las fotos de las ovitrampas, se recomienda hacer copias de seguridad
periódicas.

Por otro lado, todos los metadatos y el recuento de huevos se almacenan
en una base de datos SQL gratuita de Heroku. Todos los datos se almacenan
juntos, pero los usuarios sólo pueden ver y modificar los datos propios.
El límite de esta base de datos es una cantidad total de 10000 filas.
Una vez más, se alienta a los usuarios a hacer copias de seguridad
de sus datos, es decir, a descargar los registros de vez en cuando.

# Enlaces al código fuente y los datos de muestra

- Aplicación web (Fron-end): <https://gitlab.com/charles.hamesse/ovitrap-monitor-client>
- Algoritmo de recuento de huevos (Back-end): <https://gitlab.com/charles.hamesse/ovitrap-monitor-server>
- Conjunto de datos de muestra (300 imágenes de ovitrampas y recuentos observados): <https://zenodo.org/record/6962536>

Para informar errores, por favor contáctenos a través del sistema de
seguimiento de problemas dentro de los repositorios
o vía correo electrónico a: <Charles.Hamesse@ugent.be> y
<veroandreo@gmail.com>.
