<template>
    <div id="app">
        <tree/>
        <div class="spin-wrapper" v-if="numLoadings!==0">
            <div class="spinner">
            </div>
        </div>
    </div>
</template>

<script>
  import Tree from './components/Main.vue';
  import axios from 'axios';

  import 'leaflet/dist/leaflet.css';
  export default {
    name: 'app',
    components: {
      Tree,
    },
    data() {
      return {
        numLoadings: 0,
      };
    },
    created() {
      let self = this;
      axios.interceptors.request.use((config) => {
        self.numLoadings++;
        return config;
      });
      axios.interceptors.response.use((config) => {
        self.numLoadings--;
        return config;
      });
    },
    beforeDestroy() {
      axios.interceptors.request.handlers.length = 0;
      axios.interceptors.response.handlers.length = 0;
    },
  };
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .spin-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
    }

    .spinner {
        position: absolute;
        height: 60px;
        width: 60px;
        border: 3px solid transparent;
        border-top-color: #A04668;
        top: 50%;
        left: 50%;
        margin: -30px;
        border-radius: 50%;
        animation: spin 2s linear infinite;
    }

    .spinner:before,
    .spinner:after {
        content: '';
        position: absolute;
        border: 3px solid transparent;
        border-radius: 50%;
    }

    .spinner:before {
        border-top-color: #254E70;
        top: -12px;
        left: -12px;
        right: -12px;
        bottom: -12px;
        animation: spin 3s linear infinite;
    }

    .spinner:after {
        border-top-color: #FFFBFE;
        top: 6px;
        left: 6px;
        right: 6px;
        bottom: 6px;
        animation: spin 4s linear infinite;
    }


    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
