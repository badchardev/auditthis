const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { join } = require('path');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

// Window state management
const windowStateFile = path.join(os.homedir(), '.auditthis-window-state.json');

function saveWindowState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const bounds = mainWindow.getBounds();
    const isMaximized = mainWindow.isMaximized();
    const isFullScreen = mainWindow.isFullScreen();
    
    const windowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized,
      isFullScreen
    };
    
    try {
      fs.writeFileSync(windowStateFile, JSON.stringify(windowState, null, 2));
    } catch (error) {
      console.error('Failed to save window state:', error);
    }
  }
}

function loadWindowState() {
  try {
    if (fs.existsSync(windowStateFile)) {
      const data = fs.readFileSync(windowStateFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load window state:', error);
  }
  
  // Default window state
  return {
    width: 1200,
    height: 800,
    x: undefined,
    y: undefined,
    isMaximized: false,
    isFullScreen: false
  };
}

function createWindow() {
  const windowState = loadWindowState();
  
  // Create the browser window with saved state
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    title: 'AuditThis!',
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: join(__dirname, 'preload.js'),
      backgroundThrottling: false,
      offscreen: false,
      hardwareAcceleration: true,
      scrollBounce: true,
      experimentalFeatures: true,
      devTools: true, // Enable dev tools for debugging
      allowRunningInsecureContent: false,
      plugins: false,
      sandbox: false,
      // macOS specific settings
      ...(process.platform === 'darwin' && {
        spellcheck: false,
        enableBlinkFeatures: 'CSSColorSchemeUARendering',
        additionalArguments: ['--enable-features=VaapiVideoDecoder']
      })
    },
    icon: join(__dirname, 'assets/icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    autoHideMenuBar: true,
    menuBarVisible: false,
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
    transparent: false,
    useContentSize: true,
    frame: true,
    ...(process.platform === 'darwin' && {
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 20, y: 20 },
      fullscreenable: true,
      maximizable: true,
      minimizable: true,
      closable: true,
      acceptFirstMouse: true,
      disableAutoHideCursor: false
    })
  });

  // Add error handling for loading
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Add console message handling
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer console:', message);
  });
  // Restore window state
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }
  if (windowState.isFullScreen) {
    mainWindow.setFullScreen(true);
  }

  // Remove the menu bar completely
  mainWindow.setMenuBarVisibility(false);
  
  // Save window state on various events
  mainWindow.on('resize', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
    }
  });
  
  mainWindow.on('move', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
    }
  });
  
  mainWindow.on('maximize', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
    }
  });
  
  mainWindow.on('unmaximize', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
    }
  });
  
  mainWindow.on('enter-full-screen', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
      mainWindow.webContents.executeJavaScript(`
        if (typeof document !== 'undefined') {
          document.body.classList.add('fullscreen');
        }
      `).catch(() => {});
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (!mainWindow.isDestroyed()) {
      saveWindowState();
      mainWindow.webContents.executeJavaScript(`
        if (typeof document !== 'undefined') {
          document.body.classList.remove('fullscreen');
        }
      `).catch(() => {});
    }
  });
  
  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools(); // Comment out for testing
  } else {
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading file from:', indexPath);
    
    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(indexPath)) {
      console.log('Index file exists, loading...');
      // Try loading with file:// protocol explicitly on macOS
      if (process.platform === 'darwin') {
        const fileUrl = `file://${indexPath}`;
        console.log('macOS: Loading with file URL:', fileUrl);
        mainWindow.loadURL(fileUrl);
      } else {
        mainWindow.loadFile(indexPath);
      }
    } else {
      console.error('Index file not found at:', indexPath);
      // Try alternative paths
      const altPath1 = join(__dirname, 'dist', 'index.html');
      const altPath2 = join(process.resourcesPath, 'app.asar', 'dist', 'index.html');
      const altPath3 = join(process.resourcesPath, 'dist', 'index.html');
      
      console.log('Trying alternative paths:');
      console.log('Alt path 1:', altPath1);
      console.log('Alt path 2:', altPath2);
      console.log('Alt path 3:', altPath3);
      
      if (fs.existsSync(altPath1)) {
        console.log('Loading from alternative path 1:', altPath1);
        if (process.platform === 'darwin') {
          mainWindow.loadURL(`file://${altPath1}`);
        }
      }
    }
    // macOS-specific loading with better path resolution
    if (process.platform === 'darwin') {
      // Try multiple paths for macOS
      const possiblePaths = [
        join(__dirname, '..', 'dist', 'index.html'),
        join(__dirname, 'dist', 'index.html'),
        join(process.resourcesPath, 'app', 'dist', 'index.html'),
        join(process.resourcesPath, 'dist', 'index.html')
      ];
      
      let loaded = false;
      for (const indexPath of possiblePaths) {
        console.log('Trying path:', indexPath);
        if (fs.existsSync(indexPath)) {
          console.log('Found index.html at:', indexPath);
          try {
            // Use loadFile instead of loadURL for better compatibility
            mainWindow.loadFile(indexPath);
            loaded = true;
            console.log('Successfully loaded from:', indexPath);
            break;
          } catch (error) {
            console.error('Failed to load from:', indexPath, error);
          }
        }
      }
      
      if (!loaded) {
        console.error('Could not load index.html from any path');
        console.log('Available paths checked:', possiblePaths);
        console.log('__dirname:', __dirname);
        console.log('process.resourcesPath:', process.resourcesPath);
        
        // Load error page
        mainWindow.loadURL('data:text/html,<h1>macOS Loading Error</h1><p>Could not find index.html</p>');
      }
    } else {
      // Non-macOS platforms
      const indexPath = join(__dirname, '..', 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        mainWindow.loadFile(indexPath);
      } else {
        console.error('Index file not found at:', indexPath);
        mainWindow.loadURL('data:text/html,<h1>Error: Could not find application files</h1>');
      }
    }
  }

  // Show window when ready and apply dragging styles
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    
    // macOS specific showing logic
    if (process.platform === 'darwin') {
      // Longer delay for macOS
      setTimeout(() => {
        mainWindow.show();
        mainWindow.focus();
        
        // macOS specific debugging
        setTimeout(() => {
          mainWindow.webContents.executeJavaScript(`
            if (typeof document !== 'undefined') {
              console.log('macOS Debug - Page loaded, document ready state:', document.readyState);
              console.log('macOS Debug - Root element exists:', !!document.getElementById('root'));
              console.log('macOS Debug - Root element content:', document.getElementById('root')?.innerHTML?.substring(0, 200));
              console.log('macOS Debug - Body content:', document.body?.innerHTML?.substring(0, 200));
              console.log('macOS Debug - Document title:', document.title);
              console.log('macOS Debug - Location:', window.location.href);
            }
          `).catch(err => console.error('Failed to execute macOS debug script:', err));
        }, 500);
      }, 300);
    } else {
      // Standard showing for other platforms
      setTimeout(() => {
        mainWindow.show();
        
        // Check if page loaded properly
        mainWindow.webContents.executeJavaScript(`
          if (typeof document !== 'undefined') {
            console.log('Page loaded, document ready state:', document.readyState);
            console.log('Root element exists:', !!document.getElementById('root'));
            console.log('Root element content:', document.getElementById('root')?.innerHTML?.substring(0, 100));
          }
        `).catch(err => console.error('Failed to execute debug script:', err));
      }, 100);
    }
           // console.log('macOS Debug - Root element exists:', !!document.getElementById('root'));
           // console.log('macOS Debug - Root element content:', document.getElementById('root')?.innerHTML?.substring(0, 100));
          // console.log('macOS Debug - Document body:', document.body?.innerHTML?.substring(0, 200));
    
    // Apply dragging styles
    setTimeout(() => {
      applyDraggingStyles();
    }, process.platform === 'darwin' ? 500 : 200);
  });

  // Add error handling for failed loads
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load page:', errorCode, errorDescription, validatedURL);
  });

  // Log when navigation completes
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
    mainWindow.show();
    
    // Apply dragging styles after a short delay
    setTimeout(() => {
      applyDraggingStyles();
    }, 50);
  });

  // Apply dragging styles after DOM is ready
  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM ready');
    applyDraggingStyles();
  });

  // Reapply dragging styles after navigation or reload
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading');
    setTimeout(() => {
      applyDraggingStyles();
    }, 50);
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    saveWindowState();
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function applyDraggingStyles() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  
  mainWindow.webContents.executeJavaScript(`
    (function() {
      // Function to apply dragging styles
      function enableWindowDragging() {
        // Find the navigation element
        const nav = document.querySelector('nav');
        if (!nav) {
          console.log('Navigation not found, retrying...');
          setTimeout(enableWindowDragging, 100);
          return;
        }
        
        // Enable dragging for the entire navigation bar
        nav.style.webkitAppRegion = 'drag';
        nav.style.userSelect = 'none';
        nav.style.cursor = 'default';
        
        // Disable dragging for interactive elements
        const interactiveElements = nav.querySelectorAll('button, [role="button"], input, select, textarea, a, [tabindex]');
        interactiveElements.forEach(element => {
          element.style.webkitAppRegion = 'no-drag';
          element.style.cursor = 'pointer';
        });
        
        // Also disable dragging for the container with buttons
        const buttonContainer = nav.querySelector('.flex.items-center.space-x-8');
        if (buttonContainer) {
          buttonContainer.style.webkitAppRegion = 'no-drag';
        }
        
        // Ensure theme toggle is clickable
        const themeToggle = nav.querySelector('[aria-label*="mode"]');
        if (themeToggle) {
          themeToggle.style.webkitAppRegion = 'no-drag';
          themeToggle.style.cursor = 'pointer';
        }
        
        console.log('Window dragging enabled successfully');
      }
      
      // Apply immediately if DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableWindowDragging);
      } else {
        enableWindowDragging();
      }
      
      // Reapply on any dynamic content changes
      const observer = new MutationObserver((mutations) => {
        let shouldReapply = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.target.tagName === 'NAV') {
            shouldReapply = true;
          }
        });
        
        if (shouldReapply) {
          setTimeout(enableWindowDragging, 10);
        }
      });
      
      // Start observing
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      
      // Also reapply when window is resized
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(enableWindowDragging, 50);
      });
      
      // Reapply when focus changes (helps with theme switching)
      window.addEventListener('focus', () => {
        setTimeout(enableWindowDragging, 10);
      });
    })();
  `).catch((error) => {
    console.error('Failed to apply dragging styles:', error);
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    // macOS specific optimizations
    app.commandLine.appendSwitch('high-dpi-support', 'true');
    app.commandLine.appendSwitch('force-device-scale-factor', '1');
    app.commandLine.appendSwitch('enable-gpu-rasterization');
    app.commandLine.appendSwitch('enable-zero-copy');
    app.commandLine.appendSwitch('enable-smooth-scrolling');
    app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
    app.commandLine.appendSwitch('enable-features', 'Metal');
    
    // Disable hardware acceleration if needed
    // app.disableHardwareAcceleration();
  }
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Save window state before quitting
app.on('before-quit', () => {
  saveWindowState();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  saveWindowState();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// macOS specific app event handlers
if (process.platform === 'darwin') {
  app.on('browser-window-focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Reapply dragging styles when window gains focus
      setTimeout(() => {
        applyDraggingStyles();
      }, 10);
    }
  });
}