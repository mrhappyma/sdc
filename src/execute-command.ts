import shell from "shelljs";
import inquirer from "inquirer";
import { getOptions } from "./optionsStore.js";

const execute = async (command: string) => {
  if (getOptions().confirmCommands) {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Run command: ${command}`,
      },
    ]);
    if (!confirm) {
      console.log("Command not confirmed");
      return;
    }
  }
  shell.exec(command);
};

export default execute;
