#!/usr/bin/env node

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDirectory = process.argv[2];

if (!targetDirectory) {
    // Assume the target directory is the current working directory
    targetDirectory = process.cwd();
}

// Downlaod the latest release asset (zip) from the GitHub repository (ivy242-net/ivy242-starter)
const releaseUrl = 'https://api.github.com/repos/ivy242-net/ivy242-starter/releases/latest';
const release = JSON.parse(execFileSync('curl', [releaseUrl], { stdio: 'pipe' }));
const asset = release.assets.find(asset => asset.name.endsWith('.zip'));
const assetUrl = asset.browser_download_url;
const assetName = path.basename(assetUrl);
const assetPath = path.join(__dirname, assetName);

execFileSync('curl', ['-L', '-o', assetPath, assetUrl], { stdio: 'inherit' });

// Unzip the asset into the target directory
execFileSync('unzip', [assetPath, '-d', targetDirectory], { stdio: 'inherit' });

// Remove the downloaded asset
fs.unlinkSync(assetPath);

console.log('Download and extraction complete! Initiating setup...');

// cd into the target directory and run npm run setup
execFileSync('npm', ['run', 'setup'], { stdio: 'inherit', cwd: targetDirectory });

