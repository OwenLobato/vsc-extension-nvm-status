const vscode = require('vscode');
const { getExpectedVersion, getCurrentVersion } = require('./version-detector');

let statusBarItem;

function initStatusBar(context) {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = 'nvm-status-switch.showPicker';
  context.subscriptions.push(statusBarItem);
  return statusBarItem;
}

function updateStatusBar() {
  const currentVersion = getCurrentVersion();
  const folders = vscode.workspace.workspaceFolders;

  // No workspace detected
  if (!folders) {
    statusBarItem.text = `$(globe) ${currentVersion}`;
    statusBarItem.tooltip = `Global Node version (No workspace opened)`;
    statusBarItem.backgroundColor = undefined;
    statusBarItem.show();
    return;
  }

  const rootPath = folders[0].uri.fsPath;
  const expectedVersion = getExpectedVersion(rootPath);

  if (expectedVersion) {
    if (
      currentVersion.startsWith(expectedVersion) ||
      expectedVersion === currentVersion
    ) {
      // Version match
      statusBarItem.text = `$(tag) ${currentVersion}`;
      statusBarItem.tooltip = `Node version is synchronized with ${expectedVersion}`;
      statusBarItem.backgroundColor = undefined;
    } else {
      // Version mismatch
      const errorMsg = `Project expects Node ${expectedVersion}. Current is ${currentVersion}.`;

      statusBarItem.text = `$(warning) ${currentVersion} (Needs ${expectedVersion})`;
      statusBarItem.tooltip = errorMsg;
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground',
      );

      vscode.window.showWarningMessage(errorMsg);
    }
  } else {
    // Global version (No version expected)
    statusBarItem.text = `$(globe) ${currentVersion}`;
    statusBarItem.tooltip = `Global Node version`;
    statusBarItem.backgroundColor = undefined;
  }

  statusBarItem.show();
}

module.exports = {
  initStatusBar,
  updateStatusBar,
};
