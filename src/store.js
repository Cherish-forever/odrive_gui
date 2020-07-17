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
        odriveServerAddress: String
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
                        // do nothing
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
                }
                if ('axis1' in context.state.odrives[odrive]) {
                    axes.push({
                        name: `${odrive}.axis1`,
                        ref: context.state.odrives[odrive]['axis1']
                    });
                }
            }
            context.commit('setAxes', axes);
        }
    }
})