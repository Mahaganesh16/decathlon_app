const net = require('net');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, host);
    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.once('error', () => {
      resolve(false);
    });
  });
}

async function ensureServices() {
  // 1. Ensure MySQL (port 3306)
  const isMySqlUp = await checkPort(3306);
  if (!isMySqlUp) {
    console.log('⚡ MySQL is not running on port 3306. Attempting to start XAMPP MySQL...');
    const xamppStartBat = 'C:\\xampp\\mysql_start.bat';
    const relativeStartBat = path.resolve(__dirname, '../../../../mysql_start.bat');
    const startScript = fs.existsSync(xamppStartBat) ? xamppStartBat : (fs.existsSync(relativeStartBat) ? relativeStartBat : null);

    if (startScript) {
      try {
        const mysqlProc = spawn('cmd.exe', ['/c', 'start', '""', startScript], {
          detached: true,
          stdio: 'ignore',
          windowsHide: false,
        });
        mysqlProc.unref();
        console.log('✅ Started XAMPP MySQL.');
      } catch (e) {
        console.error('Could not auto-start MySQL:', e.message);
      }
    } else {
      console.warn('⚠️  Could not locate mysql_start.bat. Please ensure MySQL is started in XAMPP Control Panel.');
    }
  }

  // 2. Ensure Backend (port 5000)
  const isBackendUp = await checkPort(5000);
  if (!isBackendUp) {
    console.log('⚡ Decathlon API Backend is not running. Starting it automatically on port 5000...');
    const backendDir = path.resolve(__dirname, '../../backend');
    try {
      const child = spawn(process.execPath, ['server.js'], {
        cwd: backendDir,
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });
      child.unref();
      console.log('✅ Decathlon API Backend launched.');
    } catch (err) {
      console.error('Failed to auto-start backend:', err);
    }
  }
}

ensureServices();
