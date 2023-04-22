// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "pyobjectify" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("pyobjectify.create", function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("PyObjectify as activated!");
    // * Prompt the user for the name of the object they want to create
    vscode.window.showInputBox({ prompt: "Enter the name of the Python object, and attributes that you want to create. Example: Object attribute1 attribute2" }).then(function (objectItems) {
      // Generate the Python code to create the object
      const ObjectName = objectItems.split(" ")[0];
      const ObjectAttributes = objectItems.split(" ").slice(1);
      let code = `class ${ObjectName}:\n`;
      code += `  def __init__(self):\n`;
      ObjectAttributes.map((attribute) => {
        code += `    self.${attribute} = ""\n`;
      });
      code += `  def set(self,obj_json):\n`;
      code += `    if not isinstance(obj_json, dict):\n`;
      code += `      raise TypeError("obj_json must be a dictionary")\n`;

      ObjectAttributes.map((attribute) => {
        code += `    self.${attribute} = obj_json.get("${attribute}", self.${attribute})\n`;
      });

      code += `  def to_json(self):\n`;
      code += `    return  {`;
      ObjectAttributes.map((attribute, key) => {
        if (key != ObjectAttributes.length - 1) {
          code += `"${attribute}": self.${attribute},`;
        } else {
          code += `"${attribute}": self.${attribute}}\n\n`;
        }
      });

      // Insert the code into the editor
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit(function (editBuilder) {
          editBuilder.insert(editor.selection.active, code);
        });
      }
    });
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
