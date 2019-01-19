<template>
    <div class="container">
        <tree :data="tree" :options="treeOptions" @node:selected="nodeSelected" @tree:data:fetch="dataReceived()"
              class="container__tree"></tree>
        <div class="container__main side-container">
            <div class="side-container__map" ref="map">
            </div>
            <div class="side-container__info">
                <ul v-if="currentItem" class="cell-container">
                    <li class="cell-container__cell  info-cell">
                        <h2 class="info-cell__header">ИД</h2>
                        <div class="info-cell__text">{{currentItem.id}}</div>
                    </li>
                    <li class="cell-container__cell  info-cell">
                        <h2 class="info-cell__header">Тип</h2>
                        <div class="info-cell__text">{{getTypeDescription(currentItem.type)}}</div>
                    </li>
                    <li class="cell-container__cell  info-cell">
                        <h2 class="info-cell__header">Наименование</h2>
                        <div class="info-cell__text">{{currentItem.name}}</div>
                    </li>
                    <li class="cell-container__cell  info-cell" v-if="currentItem.IMEI">
                        <h2 class="info-cell__header">IMEI</h2>
                        <div class="info-cell__text">{{currentItem.IMEI}}</div>
                    </li>
                    <li class="cell-container__cell  info-cell" v-if="currentItem.lastData">
                        <h2 class="info-cell__header">Дата</h2>
                        <div class="info-cell__text">{{currentItem.lastData}}</div>
                    </li>
                    <li class="cell-container__cell  info-cell" v-if="currentItem.type === 'object'">
                        <h2 class="info-cell__header">Положение</h2>
                        <div class="info-cell__text">{{currentItem.lat}}, {{currentItem.lon}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  //liquor-tree
  import {getData} from '../services/api';
  import LiquorTree from 'liquor-tree';
  import {Map, TileLayer, Marker, CircleMarker} from 'leaflet';

  export default {
    name: 'Main',
    components: {
      [LiquorTree.name]: LiquorTree,
    },
    data() {
      return {
        tree: getData(),
        treeOptions: {},
        currentItem: null,
      };
    },
    methods: {
      nodeSelected(node) {
        this.currentItem = node.data;
        if (this.currentItem.type === 'object') {
          this.setPosition([this.currentItem.lat, this.currentItem.lon]);
        } else {
          this.resetPosition();
        }
      },
      getTypeDescription(type) {
        switch (type) {
          case 'company':
            return 'Компания';
          case 'group':
            return 'Группа';
          case 'object':
            return 'Объект';
        }
      },
      setPosition(pos) {
        this.map.panTo(pos, {animate: true, duration: 0.5});
        if (!this.marker) {
          this.marker = new CircleMarker(pos);
          this.map.addLayer(this.marker);
        } else {
          this.marker.setLatLng(pos);
        }
      },
      resetPosition() {
        this.map.panTo([58.027943, 56.301257], {animate: true, duration: 0.5});
        if (this.marker) {
          this.marker.removeFrom(this.map);
          this.marker = null;
        }
      },
    },
    mounted() {
      let map = new Map(this.$refs.map);
      map.setView([58.027943, 56.301257], 17);
      let tile = new TileLayer(
          'https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw');
      tile.addTo(map);
      this.map = map;
    },
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .container {
        display: flex;
    }

    .container__tree {
        flex: 1;
    }

    .container__main {
        flex: 2;
    }

    .side-container {
        display: flex;
        flex-direction: column;
    }

    .side-container__info {

    }

    .side-container__map {
        flex-basis: 600px;
    }

    .cell-container {
        list-style: none;
        display: flex;
        padding: 0;
        flex-wrap: wrap;
    }

    .cell-container__cell {
        flex-basis: 50%;
    }

    .info-cell {

        text-align: left;
    }

    .info-cell__header {
        margin: 8px 0;
        font-size: 24px;
    }

    .info-cell__text {

    }

</style>
