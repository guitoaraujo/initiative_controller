const { contextBridge, ipcRenderer } = require('electron');

// Exponha APIs seguras ao renderer process
contextBridge.exposeInMainWorld('api', {
  loadCharacters: () => ipcRenderer.invoke('loadCharacters'),
  addCharacter: (character) => ipcRenderer.invoke('addCharacter', character),
  editCharacter: (index, updatedCharacter) => ipcRenderer.invoke('editCharacter', index, updatedCharacter),
  deleteCharacter: (index) => ipcRenderer.invoke('deleteCharacter', index),
  saveSelectedCharacters: (characters) => ipcRenderer.invoke('saveSelectedCharacters', characters),
  loadSelectedCharacters: () => ipcRenderer.invoke('loadSelectedCharacters'),
});
