import Vue from 'vue';
import Vuex from 'vuex';
const axios = require('axios');

Vue.use(Vuex);

export default new Vuex.Store({
    // state is the data for this app
    state: {
        odrives: Object,
        odriveConfigs: Object,
        axes: Array,
        odriveServerAddress: String,
        dashboards: [
            {
                name: "Start",
                component: "Start"
            },
            { name: "Config", component: "Dashboard", controls: [], plots: [] }
        ],
        sampledProperties: []
    },
    // mutations are functions that change the data
    mutations: {
        setOdrives(state, odrives) {
            state.odrives = odrives;
        },
        setOdriveConfigs(state, odriveConfigs) {
            state.odriveConfigs = odriveConfigs;
        },
        setAxes(state, axes) {
            state.axes = axes;
        },
        changeServerAddress(state, address) {
            state.odriveServerAddress = address;
        },
        updateOdriveProp(state, payload) {
            // need to use Vue.set!!!
            // payload is {path, value}
            const createNestedObject = (odrive, path) => {
                let ref = odrive;
                let keys = path.split('.');
                for (const key of keys) {
                    ref = ref[key];
                }
                return ref;
            };
            Vue.set(createNestedObject(state.odrives, payload.path), "val" , payload.value);
            
        },
        addSampledProperty(state, path) {
            if( !(path in state.sampledProperties) ){
                state.sampledProperties.push(path);
            }
            for (const path of state.sampledProperties) {
                console.log(path);
            }
        }
    },
    // actions trigger mutations
    actions: {
        getOdrives(context) {
            // grab ODrive JSON from odrive_server
            axios.get(context.state.odriveServerAddress + '/api/odrives').then((response) => {
                context.commit('setOdrives', JSON.parse(JSON.stringify(response.data)));
                context.dispatch('getOdriveConfigs');
                context.dispatch('getAxes');
            });
        },
        getOdriveConfigs(context) {
            // transform ODrive JSON
            function treeParse(odriveObj) {
                let retObj = {};
                for (const key of Object.keys(odriveObj)) {
                    if (typeof odriveObj[key] === 'object' && odriveObj[key] !== null) {
                        // check if "val" is a valid key
                        if (Object.prototype.hasOwnProperty.call(odriveObj[key], "val")) {
                            // parse from string to a type that we care about
                            switch (odriveObj[key]["type"]) {
                                case "float":
                                    retObj[key] = parseFloat(parseFloat(odriveObj[key]["val"]).toFixed(3));
                                    break;
                                case "int":
                                    retObj[key] = parseInt(odriveObj[key]["val"]);
                                    break;
                                case "bool":
                                    retObj[key] = odriveObj[key]["val"] == 'True';
                                    break;
                                default:
                                    retObj[key] = odriveObj[key]["val"];
                            }
                        }
                        else {
                            retObj[key] = treeParse(odriveObj[key]);
                        }
                    }
                    else if (odriveObj[key] == "function") {
                        retObj[key] = "function";
                    }
                    else {
                        retObj[key] = odriveObj[key];
                    }
                }
                return retObj;
            }
            context.commit('setOdriveConfigs', treeParse(context.state.odrives));
        },
        getAxes(context) {
            let axes = [];
            //for each connected odrive, collect axes and display them
            for (const odrive of Object.keys(context.state.odrives)) {
                if ('axis0' in context.state.odrives[odrive]) {
                    axes.push({
                        name: `${odrive}.axis0`,
                        ref: context.state.odrives[odrive]['axis0']
                    });
                    context.commit('addSampledProperty', `${odrive}.axis0.error.val`);
                }
                if ('axis1' in context.state.odrives[odrive]) {
                    axes.push({
                        name: `${odrive}.axis1`,
                        ref: context.state.odrives[odrive]['axis1']
                    });
                    context.commit('addSampledProperty', `${odrive}.axis1.error.val`);
                }
            }
            context.commit('setAxes', axes);
        },
        updateSampledProperties(context) {
            for (const propPath of context.state.sampledProperties) {
                //do an axios.get with mutation in .then()
                var params = new URLSearchParams();
                let keys = propPath.split(".");
                keys.shift();
                for (const key of keys) {
                    params.append("key", key);
                }
                axios.get(context.state.odriveServerAddress + "/api/property", {params: params}).then((response) => {
                    context.commit('updateOdriveProp', {path: keys.join('.'), value: JSON.parse(JSON.stringify(response.data))});
                });
                context.dispatch('getAxes');
            }
        }
    }
})