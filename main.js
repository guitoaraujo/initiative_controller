import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Store from 'electron-store';

// Substituindo __dirname com ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializa o store para armazenar os personagens
const store = new Store();

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: `${__dirname}/preload.js`,  // Certifique-se de usar o preload.js se for necessário
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');  // Ou a página que você está carregando

  // Abrir o console do desenvolvedor
  mainWindow.webContents.openDevTools();
});

// Manipuladores IPC para comunicar com o renderizador

// Carregar personagens
ipcMain.handle('loadCharacters', () => {
  return store.get('characters', []);
});

// Adicionar um personagem
ipcMain.handle('addCharacter', (event, character) => {
  const characters = store.get('characters', []);
  characters.push(character);
  store.set('characters', characters);
  return true;
});

// Editar um personagem
ipcMain.handle('editCharacter', (event, index, updatedCharacter) => {
  const characters = store.get('characters', []);
  characters[index] = updatedCharacter;
  store.set('characters', characters);
  return true;
});

// Excluir um personagem
ipcMain.handle('deleteCharacter', (event, index) => {
  const characters = store.get('characters', []);
  characters.splice(index, 1);
  store.set('characters', characters);
  return true;
});

// Fechar o app quando todas as janelas forem fechadas (exceto no Mac)
app.on('window-all-closed', () => {
  app.quit();
});
