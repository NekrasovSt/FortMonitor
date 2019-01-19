<template>
    <div class="container">
        <tree :data="tree" :options="treeOptions" @node:selected="nodeSelected"  @tree:data:fetch="dataReceived()" class="container__tree"></tree>
        <div class="container__main side-container">
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
            <div class="side-container__map">

            </div>
        </div>
    </div>
</template>

<script>
  //liquor-tree
  import {getData} from '../services/api';
  import LiquorTree from 'liquor-tree';

  export default {
    name: 'Main',
    components: {[LiquorTree.name]: LiquorTree},
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
      dataReceived(){
        console.log('received');
      }
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
