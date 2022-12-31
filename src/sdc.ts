#! /usr/bin/env node

import { Option, program } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import fs from "node:fs";
import actions from "./actions.js";

program
  .name("sdc")
  .description('"setup dominic\'s computer" cli tool')
  .version("0.0.1")
  .addOption(new Option("-f, --force", "bypass checks"))
  .action(async (options) => {
    const checkingSpinner = ora("Checking OS").start();
    let osData;
    if (!options.force) {
      try {
        osData = fs.readFileSync("/etc/os-release", "utf8");
      } catch {
        checkingSpinner.fail("error reading Linux distro info file");
        process.exit(1);
      }

      if (!osData.startsWith("NAME=EndeavourOS")) {
        if (!options.force) {
          checkingSpinner.fail("This is not EndeavorOS!");
          process.exit(1);
        }
      }

      checkingSpinner.succeed("Everything looks good!");
    } else {
      checkingSpinner.warn("You have skipped checks!");
    }

    const { items } = await inquirer.prompt({
      name: "items",
      type: "checkbox",
      message: "Which items should be installed?",
      choices: actions.map((thingToInstall) => ({
        name: thingToInstall.name,
        checked: thingToInstall.default,
      })),
    });

    const { confirm } = await inquirer.prompt({
      name: "confirm",
      type: "confirm",
      message:
        "This will automatically install the above selected items, in that order.",
    });

    if (!confirm) process.exit(0);

    for (let item of items) {
      let data = actions.find((x) => x.name == item);
      if (!data) throw new Error("how did that happen");

      let spinner = ora("Installing " + data.name);

      await data.action();

      spinner.succeed("Installed " + data.name);
    }
  });
program.parse();
