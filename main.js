'use strict';

// Import parts of electron to use
const { app, Menu, ipcMain, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const storage = require("electron-json-storage")

// Import all app constants
const { HANDLE_FETCH_DATA, FETCH_DATA_FROM_STORAGE, HANDLE_SAVE_DATA, SAVE_DATA_IN_STORAGE, REMOVE_DATAPOINT_FROM_STORAGE,  EDIT_DATAPOINT_IN_STORAGE } = require("./utils/constants")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// A reference to the expenses array, full of JS/JSON objects. All mutations to the array are performed in the main.js app, but each mutation will trigger a rewrite to the user's storage for data persistence
let expenses;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

// Keep a reference to the default path to userData, which will act as the app's database. It may not be necessary to use this
const defaultDataPath = storage.getDefaultDataPath();
// On Mac: /Users/[username]/Library/Application Support/expense-tracker-electron/storage

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false, icon: __dirname + "/public/Lobster.icns"
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.send("info", {msg: "hello from main process"})

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Creates a Menu instance (optional)
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'Track',
  //     submenu: [
  //       {label: "Current Month"},
  //       {label: "Past 6 Months"},
  //       {label: "Past Year"},
  //       {type: "separator"},
  //       {
  //         label: "Link: Monefy",
  //         click() {
  //           shell.openExternal('https://monefy.me/')
  //         }
  //       },
  //       {type: "separator"},
  //       {
  //         label: "Exit",
  //         click() {
  //           app.quit()
  //         }
  //       },
  //     ],
  //   },
  //   {
  //     label: "Info",
  //     submenu: [
  //       {label: "this"},
  //       {label: "that"},
  //     ]
  //   }
  // ])
//
  // Appends the menu to the application
//   Menu.setApplicationMenu(menu)
}
// End createWindow() ---------------------------------------------------

// Application boot up and boot down

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// --------------------------------------------------------------

// ipcMain methods are how we interact between the window and (this) main program

// Receives a FETCH_DATA_FROM_STORAGE from renderer
ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
  // Get the user's expenses from storage
  // For our purposes, message = expenses array
  storage.get(message, (error, data) => {
    // if the expenses key does not yet exist in storage, data returns an empty object, so we will declare expenses to be an empty array
    expenses = JSON.stringify(data) === '{}' ? [] : data;

    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        error: "expenses not returned",
      })
    } else {
      // Send message back to window
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: expenses, // do something with the data
      })
    }
  })

})

// Helper function for giving each expense a unique ID
function createUniqueId(expenses) {
  if (expenses.length) {
    const lastId = expenses[expenses.length-1].id
    return lastId+1
  } else {
    return 1
  }
}

// Receive a SAVE_DATA_IN_STORAGE call from renderer
ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {

  // attach a unique Id
  message.id = createUniqueId(expenses)

  // update the expenses array.
  expenses.push(message)

  // Save expenses to storage and send msg to the window
  storage.set("expenses", expenses, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: false,
        error: "expenses not saved",
      })
    } else {
      // Send message back to window as 2nd arg "data"
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: true,
        message: message,
      })
    }
  })
});

ipcMain.on(REMOVE_DATAPOINT_FROM_STORAGE, (event, id) => {

  // Basic temporary filterer
  expenses = expenses.filter(expense => expense.id != id)

  // Save expenses to storage and send msg to the window
  storage.set("expenses", expenses, (error) => {
    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        error: "error removing an expense from storage",
      })
    } else {
      // Send message back to window
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: expenses,
      })
    }
  })
})

// Update a datapoint -- message will be the updated
ipcMain.on(EDIT_DATAPOINT_IN_STORAGE, (event, message) => {
  console.log("main received", EDIT_DATAPOINT_IN_STORAGE, "message:", message)

  let datapointToEdit = expenses.find(expense => {
    // The message should have an identifying key
    expense.id === message.id
  })

  if (datapointToEdit) {
    datapointToEdit = message;
    console.log("does this properly update the expenses array?", expenses)

    // Set expenses in storage
    storage.set("expenses", expenses, (error) => {
      if (error) {
        mainWindow.send(HANDLE_FETCH_DATA, {
          success: false,
          error: "error editing an expense in storage",
        })
      } else {
        // Send message back to window
        mainWindow.send(HANDLE_FETCH_DATA, {
          success: true,
          message: expenses,
        })
      }
    })
  } else {
    // The datapoint was not found
    mainWindow.send(HANDLE_FETCH_DATA, {
      success: false,
      error: "main: did not find the corresponding expense",
    })
  }
})

