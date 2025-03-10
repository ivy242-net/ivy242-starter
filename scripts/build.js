import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // This will automatically load .env.local

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Building js/dist/lib.iife.js
execFileSync('npm', ['run', 'build', '-w', 'client'], { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')  // Ensure we're in the root directory
});

// Copy lib.iife.js into server/pb_hooks/pages/assets
const src = path.join(__dirname, '..', 'client', 'dist', 'lib.iife.js');
const dest = path.join(__dirname, '..', 'server', 'pb_hooks', 'pages', 'assets', 'lib.iife.js');
execFileSync('cp', [src, dest], { stdio: 'inherit' });

// Create the dist directory in the root of the project if it doesn't exist
const dist = path.join(__dirname, '..', 'dist');
execFileSync('mkdir', ['-p', dist], { stdio: 'inherit' });

// Check if pb_public exists in the server directory and copy it to dist
const pbPublic = path.join(__dirname, '..', 'server', 'pb_public');
if (fs.existsSync(pbPublic)) {
    execFileSync('cp', ['-r', pbPublic, dist], { stdio: 'inherit' });
}

// Check if pb_hooks exists in the server directory and copy it to dist
const pbHooks = path.join(__dirname, '..', 'server', 'pb_hooks');
if (fs.existsSync(pbHooks)) {
    execFileSync('cp', ['-r', pbHooks, dist], { stdio: 'inherit' });
}

// Check if pb_migrations exists in the server directory and copy it to dist
const pbMigrations = path.join(__dirname, '..', 'server', 'pb_migrations');
if (fs.existsSync(pbMigrations)) {
    execFileSync('cp', ['-r', pbMigrations, dist], { stdio: 'inherit' });
}

// Check if package.json exists in the server directory and copy it to dist
const packageJson = path.join(__dirname, '..', 'server', 'package.json');
if (fs.existsSync(packageJson)) {
    execFileSync('cp', [packageJson, dist], { stdio: 'inherit' });
}

// Print that the build is complete
console.log('Build complete!');