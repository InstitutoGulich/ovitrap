<template>
  <v-container>
    <v-row >
      <v-col class="mb-4">
        <!-- es version -->
        <div v-if='currentLanguage == "es"'>
<h1>Guía de inicio rápido</h1>
<p><strong>Ovitrap monitor</strong> es una aplicación web para contar huevos de mosquito en fotografías de ovitrampas,
específicamente aquellas que usan paletas de madera o depresores linguales como sustrato.
Consta de tres partes principales: el algoritmo de conteo, la base de datos y los reportes automáticos.
El algoritmo de recuento se basa en rutinas de <a href="https://github.com/opencv/opencv-python">OpenCV</a>
y <a href="https://numpy.org/">NumPy</a>.
En primer lugar, identificará el cuadro delimitador en el que se encuentra la paleta y, a continuación,
realizará la identificación de los huevos y el recuento mediante un umbral de sensibilidad que se puede modificar
hasta obtener un recuento aceptable.
Cada recuento se guarda en la base de datos, que es luego la fuente para la generación de los reportes.
Vea tambien el <strong><a href="/src/locales/es_detailed_user_guide.pdf">manual detallado y guía del usuario</a></strong>.</p>

<h2>Procedimiento en pocas palabras:</h2>
<p>1. Cree un usuario y una contraseña y acceda a la aplicación.</p>
<v-img :src="imageLogin" alt="Log in" width="50%"  class="mx-auto"  />

<p>2. Vaya a <strong>Configuración</strong> y cargue un archivo GeoJSON con las ubicaciones geográficas y códigos de las ovitrampas.</p>
<code><pre>
{
  "type": "FeatureCollection",
  "name": "ovis_cba_4326",
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
</pre></code>

<p>3. <strong>Suba</strong> las fotos de las paletas, una u opcionalmente dos por ubicación. No olvide añadir o seleccionar del menú desplegable el código de la ovitrampa. Éste debe coincidir con el código que aparece en el archivo GeoJSON.</p>
<v-img :src="imageUploadEs" alt="Subir una fotografía"  width="50%"  class="mx-auto"  />
<p> Para agregar un nuevo registro, es decir, la/s fotografía/s de la siguiente ubicación, solo haga click en <i>Añadir registro:</i></p>
<v-img :src="imageUploadMoreEs" alt="Subir mas fotografías"  width="50%"  class="mx-auto"  />

<p>4. En la sección <strong>Base de datos</strong> verá todas las imágenes que han sido subidas.
Puede filtrar por código, fecha o estado de la fotografía (procesada/no procesada).
También es posible ordenar los registros en función de esos parámetros.</p>
<v-img :src="imageDBEs" alt="Sección base de datos"   width="50%"  class="mx-auto" />

<p>5. Para comenzar con el conteo, haga clic sobre una fotografía no procesada.</p>
<v-img :src="imageClickProcessEs" alt="Comenzar a procesar"  width="50%"  class="mx-auto" />
<p>La ventana de conteo con la paleta seleccionada aparecerá.
Mueva la barra de deslizamiento hasta que esté satisfecho con el recuento,
y guarde el registro. Haga esto para todas las imágenes.</p>
<v-img :src="imageCountAndSaveEs" alt="Contar y guardar" width="50%"  class="mx-auto" />
<p>Cada vez que guarde un registro, la base de datos se actualiza:</p>
<v-img :src="imageProcessedEs" alt="Fotografías procesadas"  width="50%"  class="mx-auto"  />

<p>6. Vea las estadísticas de resumen, el gráfico de la serie temporal y los mapas en la sección
<strong>Reporte</strong>. Los gráficos pueden ser agregados semanal o mensualmente y pueden
ser descargados. Los datos también pueden descargarse en formato csv.</p>
<v-img :src="imageReportEs" alt="Sección de Reportes"  width="70%"  class="mx-auto"  />
<br/>
<br/>
<strong>Importante</strong>: Al tomar las fotos de las paletas de ovitrampas, asegúrese de tener
un fondo en contraste pero homogéneo, y sin sombras. Si utiliza un teléfono móvil, ajuste la
calidad a fina. Las buenas condiciones de iluminación son imprescindibles y aconsejamos construir
un soporte sencillo en el que la paleta esté en posición vertical y recta.
Para más información, consulte el <a href="/src/locales/es_detailed_user_guide.pdf">manual detallado y guía del usuario</a>.

<h2>Financiamiento y condiciones de uso</h2>
<p>Esta herramienta ha sido desarrollada en el marco del proyecto H2020 <a href="http://www.h2020-eoxposure.eu/">EOXPOSURE</a> de la Comisión Europea,
con el número de subvención 734541. El consorcio del proyecto la ofrece como software libre y de
código abierto para la investigación y el uso por parte de las organizaciones sanitarias.
Su uso comercial no está permitido sin el permiso explícito de los desarrolladores.</p>
        
        </div>
        <!-- en version -->
        <div v-if='currentLanguage == "en"'>
<h1>Quick start guide</h1>
<p><strong>Ovitrap monitor</strong> is a web app to count mosquito eggs in pictures of ovitraps' wooden sticks.
It consists of three main parts: the counting algorithm, the database and the reports.
The counting algorithm is based on <a href="https://github.com/opencv/opencv-python">OpenCV</a>
and <a href="https://numpy.org/">NumPy</a> routines.
It will first identify the bounding box where the stick is, and then perform eggs identification
and counting via a sensitivity threshold that users can modify until they get an acceptable count.
Each count is saved in the database, which is then the source for the summary report.
See also the <strong><a href="src/locales/en_detailed_user_guide.pdf">detailed manual and user guide</a></strong>.</p>

<h2>In a nutshell:</h2>
<p>1. Create a user and password and login into the app.</p>
<v-img :src="imageLogin" alt="Log in" width="50%"  class="mx-auto"  />

<p>2. Go to <strong>Settings</strong> and upload a GeoJSON file with ovitrap locations and codes. This is how a GeoJSON file looks like:</p>
<code><pre>
{
  "type": "FeatureCollection",
  "name": "ovis_cba_4326",
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
</pre></code>

<p>3. <strong>Upload</strong> ovitrap sticks pictures, one or optionally two per ovitrap station. Do not forget to add the ovitrap location code or select it from the dropdown menu. It must coincide with the code in the GeoJSON file.</p>
<v-img :src="imageUpload" alt="Upload ovitrap picture"  width="45%"  class="mx-auto"  />
<p>To upload a new picture just click over <i>Add record</i>:</p>
<v-img :src="imageUploadMore" alt="Upload ovitrap picture"  width="45%"  class="mx-auto"  />

<p>4. In the <strong>Database</strong>  section you'll see all uploaded pictures by default. You can filter by location code, date or process status. It is also possible to sort the records.</p>
<v-img :src="imageDB" alt="Database section"   width="50%"  class="mx-auto" />

<p>5. To start performing the counting, click over an unprocessed ovitrap record. </p>
<v-img :src="imageClickProcess" alt="Proceed to process"  width="50%"  class="mx-auto" />
<p>The counting dialog with the selected ovitrap picture will appear. Move the slide bar until you are happy with the count, and save. Do this for all records.</p>
<v-img :src="imageCountAndSave" alt="Count and save" width="50%"  class="mx-auto" />
<p>Every time you save the count for a record, the database is updated:</p>
<v-img :src="imageProcessed" alt="Show processed pictures"  width="50%"  class="mx-auto"  />

<p>6. Finally, see the summary stats, time series plot and maps under the <strong>Report</strong> section.
Plots can be aggregated weekly or monthly and they can be downloaded.
Data can also be downloaded as csv files.</p>
<v-img :src="imageReport" alt="Report page"  width="70%"  class="mx-auto"  />
<br/>
<br/>
<strong>Important</strong>: When taking ovitrap sticks pictures, make sure you have a contrasting but homogeneous background, and no shadows. If you are using a mobile phone, set the quality to fine. Good illumination conditions are a must and we advice to build a setting where the stick is in straight standing position.
For further information, see the <a href="src/locales/en_detailed_user_guide.pdf">detailed manual and user guide</a>.

<h2>Funding and app use</h2>
<p>This tool has been developed under the European Commission
H2020 <a href="http://www.h2020-eoxposure.eu/">EOXPOSURE</a> project, grant number 734541. The project
consortium provides it as an open source for research and
use by health organisations. Deviation and exploitation
for commercial use are not allowed without the explicit
permission of the developers.</p>
        
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import guideEn from '@/locales/en_guide.md'
import guideEs from '@/locales/es_guide.md'

import imageLogin from '@/assets/img/login.png'
import imageUpload from '@/assets/img/upload.png'
import imageUploadMore from '@/assets/img/upload_more.png'
import imageDB from '@/assets/img/db.png'
import imageClickProcess from '@/assets/img/click_process.png'
import imageCountAndSave from '@/assets/img/count_and_save.png'
import imageProcessed from '@/assets/img/processed.png'
import imageReport from '@/assets/img/report.png'

import imageLoginEs from '@/assets/img/login_es.png'
import imageUploadEs from '@/assets/img/upload_es.png'
import imageUploadMoreEs from '@/assets/img/upload_more_es.png'
import imageDBEs from '@/assets/img/db_es.png'
import imageClickProcessEs from '@/assets/img/click_process_es.png'
import imageCountAndSaveEs from '@/assets/img/count_and_save_es.png'
import imageProcessedEs from '@/assets/img/processed_es.png'
import imageReportEs from '@/assets/img/report_es.png'

import store from '../store'


export default {
  name: 'HomeGuide',

  components: {
  },
  data: () => ({
      username: store.state.user.username,
      imageLogin: imageLogin,
      imageUpload: imageUpload,
      imageUploadMore: imageUploadMore,
      imageDB: imageDB,
      imageClickProcess: imageClickProcess,
      imageCountAndSave: imageCountAndSave,
      imageProcessed: imageProcessed,
      imageReport: imageReport,

      imageLoginEs: imageLoginEs,
      imageUploadEs: imageUploadEs,
      imageUploadMoreEs: imageUploadMoreEs,
      imageDBEs: imageDBEs,
      imageClickProcessEs: imageClickProcessEs,
      imageCountAndSaveEs: imageCountAndSaveEs,
      imageProcessedEs: imageProcessedEs,
      imageReportEs: imageReportEs,

  }),
  computed: {
    currentLanguage: function() {
      return this.$i18n.locale
    },
    source: function() {
      if(this.$i18n.locale == "es") 
        return guideEs
      return guideEn 
    }
  }
}
</script>
<style scoped>
h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>