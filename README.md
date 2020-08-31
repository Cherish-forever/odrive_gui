# odrive_gui
This is the repo for the ODrive GUI

Flask (python 3) backend with Vue.js frontend, packaged with Electron. Windows and Linux binaries can be found under the [Releases](https://github.com/PAJohnson/odrive_gui/releases) page.

Python requirements: `pip install flask flask-socketio flask-cors odrive`

If the default odrive python package is not desired, the path to the modules can be passed as command line arguments.

example on windows 10: 
```
./odrive_gui_win.exe C:/Users/<you>/ODrive/tools C:/Users/<you>/ODrive/Firmware
```

The first argument is for your local version of odrivetool, the second is for fibre.

## Development and testing instructions

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Serve electron version of GUI
```
npm run electron:serve
```

### Package electron app into executable
```
npm run electron:build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
