const vscode = require('vscode');

async function showVersionPicker() {
  // TODO: Replace these with the ones installed using NVM
  const options = [
    { label: '18.19.1', description: 'Global Default' },
    { label: '12.21.0', description: 'Project Requirement' },
  ];

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: 'Select a Node.js version to switch to',
  });

  if (selection) {
    vscode.window.showInformationMessage(
      `Switching to Node v${selection.label}...`,
    );
  }
}

module.exports = {
  showVersionPicker,
};
