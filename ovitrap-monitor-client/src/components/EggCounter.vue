<template>
  <div class="egg-counter-container mb-5" ref="container">
    <cropper
      class="cropper"
      ref="cropper"
      :src="s3_url + imgUrl"
      @change="handleCropperChange"
    />

    <svg ref="overlay" class="egg-counter-overlay-svg">
      <path
        v-for="(path, index) in this.eggPaths"
        v-bind:key="index"
        style="stroke: red"
        fill-opacity="0%"
        :d="path"
      />
    </svg>
  </div>
  <v-row>
    <v-col class="md-6">
      <p class="font-weight-light">
        <strong> {{ $t('threshold') }}:</strong>&nbsp;{{ this.threshold }}
      </p>
      <v-slider
        v-model="threshold"
        :min="0"
        :max="150"
        :step="1"
        thumb-label
        hide-details
      ></v-slider>
    </v-col>
    <v-col class="md-6">
      <p class="font-weight-light">
        <v-text-field
            :label="$t('eggs')"
            placeholder="Enter manual count"
            variant="filled"
            hide-details=""
            v-model="this.resultingCount"
          ></v-text-field>
      </p>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import store from "../store";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "EggCounter",
  props: {
    imgUrl: String,
    eggCount: Number,
  },
  components: {
    Cropper,
  },
  data: function () {
    return {
      threshold: 64,
      s3_url: store.state.settings.s3_url,
      threshDebounce: null,
      results: null,
      resultingCount: null,
      pictureRealHeight: null,
      pictureClientHeight: null,
      eggPaths: [],
      bbox: [],
      visibleArea: null,
      coordinates: null,
    };
  },
  watch: {
    threshold: function () {
      clearTimeout(this.threshDebounce);
      this.threshDebounce = setTimeout(() => {
        this.processPictureNewThreshold();
      }, 300);
    },
    resultingCount: function() {
      this.$emit("update:eggCount", this.resultingCount);
    }
  },
  mounted: async function () {
    // call backend processing to load pic and get bbox
    const res_proc_load = await axios.get(
      store.state.settings.backend_url + "/load_pic?pic_url=" + this.imgUrl
    );
    if (res_proc_load.status != 200) return false;
    const size = res_proc_load.data.size;
    this.pictureRealHeight = size[0];
    this.pictureRealWidth = size[1];

    this.bbox = res_proc_load.data.coords; // (x,y,w,h)
    this.$refs.cropper.setCoordinates({
      left: this.bbox[0],
      top: this.bbox[1],
      width: this.bbox[2],
      height: this.bbox[3],
    });

    // now, get first count with arbitrary threshold
    this.processPictureNewThreshold();
  },
  methods: {
    handleCropperChange: async function() {
			// coordinates contains the { width, height, top, left} of the area selected 
			// visibleArea contains the { width, height, top, left} of the area displayed on canvas
      const { visibleArea, coordinates } = this.$refs.cropper.getResult();
      this.visibleArea = visibleArea
      this.coordinates = coordinates

      // if pic is loaded, get first count with arbitrary threshold
      if(this.pictureRealWidth != null) 
        this.processPictureNewThreshold();
    },
    drawEggs: function() {
      this.pictureClientHeight = this.$refs.container.clientHeight; 
      
      // find scale of UI related to real picture (and results)
      let scaleUI = this.visibleArea["height"] / this.pictureClientHeight ;

      // find top left corner of bounding box in UI frame 
      let pointTopLeftUI = [
        (this.coordinates["top"] - this.visibleArea["top"]) / scaleUI, 
        (this.coordinates["left"]- this.visibleArea["left"]) / scaleUI
      ]


      // construct contour string
      const contoursKept = this.results.data["contoursKept"];
      // for each egg conout
      let _this = this;
      _this.eggPaths = [];

      contoursKept.forEach(function (contour) {
        let strContour = "M ";
        // for each point
        contour.forEach(function (point, index) {
          // bbox 0 is left, 1 is top in real sizes
          // svg path expects [x,y] pairs
          strContour +=
            (point[0][0] / scaleUI + pointTopLeftUI[1]) +
            " " +
            (point[0][1] / scaleUI + pointTopLeftUI[0]);
          if (index < contour.length - 2) {
            strContour += " L ";
          } else {
            strContour += " Z";
          }
        });
        _this.eggPaths.push(strContour);
      });
      
    },
    processPictureNewThreshold: function () {
      let bboxString = Math.round(this.coordinates["top"]) + "," + Math.round(this.coordinates["left"]) + "," 
        + Math.round(this.coordinates["height"]) + "," + Math.round(this.coordinates["width"])

      store.commit('showLoader')
      axios
        .get(store.state.settings.backend_url
            + "/process?pic_url=" + this.imgUrl
            + "&threshold=" + this.threshold
            + "&bbox=" + bboxString)
        .then((res_proc) => {
          if (res_proc.status != 200) return false;
          this.results = res_proc.data;
          this.resultingCount = this.results.data["eggsTotal"]
          this.$emit("update:eggCount", this.resultingCount);

          this.drawEggs();
          store.commit('hideLoader')
        })
        .catch(function(err) {
          console.log(err)
          store.commit('hideLoader')
        });
      
    },
  },
};
</script>

<style>
.egg-counter-container {
  position: relative;
}
.egg-counter-overlay-img {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
  opacity: 0.5;
  pointer-events: none;
}
.egg-counter-overlay-svg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0.8;
  pointer-events: none;
}
</style>
