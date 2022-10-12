import { app, BrowserWindow, autoUpdater, dialog } from "electron";
import * as log from "electron-log";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: "./public/images/icon.png",
    title: "Kira Kira ☆ Neurosis",
    width: 850,
    height: 873,
    resizable: false,
    minimizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Auto Update
const server = "https://update.electronjs.org";
const feed = `${server}/OWNER/REPO/${process.platform}-${
  process.arch
}/${app.getVersion()}`;

if (app.isPackaged) {
  autoUpdater.setFeedURL({
    url: feed,
  });
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-downloaded", async () => {
    const returnValue = await dialog.showMessageBox({
      message: "アップデートあり",
      detail: "再起動してインストールできます。",
      buttons: ["更新して再起動", "後で"],
    });
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall(); // アプリを終了してインストール
    }
  });

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      message: "アップデートがあります",
      buttons: ["OK"],
    });
  });

  autoUpdater.on("update-not-available", () => {
    log.info("Update not available");
  });

  // TODO: Check the error
  autoUpdater.on("error", (err) => {
    log.error(err);
    dialog.showMessageBox({
      message: "アップデートエラーが起きました",
      buttons: ["OK"],
    });
  });
}
