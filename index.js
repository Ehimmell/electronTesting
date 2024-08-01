const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'legoat.jpeg'), // Set the window icon on macOS
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');

  const thumbnailImage = nativeImage.createFromPath(path.join(__dirname, 'legoat.jpeg'));
  if (!thumbnailImage.isEmpty()) {
    console.log('Image dimensions:', thumbnailImage.getSize());
    if (process.platform === 'darwin') {
      app.dock.setIcon(thumbnailImage); // Set the dock icon on macOS
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