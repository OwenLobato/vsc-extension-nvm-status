const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Internal memory of the extension
let activeVersionOverride = null;

function setActiveVersion(version) {
  activeVersionOverride = version;
}

function getExpectedVersion(rootPath) {
  // Search option 1) .nvmrc
  const nvmrcPath = path.join(rootPath, '.nvmrc');
  if (fs.existsSync(nvmrcPath)) {
    return fs.readFileSync(nvmrcPath, 'utf8').trim().replace(/^v/, '');
  }

  // Search option 2) package.json
  const pkgPath = path.join(rootPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg?.engines?.node) {
        // Extract only the numbers
        return pkg.engines.node.replace(/[^\d.]/g, '');
      }
    } catch (e) {
      console.error('Error reading package.json', e);
    }
  }

  return null;
}

function getCurrentVersion() {
  // Use the version the user just selected from the menu
  if (activeVersionOverride) {
    return activeVersionOverride;
  }

  try {
    // Run 'node -v' on the user's system
    // Use a shell to read the environment variables correctly
    const version = execSync('node -v', { encoding: 'utf8', shell: true });
    return version.trim().replace(/^v/, '');
  } catch (error) {
    console.error('Could not execute node -v on system:', error);
    // Fallback to the VS Code version if something goes wrong
    return process.version.replace(/^v/, '');
  }
}

function getInstalledNodeVersions() {
  try {
    const nvmVersionsPath = path.join(os.homedir(), '.nvm', 'versions', 'node');
    if (fs.existsSync(nvmVersionsPath)) {
      const versions = fs
        .readdirSync(nvmVersionsPath)
        .filter((dir) => dir.startsWith('v'))
        .map((dir) => dir.replace(/^v/, ''));

      return versions.sort((a, b) =>
        b.localeCompare(a, undefined, { numeric: true }),
      );
    }
  } catch (e) {
    console.error('Error reading nvm directory', e);
  }
  return [];
}

module.exports = {
  getExpectedVersion,
  getCurrentVersion,
  getInstalledNodeVersions,
  setActiveVersion,
};
