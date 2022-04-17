import { message, warn } from "danger";
import { checkDangerCodes } from "../dist"; 

async function main() {
  message("hello danger");
  const result = await checkDangerCodes(/^(?!dangerfile).*\.(ts)/, './.ddcrc.js');
  result.forEach(({ key, filepath, line }) => {
    if (key === "maybeHeabyQuery") {
      warn(
        `${filepath}#${line} - May temporarily sleep waiting for processing when heavy queries are executed`
      );
    }
  })
}

main()
