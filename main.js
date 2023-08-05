
const {app, BrowserWindow} = require("electron")


app.on('window-all-closed', () => {
    app.quit()
})


app.whenReady().then(() => {
    const window = new BrowserWindow({
        width:1000,
        height:700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    
    window.loadFile("index.html")
    //window.webContents.openDevTools();
});

