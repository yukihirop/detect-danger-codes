import { message } from "danger";
import { checkDangerCodes } from "../dist"; 

async function main() {
  message("hello danger");
  checkDangerCodes(/^(?!dangerfile).*.(ts)/, './.ddcrc.js');
}

main()
