import { message, warn } from "danger";
import { checkDangerCodes } from "../dist"; 

async function main() {
  message("hello danger");
  const result = await checkDangerCodes("./.ddcrc.js", 
    '!dangerfile.ts',
    '!**/*.test.ts',
    '**/*.{js,ts}'
  );
  result.forEach(({ key, filepath, line }) => {
    if (key === "maybeHeabyQuery") {
      warn(
        `${filepath}#${line} - May temporarily sleep waiting for processing when heavy queries are executed`
      );
    }
  })
}

main()
