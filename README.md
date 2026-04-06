# NVM Status 🚀

A lightweight Visual Studio Code extension that automatically detects your project's Node.js version from the `.nvmrc` file and displays it in the Status Bar. It also helps you keep your integrated terminal in sync with the required version.

## Features

- **Automatic Detection**: Reads the `.nvmrc` file in your workspace root.
- **Status Bar Widget**: Displays the required Node.js version with a 🚀 icon in the bottom right corner.
- **Visual Alerts**: Highlights the widget when a specific version is required by the project.
- **Terminal Sync**: Automatically sends the `nvm use` command whenever you open a new integrated terminal.

## How it Works

1. The extension looks for a `.nvmrc` file in your open folder.
2. If found, it displays **"Node: [version]"** in the Status Bar.
3. If no file is found, it defaults to showing **"Node: Global"**.
4. When you open a terminal, it waits 1 second for the shell to load and then executes `nvm use` for you.

## Requirements

- **NVM (Node Version Manager)** must be installed on your system.
- For macOS/Linux users, ensure `nvm` is correctly loaded in your `~/.zshrc` or `~/.bashrc`.

## Extension Settings

This extension contributes the following settings:

* `nvm-status-switch.enable`: Enable/disable the status bar widget.

## Known Issues

- Since `nvm` is a shell function and not a binary, the terminal sync requires your default shell to have `nvm` initialized.

## Installation

### From Source
1. Clone this repository.
2. Run `npm install`.
3. Press `F5` to open a Guest window and test the extension.

### Manual Install (.vsix)
1. Download the `.vsix` file from the releases.
2. In VS Code, go to Extensions -> `...` -> **Install from VSIX**.

---

**Developed by Owen Lobato** | Built for developers who switch contexts between projects often.
