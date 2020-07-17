<template>
    <div class="card">
        <div class="ctrlName">
            {{name}}:
        </div>
        <div class="ctrlVal">
            {{value}}
        </div>
        <input v-if="writeAccess" type="checkbox" v-bind:value="value">
    </div>
</template>

<script>
export default {
    name: 'CtrlBoolean',
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
            return odriveObj["val"];
        },
        writeAccess: function() {
            let keys = this.path.split('.');
            keys.shift(); // don't need first key here
            let odriveObj = this.odrives;
            for(const key of keys){
                odriveObj = odriveObj[key];
            }
            return odriveObj["readonly"] == false;
        }
    }
}
</script>

<style scoped>
.ctrlVal {
    font-weight: bold;
}
</style>