// this file is used for configuring electron-builder

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "asar": false,
                "extraResources": "server"
            }
        }
    }
}