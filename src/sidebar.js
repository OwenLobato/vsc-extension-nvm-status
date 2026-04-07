const vscode = require('vscode');
const {
  getInstalledNodeVersions,
  getCurrentVersion,
  getExpectedVersion,
} = require('./version-detector');

class NodeVersionsProvider {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    // If there is no parent element, we paint the root (The categories)
    if (!element) {
      return Promise.resolve(this.getRootNodes());
    }

    // If the user expands "Installed Versions", we display the list
    if (element.id === 'installed-category') {
      return Promise.resolve(this.getInstalledNodes());
    }

    // Other categories don't have children yet
    return Promise.resolve([]);
  }

  getRootNodes() {
    const nodes = [];
    const currentVersion = getCurrentVersion();
    let expectedVersion = null;

    if (this.workspaceRoot) {
      expectedVersion = getExpectedVersion(this.workspaceRoot);
    }

    // Show the version required by the project (if one exists)
    if (expectedVersion) {
      const isMatch =
        currentVersion === expectedVersion ||
        currentVersion.startsWith(expectedVersion);
      const projectItem = new vscode.TreeItem(
        `Project expects: v${expectedVersion}`,
        vscode.TreeItemCollapsibleState.None,
      );
      projectItem.iconPath = new vscode.ThemeIcon(
        isMatch ? 'pass-filled' : 'warning',
      );
      projectItem.contextValue = 'projectVersion';
      nodes.push(projectItem);
    }

    // Show the currently active version
    const activeItem = new vscode.TreeItem(
      `Active: v${currentVersion}`,
      vscode.TreeItemCollapsibleState.None,
    );
    activeItem.iconPath = new vscode.ThemeIcon('tag');
    activeItem.contextValue = 'activeVersion';
    nodes.push(activeItem);

    // Show the collapsible category of "Installed"
    const installedCategory = new vscode.TreeItem(
      'Installed Versions',
      vscode.TreeItemCollapsibleState.Expanded,
    );
    installedCategory.id = 'installed-category';
    installedCategory.iconPath = new vscode.ThemeIcon('versions');
    nodes.push(installedCategory);

    return nodes;
  }

  getInstalledNodes() {
    const installedVersions = getInstalledNodeVersions();
    const currentVersion = getCurrentVersion();

    let expectedVersion = null;
    if (this.workspaceRoot) {
      expectedVersion = getExpectedVersion(this.workspaceRoot);
    }

    return installedVersions.map((v) => {
      const isCurrent = v === currentVersion;
      const isExpected = v === expectedVersion;
      const isMatch = isCurrent && isExpected;

      // Define the label according to priority
      let labelSuffix;
      if (isMatch) {
        labelSuffix = ' (Expected & Current)';
      } else if (isExpected) {
        labelSuffix = ' (Expected)';
      } else if (isCurrent) {
        labelSuffix = ' (Current)';
      } else {
        labelSuffix = '';
      }

      const item = new vscode.TreeItem(
        `v${v}${labelSuffix}`,
        vscode.TreeItemCollapsibleState.None,
      );

      // Icon logic
      if (isMatch) {
        item.iconPath = new vscode.ThemeIcon('pass-filled'); // Current and expected
        item.tooltip = 'Match: This is the active and expected version';
      } else if (isCurrent) {
        item.iconPath = new vscode.ThemeIcon('tag'); // Current
      } else if (isExpected) {
        item.iconPath = new vscode.ThemeIcon('pass'); // Expected
      } else {
        item.iconPath = new vscode.ThemeIcon('dash'); // Installed
      }

      // Add command to change version when click.
      item.command = {
        command: 'nvm-status-switch.applyVersion',
        title: 'Apply Version',
        arguments: [v],
      };

      return item;
    });
  }
}

module.exports = {
  NodeVersionsProvider,
};
