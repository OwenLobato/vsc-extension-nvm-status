const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getExpectedVersion(rootPath) {
  // Search option 1) .nvmrc
  const nvmrcPath = path.join(rootPath, '.nvmrc');
  if (fs.existsSync(nvmrcPath)) {
    return fs.readFileSync(nvmrcPath, 'utf8').trim().replace(/^v/, '');
  }

  // Serach option 2) package.json
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

module.exports = {
  getExpectedVersion,
  getCurrentVersion,
};
