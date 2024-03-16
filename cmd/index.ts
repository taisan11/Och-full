import { Command } from "commander";
import { init } from "./init";
const program = new Command();

// 基本情報
program
  .version("0.0.1", "-v, --version")
  .name("Och-CLI")
  .description("Och-CLI is a CLI tool for Och");

// hogeコマンド
program
  .command("init")
  .description("internal Och")
  .argument("[path]", "インストール先のパス")
  .action((path) => init(path));

// program
//   .argument("<server>", "connect to the specified server")
//   .argument("[user]", "user account for connection", "guest")
//   .description("Example program with argument descriptions")
//   .action((server, user) => {
//     console.log("server:", server);
//     console.log("user:", user);
//   });

program.parse();

// console.log(program.args);
