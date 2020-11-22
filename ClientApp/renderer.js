const { ipcRenderer } = require("electron");
const { FETCH_DATA_FROM_STORAGE, SAVE_DATA_IN_STORAGE, REMOVE_DATAPOINT_FROM_STORAGE, EDIT_DATAPOINT_IN_STORAGE} = require("../utils/constants")

// This renderer file contains much of our front end code for communicating with main. In essence, it is similar to making api calls to the server, except here we do not have to async/await because everything is running in the same system.

// There are also similar handler functions on the React side

// -----------------------------------------------------------------
// Functions for calling main

// Ask main to load data from its persistent storage
function loadSavedData() {
  // console.log("loadSaveData called")
  ipcRenderer.send(FETCH_DATA_FROM_STORAGE, "expenses")
}

// Send expense message to main
function saveDataInStorage(expense) {
  // console.log("saveDataInStorage called")
  ipcRenderer.send(SAVE_DATA_IN_STORAGE, expense)
}

// Send remove datapoint message to main
function removeDatapointFromStorage(message) {
  ipcRenderer.send(REMOVE_DATAPOINT_FROM_STORAGE, message)
}

// Send edit datapoint message to main
function editDatapointInStorage(message) {
  ipcRenderer.send(EDIT_DATAPOINT_IN_STORAGE, message)
}

module.exports = { loadSavedData, saveDataInStorage, removeDatapointFromStorage, editDatapointInStorage }
