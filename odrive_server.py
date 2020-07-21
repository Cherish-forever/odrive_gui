import odrive
from odrive.enums import *
import http.server
import socketserver
import flask
from flask import make_response, request, jsonify
from flask_cors import CORS
import fibre
import json
import re

# interface for odrive GUI to get data from odrivetool

app = flask.Flask(__name__)
CORS(app, support_credentials=True)
odrives = []
odriveDict = {}
configDict = {}


def get_all_odrives():
    #odrives = odrive.find_any(timeout=5, find_multiple=100)
    odrives = []
    odrives.append(odrive.find_any())
    return odrives


@app.route('/', methods=['GET'])
def home():
    return "<h1>ODrive GUI Server</h1>"


@app.route('/api/odrives', methods=["GET"])
def api_odrives():
    for (index, odrv) in enumerate(odrives):
        odriveDict["odrive" + str(index)] = dictFromRO(odrv)
    response = jsonify(odriveDict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/api/property', methods=["GET", "PUT"])
def api_property():
    # here, reqDict["key"] is a list of keys from the query
    # ?key=odrive0&key=axis0&key=config...
    if request.method == 'PUT':
        reqDict = request.args.to_dict(flat=False)
        postVal(odrives, reqDict["key"], reqDict["val"][0], reqDict["type"][0])
        response = make_response(jsonify({"message": "success"}), 200)
        return response
    else:
        print("request: " + str(request))
        reqDict = request.args.to_dict(flat=False)
        response = jsonify(getVal(odrives, reqDict["key"]))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.route('/api/function', methods=["PUT"])
def api_function():
    # execute a function from the odrive config dict?
    reqDict = request.args.to_dict(flat=False)
    callFunc(odrives, reqDict["key"])
    response = make_response(jsonify({"message": "success"}), 200)
    return response


def dictFromRO(RO):
    # create dict from an odrive RemoteObject that's suitable for sending as JSON
    returnDict = {}
    for key in RO._remote_attributes.keys():
        if isinstance(RO._remote_attributes[key], fibre.remote_object.RemoteObject):
            # recurse
            returnDict[key] = dictFromRO(RO._remote_attributes[key])
        elif isinstance(RO._remote_attributes[key], fibre.remote_object.RemoteProperty):
            # grab value of that property
            # indicate if this property can be written or not
            returnDict[key] = {"val": str(RO._remote_attributes[key].get_value()),
                               "readonly": not RO._remote_attributes[key]._can_write,
                               "type": str(RO._remote_attributes[key]._property_type.__name__)}
        elif isinstance(RO._remote_attributes[key], fibre.remote_object.RemoteFunction):
            # this is a function - do nothing for now.
            returnDict[key] = "function"
        else:
            returnDict[key] = RO._remote_attributes[key]
    return returnDict

# set a value from a POST http request


def postVal(odrives, keyList, value, argType):
    # expect a list of keys in the form of ["key1", "key2", "keyN"]
    # "key1" will be "odriveN"
    # like this: postVal(odrives, ["odrive0","axis0","config","calibration_lockin","accel"], 17.0)
    index = int(''.join([char for char in keyList.pop(0) if char.isnumeric()]))

    RO = odrives[index]
    for key in keyList:
        RO = RO._remote_attributes[key]
    if argType == "numeric":
        RO.set_value(float(value))
    elif argType == "boolean":
        RO.set_value(value == "true")
    else:
        pass # dont support that type yet

# get a value or object for an http GET request


def getVal(odrives, keyList):
    index = int(''.join([char for char in keyList.pop(0) if char.isnumeric()]))
    RO = odrives[index]
    for key in keyList:
        RO = RO._remote_attributes[key]
    if isinstance(RO, fibre.remote_object.RemoteObject):
        return dictFromRO(RO)
    else:
        return RO.get_value()

# call a function from a GET request


def callFunc(odrives, keyList):
    index = int(''.join([char for char in keyList.pop(0) if char.isnumeric()]))
    RO = odrives[index]
    for key in keyList:
        RO = RO._remote_attributes[key]
    if isinstance(RO, fibre.remote_object.RemoteFunction):
        # is this how to call the function?
        RO.__call__()


if __name__ == "__main__":
    odrives = get_all_odrives()
    for (index, odrv) in enumerate(odrives):
        odriveDict["odrive" + str(index)] = dictFromRO(odrv)
    app.run(host='0.0.0.0', port=8080)