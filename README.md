# odrive_gui
This is the repo for the ODrive GUI

Currently, this is a Vue.js web app with a python backend using Flask

This may change in the future

To run the GUI:

Clone this repo and clone the ODrive git repo, preferably the devel branch

Move the odrive_server.py file from this repo to the `tools` folder in the odrive repo

Navigate to the tools folder and start the server with `python3 odrive_server.py`

To start the deployment server for the web app, run `npm run serve` from the root of this repo. 


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
