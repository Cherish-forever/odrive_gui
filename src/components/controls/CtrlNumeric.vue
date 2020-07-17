<template>
    <div class="card">
        <div>
            <span class="ctrlName">
                {{name}}
            </span>
            <span class="ctrlVal">
                {{value}}
            </span>
        </div>
        <input v-if="writeAccess" type="number" v-on:change="putVal">
    </div>
</template>

<script>
const axios = require('axios');

export default {
    name: 'CtrlNumeric',
    //type checking here for properties
    props: {
        name: String,
        path: String,
        odrives: Object
    },
    computed: {
        value: function() {
            let keys = this.path.split('.');
            keys.shift(); // don't need first key here
            let odriveObj = this.odrives;
            for(const key of keys){
                odriveObj = odriveObj[key];
            }
            return parseFloat(odriveObj["val"]).toFixed(3);
        },
        writeAccess: function() {
            let keys = this.path.split('.');
            keys.shift(); // don't need first key here
            let odriveObj = this.odrives;
            for(const key of keys){
                odriveObj = odriveObj[key];
            }
            return odriveObj["readonly"] === false;
        }
    },
    methods: {
        putVal: function(e) {
            var params = new URLSearchParams();
            let keys = this.path.split('.');
            keys.shift();
            for(const key of keys){
                params.append("key",key);
            }
            params.append("val", e.target.value);
            console.log(params.toString());
            let request = {
                params: params
            };
            console.log(request);
            axios.put('http://192.168.1.126:8080/api/property', null, request);
        }
    }
}
</script>

<style scoped>
.ctrlVal {
    font-weight: bold;
}
</style>