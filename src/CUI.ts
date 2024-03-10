import { Command } from "commander";
const program = new Command();

// バージョン情報
program.version("0.0.1", "-v, --version");

// hogeコマンド
program
  .command("hoge")
  .description("my first example")
  .action(() => console.log("run hoge command"));

program.parse();