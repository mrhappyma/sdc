#! /usr/bin/env node

const version = "0.0.8";

import { Option, program } from "commander";
import { addCompletionSpecCommand } from "@fig/complete-commander";
import inquirer from "inquirer";
import ora from "ora";
import fs from "node:fs";
import actions from "./actions.js";
import { setOptions } from "./optionsStore.js";

let endingNotices: string[] = [];
export const addEndingNotice = (notice: string) => {
  endingNotices.push(notice);
};

program
  .name("sdc")
  .description('"setup dominic\'s computer" cli tool')
  .version(version)
  .addOption(new Option("-f, --force", "bypass checks"))
  .addOption(
    new Option(
      "--no-end-clear",
      "skip clearing the console at the end so that output can be viewed"
    )
  )
  .addOption(
    new Option("--debug-options", "print options to console for debugging")
  )
  .addOption(
    new Option("-c, --confirm-commands", "confirm commands before running them")
  )
  .action(async (options) => {
    setOptions(options);
    console.clear();
    if (options.debugOptions) {
      console.log(options);
      return;
    }
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
    if (options.endClear) console.clear();
    ora("Finished! More stuff you have to do:").succeed();
    for (let notice of endingNotices) {
      console.log(notice);
    }
  });

addCompletionSpecCommand(program);

program.parse();
