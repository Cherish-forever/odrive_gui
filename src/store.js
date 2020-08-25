import Vue from 'vue';
import Vuex from 'vuex';
const axios = require('axios');
import * as socketio from "./comms/socketio";
import { v4 as uuidv4 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
    // state is the data for this app
    state: {
        odrives: Object,
        odriveConfigs: Object,
        axes: Array,
        odriveServerAddress: String,
        serverConnected: Boolean,
        dashboards: [
            {
                name: "Start",
                component: "Start",
            },
            { name: "Config", id: uuidv4(), component: "Dashboard", controls: [], actions: [], plots: [] }
        ],
        timeSampleStart: 0,
        sampledProperties: [], // make this an object where the full path is a key and the value is the sampled var
        propSamples: { time: [] }, // {time: [time values], ...path: [path var values]}
        newData: false,
        sampling: false,
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
        setServerAddress(state, address) {
            state.odriveServerAddress = address;
        },
        updateOdriveProp(state, payload) {
            // need to use Vue.set!!!
            // payload is {path, value}
            // 
            const createNestedObject = (odrive, path) => {
                let ref = odrive;
                let keys = path.split('.');
                for (const key of keys) {
                    ref = ref[key];
                }
                return ref;
            };
            Vue.set(createNestedObject(state.odrives, payload.path), "val", payload.value);

        },
        addSampledProperty(state, path) {
            if (!(path in state.sampledProperties)) {
                let newPath = path.split('.');
                newPath.splice(0, 1);
                state.sampledProperties.push(newPath.join('.'));
                state.propSamples[newPath.join('.')] = [];
                console.log(state.propSamples);
            }
            for (const path of state.sampledProperties) {
                console.log(path);
            }
            socketio.sendEvent({
                type: 'sampledVarNames',
                data: {
                    paths: state.sampledProperties
                }
            });
        },
        removeSampledProperty(state, path) {
            let newPath = path.split('.');
            newPath.splice(0, 1);
            const index = state.sampledProperties.indexOf(newPath.join('.'));
            if (index > -1) {
                state.sampledProperties.splice(index, 1);
            }
        },
        updateSampledProperty(state, payload) {
            // payload is object of paths and values
            for (const path of Object.keys(payload)) {
                state.propSamples[path].push(payload[path]);
                if (state.propSamples[path].length > 250) {
                    state.propSamples[path].splice(0, 1); // emulate circular buffer
                }
            }
            state.propSamples["time"].push((Date.now() - state.timeSampleStart) / 1000);
            if (state.propSamples["time"].length > 250) {
                state.propSamples["time"].splice(0, 1);
            }
            state.newData = true;
        },
        setServerStatus(state, val) {
            state.serverConnected = val;
        },
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
                }
                if ('axis1' in context.state.odrives[odrive]) {
                    axes.push({
                        name: `${odrive}.axis1`,
                        ref: context.state.odrives[odrive]['axis1']
                    });
                }
            }
            context.commit('setAxes', axes);
        },
        setServerAddress(context, address) {
            context.commit('setServerAddress', address);
            socketio.setUrl(address);
            socketio.addEventListener({
                type: "connect",
                callback: () => {
                    context.commit("setServerStatus", true);
                    console.log('connected to server');
                }
            });
            socketio.addEventListener({
                type: "disconnect",
                callback: () => {
                    context.commit("setServerStatus", false);
                    console.log('server disconnect');
                    socketio.closeSocket();
                    context.commit('setAxes', []);
                }
            });
            socketio.addEventListener({
                type: "sampledData",
                callback: message => {
                    context.commit("updateSampledProperty", JSON.parse(message));
                }
            });
            socketio.addEventListener({
                type: "samplingEnabled",
                callback: () => {
                    socketio.sendEvent({
                        type: "startSampling"
                    });
                }
            });
        }
    }
})