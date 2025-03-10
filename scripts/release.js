import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // This will automatically load .env.local

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start by deleting the release directory
const release = path.join(__dirname, '..', 'release');
if (fs.existsSync(release)) {
    execFileSync('rm', ['-rf', release], { stdio: 'inherit' });
}

// Create the release directory in the root of the project if it doesn't exist
execFileSync('mkdir', ['-p', release], { stdio: 'inherit' });

// Check if client directory exists and copy it into release
const client = path.join(__dirname, '..', 'client');
if (fs.existsSync(client)) {
    execFileSync('cp', ['-r', client, release], { stdio: 'inherit' });
}

const excludedClientDir = 'dist';
// Remove excluded directory from the client directory in release
const clientDist = path.join(release, 'client', excludedClientDir);
if (fs.existsSync(clientDist)) {
    execFileSync('rm', ['-rf', clientDist], { stdio: 'inherit' });
}

// Check if server directory exists and copy it into release
const server = path.join(__dirname, '..', 'server');
if (fs.existsSync(server)) {
    execFileSync('cp', ['-r', server, release], { stdio: 'inherit' });
}

const excludedServerFiles = ['pb_hooks/pages/assets/lib.iife.js', 'pocketbase'];
const exclusdedServerDir = ['pb_public', 'pb_data'];

// Remove excluded files from the server directory in release
excludedServerFiles.forEach(file => {
    const filePath = path.join(release, 'server', file);
    if (fs.existsSync(filePath)) {
        execFileSync('rm', ['-rf', filePath], { stdio: 'inherit' });
    }
});

// Remove excluded directories from the server directory in release
exclusdedServerDir.forEach(dir => {
    const dirPath = path.join(release, 'server', dir);
    if (fs.existsSync(dirPath)) {
        execFileSync('rm', ['-rf', dirPath], { stdio: 'inherit' });
    }
});

const includedScripts = ['build.js', 'dev.js', 'preview.js', 'deploy.sh', 'setup.sh', 'update-pocketbase.sh'];
// Copy the included scripts into release/scripts
const scripts = path.join(__dirname, '..', 'scripts');
if (fs.existsSync(scripts)) {
    execFileSync('mkdir', ['-p', path.join(release, 'scripts')], { stdio: 'inherit' });
    includedScripts.forEach(script => {
        execFileSync('cp', [path.join(scripts, script), path.join(release, 'scripts')], { stdio: 'inherit' });
    });
}

// Copy package.json from scripts into release/scripts
const scriptsPackageJson = path.join(__dirname, 'package.json');
if (fs.existsSync(scriptsPackageJson)) {
    execFileSync('cp', [scriptsPackageJson, path.join(release, 'scripts')], { stdio: 'inherit' });
}


// Check if package.json exists in the server directory and copy it to release
const packageJson = path.join(__dirname, '..', 'server', 'package.json');
if (fs.existsSync(packageJson)) {
    execFileSync('cp', [packageJson, release], { stdio: 'inherit' });
}

const includedFiles = ['README.md', 'package.json', '.nvmrc', '.gitattributes', '.gitignore'];
// Copy the included files into release
includedFiles.forEach(file => {
    execFileSync('cp', [path.join(__dirname, '..', file), release], { stdio: 'inherit' });
});

// Copy .github/workflows/deploy.yaml.example into release/.github/workflows as deploy.yaml
const deployYamlExample = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yaml.example');
if (fs.existsSync(deployYamlExample)) {
    execFileSync('mkdir', ['-p', path.join(release, '.github', 'workflows')], { stdio: 'inherit' });
    execFileSync('cp', [deployYamlExample, path.join(release, '.github', 'workflows', 'deploy.yaml')], { stdio: 'inherit' });
}

// Print that the build is complete
console.log('Release complete!');