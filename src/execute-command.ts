import { exec } from "child_process";
import shell from "shelljs";

function execute(command: string) {
  shell.exec(command);
}

export default execute;
