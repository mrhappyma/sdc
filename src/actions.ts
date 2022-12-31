import execute from "./execute-command.js";
import inquirer from "inquirer";

const actions: thingToInstall[] = [
  {
    name: "Discord",
    default: false,
    action: async () => {
      const { type } = await inquirer.prompt({
        name: "type",
        type: "list",
        message: "Which Discord release should be installed?",
        choices: [
          { name: "Discord Stable", short: "Stable" },
          { name: "Discord PTB", short: "PTB" },
          { name: "Discord Canary", short: "Canary" },
        ],
      });

      if (type == "Discord Canary") {
        execute(
          "yay -S discord-canary --answerclean NotInstalled --answerdiff None"
        );
      }
      if (type == "Discord PTB") {
        execute(
          "yay -S discord-ptb --answerclean NotInstalled --answerdiff None"
        );
      }
      if (type == "Discord Stable") {
        execute("sudo pacman -S discord --noconfirm");
      }
      return;
    },
  },
  {
    name: "Fig",
    default: false,
    action: () => {
      execute("yay -S fig --answerclean NotInstalled --answerdiff None");
      return;
    },
  },
];

export default actions;
