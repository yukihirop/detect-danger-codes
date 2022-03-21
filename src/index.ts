import { getLineInfo, Parser, Options } from "acorn";
import * as fs from 'fs'

import { Analyzer } from "./analyzer";

const acornOpions: Options = {
  ecmaVersion: 2022,
  locations: true
}

const js = fs.readFileSync('./examples/js/simple.js', { encoding: 'utf-8' })
const parsed = Parser.parse(js, acornOpions);
// console.log({ parsed, start: parsed.start, end: parsed.end })
// console.log({ body: parsed.body })

const parsedAt = Parser.parseExpressionAt(js, 259, acornOpions);
console.log(parsedAt);
console.log(Object.keys(parsedAt));

const lineInfo = getLineInfo(js, 2)
// console.log({js, lineInfo})

const tokenizer = Parser.tokenizer(js, acornOpions)
// console.log(tokenizer.getToken())

const analyzer = new Analyzer(js)
console.log({
  info: analyzer.sourcePositionAt("Promise.all"),
});
