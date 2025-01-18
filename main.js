const path = require('path'); // Importa o módulo 'path' para lidar com caminhos
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), // Garante que o electron-reload usa o Electron instalado localmente
});

const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Substitui `renderer.js` pelo padrão de boas práticas: `preload.js`
      contextIsolation: true,
      enableRemoteModule: false, // Remote está desativado por padrão nas versões recentes do Electron
    },
  });

  mainWindow.loadFile('index.html');

  // Abre as ferramentas de desenvolvedor (opcional)
  mainWindow.webContents.openDevTools();
});

// Fecha o aplicativo quando todas as janelas são fechadas
app.on('window-all-closed', () => {
  app.quit();
});
