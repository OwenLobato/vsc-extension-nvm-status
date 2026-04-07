const vscode = require('vscode');
const path = require('path');
const os = require('os');
const {
  getInstalledNodeVersions,
  getCurrentVersion,
  getExpectedVersion,
  setActiveVersion,
} = require('./version-detector');

let extensionContext;

function setPickerContext(context) {
  extensionContext = context;
}

async function showVersionPicker() {
  const installedVersions = getInstalledNodeVersions();
  const currentVersion = getCurrentVersion();

  // Get the version requested by the current project
  let projectVersion = null;
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    projectVersion = getExpectedVersion(folders[0].uri.fsPath);
  }

  if (installedVersions.length === 0) {
    vscode.window.showErrorMessage(
      'No Node versions were found. Make sure you have nvm installed.',
    );
    return;
  }

  // Build options with labels
  const options = installedVersions.map((v) => {
    const isCurrent = v === currentVersion;
    const isProject = v === projectVersion;

    // List of tags for the description
    let tags = [];
    if (isCurrent) tags.push('$(tag) Current');
    if (isProject) tags.push('$(star-full) Project requirement');

    return {
      label: `v${v}`,
      description: tags.join('  '),
      versionNumber: v,
      alwaysShow: isProject,
    };
  });

  // Sort so that the project appears at the top if it exists.
  options.sort((a, b) => {
    if (a.description.includes('Project')) return -1;
    if (b.description.includes('Project')) return 1;
    return 0;
  });

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: projectVersion
      ? `Project requires v${projectVersion}. Select a version:`
      : 'Select a Node.js version:',
  });

  if (selection) {
    const selectedVersion = selection.versionNumber;

    if (extensionContext) {
      const nvmBinPath = path.join(
        os.homedir(),
        '.nvm',
        'versions',
        'node',
        `v${selectedVersion}`,
        'bin',
      );
      extensionContext.environmentVariableCollection.prepend(
        'PATH',
        `${nvmBinPath}${path.delimiter}`,
      );

      // Update live terminals
      vscode.window.terminals.forEach((terminal) => {
        terminal.sendText(`nvm use ${selectedVersion}`);
      });

      setActiveVersion(selectedVersion);
      vscode.commands.executeCommand('nvm-status-switch.refreshUI');

      vscode.window.showInformationMessage(
        `Node v${selectedVersion} activated.`,
      );
    }
  }
}

module.exports = {
  showVersionPicker,
  setPickerContext,
};
