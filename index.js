const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

async function createWindow() {
  const isDev = await import('electron-is-dev').then(module => module.default);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'public', 'legoat.jpeg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'legoatapp', 'build', 'index.html')}`;

  win.loadURL(url);

  const thumbnailImage = nativeImage.createFromPath(path.join(__dirname, 'legoat.jpeg'));
  if (!thumbnailImage.isEmpty()) {
    if (process.platform === 'darwin') {
      app.dock.setIcon(thumbnailImage);
    } else if (process.platform === 'win32') {
      win.setOverlayIcon(thumbnailImage, 'My Electron App');
    } else {
      console.warn('setOverlayIcon is only supported on Windows');
    }
  } else {
    console.error('Failed to load thumbnail image');
  }
}

app.whenReady().then(createWindow).catch(err => console.error('Failed to create window:', err));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});