import execute from "./execute-command.js";
import inquirer from "inquirer";
import { addEndingNotice } from "./sdc.js";

const actions: thingToInstall[] = [
  {
    name: "Discord",
    default: true,
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
        execute("yay -S discord-canary --sudoloop --noconfirm");
      }
      if (type == "Discord PTB") {
        execute("yay -S discord-ptb --sudoloop --noconfirm");
      }
      if (type == "Discord Stable") {
        execute("sudo pacman -S discord --noconfirm");
      }
      return;
    },
  },
  {
    name: "Fig",
    default: true,
    action: () => {
      execute("yay -S fig --sudoloop --noconfirm");
      addEndingNotice(
        "Finish setting up fig: `fig login` and `fig plugins sync`"
      );
      return;
    },
  },
  {
    name: "Node.js",
    default: false,
    action: async () => {
      const { version } = await inquirer.prompt({
        name: "version",
        type: "list",
        message: "Which Node.js version should be installed?",
        choices: [
          {
            name: 'Node.js 14.X LTS "fermium"',
            short: "14.X",
            value: "nodejs-lts-fermium ",
          },
          {
            name: 'Node.js 16.X LTS "gallium"',
            short: "16.X",
            value: "nodejs-lts-gallium",
          },
          {
            name: 'Node.js 18.X LTS "hydrogen"',
            short: "18.X",
            value: "nodejs-lts-hydrogen",
          },
          { name: "latest", value: "nodejs" },
        ],
      });

      execute(`sudo pacman -S ${version} --noconfirm`);
      return;
    },
  },
  {
    name: "zsh",
    default: true,
    action: async () => {
      execute("sudo pacman -S zsh --noconfirm");
      // const { makeDefaultShell } = await inquirer.prompt({
      //   name: "makeDefaultShell",
      //   type: "confirm",
      //   message: "Make zsh the default shell?",
      // });
      // if (makeDefaultShell) execute("chsh -s /usr/bin/zsh");
      // this wasn't working for some reason
      addEndingNotice("Set zsh as the default shell: `chsh -s /usr/bin/zsh`");
      return;
    },
  },
  {
    name: "pnpm",
    default: true,
    action: () => {
      execute("wget -qO- https://get.pnpm.io/install.sh | sh -");
      addEndingNotice(
        "If this script wasn't running in zsh, do that again in zsh so that it adds stuff to .zshrc"
      );
      return;
    },
  },
];

export default actions;
