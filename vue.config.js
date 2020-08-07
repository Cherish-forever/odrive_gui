// this file is used for configuring electron-builder

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "productName": "ODrive GUI",
                "asar": false,
                "extraResources": "server"
            }
        }
    }
}