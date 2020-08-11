// this file is used for configuring electron-builder

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "productName": "ODriveGUI",
                "asar": false,
                "extraResources": "server",
                "artifactName": "${name}_${os}.${ext}",
                "win" : {
                    "target" : [
                        {
                            "target": "portable",
                        }
                    ]
                }
            },
            mainProcessArgs: ['C:/Users/pajoh/Desktop/ODrive_work/ODrive/tools', 'C:/Users/pajoh/Desktop/ODrive_work/ODrive/Firmware']
        }
    }
}