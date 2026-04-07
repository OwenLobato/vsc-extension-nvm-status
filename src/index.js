const vscode = require('vscode');
const { initStatusBar, updateStatusBar } = require('./status-bar');
const { showVersionPicker, setPickerContext } = require('./picker');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('🚀 NVM Status Switch: Starting activation...');

  try {
    initStatusBar(context);
    setPickerContext(context);

    // Register showPicker Command
    const pickerCommand = vscode.commands.registerCommand(
      'nvm-status-switch.showPicker',
      async () => {
        await showVersionPicker();
      },
    );

    // Register refreshUI Command
    const refreshCommand = vscode.commands.registerCommand(
      'nvm-status-switch.refreshUI',
      () => {
        updateStatusBar();
      },
    );

    // Commands subscriptions
    context.subscriptions.push(pickerCommand);
    context.subscriptions.push(refreshCommand);

    // Register events (Change tab & Open folders)
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
    );
    context.subscriptions.push(
      vscode.workspace.onDidChangeWorkspaceFolders(updateStatusBar),
    );

    // Initial activation
    updateStatusBar();

    console.log('✅ NVM Status Switch: Activation completed successfully.');
  } catch (error) {
    console.error('❌ NVM Status Switch: Error during activation:', error);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
