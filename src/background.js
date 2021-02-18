import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import './backend/serial';
import './backend/product';
import './backend/sale';
import './backend/backup';
import './backend/restore';
import './backend/inventory';
import { createTables } from './database/db';

const isDevelopment = process.env.NODE_ENV !== 'production'


protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        title: 'Controle de vendas',
        icon: __dirname + `/icon.png`,
        webPreferences: {      
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app')
        win.loadURL('app://./index.html')
    }

    win.removeMenu();
    win.setTitle('Controle de vendas')

    win.on('page-title-updated', function(e) {
        e.preventDefault()
    });
}

app.allowRendererProcessReuse = false;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
    await installExtension(VUEJS_DEVTOOLS);
    createWindow();
    createTables();
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
  }
}