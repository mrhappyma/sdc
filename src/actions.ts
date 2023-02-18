import execute from "./execute-command.js";
import inquirer from "inquirer";
import { addEndingNotice } from "./sdc.js";
import shell from "shelljs";

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
          { name: "Discord Stable", short: "Stable", value: "stable" },
          { name: "Discord PTB", short: "PTB", value: "ptb" },
          { name: "Discord Canary", short: "Canary", value: "canary" },
        ],
      });
      if (type == "stable") {
        await await execute("sudo pacman -S discord --noconfirm");
      } else {
        await execute(`yay -S discord-${type} --sudoloop --noconfirm`);
      }

      const { replugged } = await inquirer.prompt({
        name: "replugged",
        message: "Install replugged?",
        type: "confirm",
      });
      if (replugged) {
        if (!shell.which("pnpm")) throw new Error("Requires pnpm!");
        await await execute(
          "git clone https://github.com/replugged-org/replugged.git ~/replugged"
        );
        await await execute("(cd ~/replugged && pnpm i)");
        await await execute("(cd ~/replugged && pnpm build)");
        await await execute(`(cd ~/replugged && pnpm plug ${type})`);
        addEndingNotice("make sure replugged installed correctly");
      }
      return;
    },
  },
  {
    name: "Fig",
    default: true,
    action: async () => {
      await execute("yay -S fig --sudoloop --noconfirm");
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

      await await execute(`sudo pacman -S ${version} --noconfirm`);
      return;
    },
  },
  {
    name: "zsh",
    default: true,
    action: async () => {
      await execute("sudo pacman -S zsh --noconfirm");
      // const { makeDefaultShell } = await inquirer.prompt({
      //   name: "makeDefaultShell",
      //   type: "confirm",
      //   message: "Make zsh the default shell?",
      // });
      // if (makeDefaultShell) await execute("chsh -s /usr/bin/zsh");
      // this wasn't working for some reason
      addEndingNotice("Set zsh as the default shell: `chsh -s /usr/bin/zsh`");
      return;
    },
  },
  {
    name: "pnpm",
    default: true,
    action: async () => {
      await execute("wget -qO- https://get.pnpm.io/install.sh | sh -");
      addEndingNotice(
        "If this script wasn't running in zsh, do that again in zsh so that it adds stuff to .zshrc"
      );
      return;
    },
  },
  {
    name: "VS Code",
    default: true,
    action: async () => {
      const { version } = await inquirer.prompt({
        name: "version",
        message: "Which VS Code?",
        type: "list",
        default: "code-oss",
        choices: [
          {
            name: '"Code - OSS" official Arch Linux open-source release. Open VSX.',
            value: "code",
            short: '"Code - OSS"',
          },
          {
            name: "Microsoft proprietary release",
            value: "visual-studio-code-bin",
            short: "Microsoft standard version",
          },
          {
            name: "Microsoft proprietary release - insiders",
            value: "visual-studio-code-insiders-bin",
            short: "Microsoft insiders version",
          },
          {
            name: "VSCodium - Community open-source release. No telemetry. Open VSX.",
            short: "VSCodium",
            value: "vscodium",
          },
        ],
      });

      addEndingNotice("Sign into VSCode");

      if (version == "code") {
        await execute("sudo pacman -S code --noconfirm");
        return;
      } else {
        await execute(`yay -S ${version} --sudoloop --noconfirm`);
        return;
      }
    },
  },
  {
    name: "gh cli",
    default: true,
    action: async () => {
      await execute("sudo pacman -S github-cli --noconfirm");
      addEndingNotice("Set up gh cli");
      addEndingNotice("Set up commit signing");
      return;
    },
  },
  {
    name: "Tilix",
    default: true,
    action: async () => {
      await execute("sudo pacman -S tilix --noconfirm");
      const { dracula } = await inquirer.prompt({
        name: "dracula",
        type: "confirm",
        message: "Install the dracula theme?",
      });
      if (dracula) {
        await execute("mkdir ~/.config/tilix");
        await execute("mkdir ~/.config/tilix/schemes");
        await execute(
          "(cd ~/.config/tilix/schemes && curl -O https://raw.githubusercontent.com/dracula/tilix/master/Dracula.json)"
        );
        addEndingNotice("Set Tilix theme");
      }
      return;
    },
  },
];

export default actions;
