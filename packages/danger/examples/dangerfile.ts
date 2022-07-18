import { warn } from "danger";
import { checkDangerCodes } from "../dist"; 

async function main() {
  const result = await checkDangerCodes("./.ddcrc.js", 
    '!dangerfile.ts',
    '!**/*.test.ts',
    '**/*.{js,ts}'
  );
  result.forEach(({ key, filepath, line, description }) => {
    if (key === "maybeHeavyQuery") {
      warn(`
[ddc|${key}] 🤖 ${description}
既に退会したユーザーに関するレコードまで取得するようになっていて処理が重くなりお客さんに迷惑をかけたことがありました。
不必要なレコードを取得しないようにクエリを工夫しましょう。`,
        filepath,
        line
      );
    }
  })
}

main()
