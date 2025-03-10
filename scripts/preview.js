import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // This will automatically load .env.local

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine local IP address:
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceArray = interfaces[name] || [];
    for (const iface of ifaceArray) {
      // "IPv4" and non-internal - typical for local IP
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const localIp = getLocalIp();
if (!localIp) {
  console.error('Failed to identify the local IP address.');
  process.exit(1);
}

// Run npm run build
console.log('Running npm run build...');
try {
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
}
catch (error) {
  console.error('Error running npm run build:', error);
  process.exit(1);
}

const appURL = `http://${localIp}:8090`;
console.log(`Setting the App URL to ${appURL}`);
try {
  execFileSync(
    path.join(__dirname, '../server', 'pocketbase'),
    ['meta', `appURL=${appURL}`],
    { stdio: 'inherit' }
  );
  console.log(`Starting PocketBase on IP: ${localIp}`);
  execFileSync(
    path.join(__dirname, '../server', 'pocketbase'),
    ['serve', `--http=${localIp}:8090`],
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Error running PocketBase:', error);
  process.exit(1);
}