# odrive_gui
This is the repo for the ODrive GUI

Flask (python 3) backend with Vue.js frontend, packaged with Electron.

Python requirements: `pip install flask flask-socketio flask-cors odrive`

If the default odrive python package is not desired, a config file must be created to point `odrive_server.py` toward the correct modules.

In the default installation directory, place a text file called `server_config.txt` in the same folder as `odrive_server.py`

On Windows 10, this directory is `C:\Users\(username)\AppData\Local\Programs\odrive_gui\resources\server`

`server_config.txt` should have content in this format: `odrive: <full path to odrive python utils>`


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
