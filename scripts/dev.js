import chokidar from 'chokidar';
import { execFileSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // This will automatically load .env.local

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function spawnProcess(command, args, options = {}) {
    const proc = spawn(command, args, { 
      stdio: 'inherit',
      ...options 
    });
  
    proc.on('error', (error) => {
      console.error(`Error starting ${command}:`, error);
      process.exit(1);
    });
  
    return proc;
}

// Cd ../ and run ./server/pocketbase meta appURL=http://127.0.0.1:8090
try {
  execFileSync(
    path.join(__dirname, '../server', 'pocketbase'),
    ['meta', `appURL=http://127.0.0.1:8090`],
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Error running PocketBase:', error);
  process.exit(1);
}

const pocketbase = spawnProcess(
    path.join(__dirname, '../server/pocketbase'),
    ['serve', '--hooksWatch=true', `--http=127.0.0.1:8090`],
    { cwd: process.cwd() }
);
  
const vite = spawnProcess(
    'npm',
    ['run', 'dev', '-w', 'client'],
    { cwd: path.join(__dirname, '..') }
);

// Full list of options. See below for descriptions.
// Do not use this example!
const watcher = chokidar.watch(path.join(__dirname, '../client/dist/lib.iife.js'), {
  persistent: true,
  awaitWriteFinish: true, // emit single event when chunked writes are completed
  atomic: true, // emit proper events when "atomic writes" (mv _tmp file) are used
});

watcher.on('all', (event, path) => {
    if (event === 'add') {
        // Copy the new file and paste it into the server/pb_hooks/pages/assets directory (replacing the old file)
        console.log('change detected, copying file');
        execFileSync('cp', [path, path.replace('client/dist', 'server/pb_hooks/pages/assets')], { stdio: 'inherit' });
    }
});

// Handle process termination
process.on('SIGINT', () => {
    pocketbase.kill();
    vite.kill();
    // Stop the watcher
    watcher.close();
    process.exit(0);
});