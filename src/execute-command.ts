import shell from "shelljs";

function execute(command: string) {
  console.log(command);
  shell.exec(command);
}

export default execute;
