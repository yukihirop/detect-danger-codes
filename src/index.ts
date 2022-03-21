import { Parser, Options } from "acorn";
import * as fs from 'fs'

import { ISourceCodeWithPosition } from '@/interfaces'
import { Analyzer } from "./analyzer";

/**
 * @see https://npmdoc.github.io/node-npmdoc-acorn/build/apidoc.html
 */

const acornOpions: Options = {
  ecmaVersion: 2022,
  locations: true
}

const js = fs.readFileSync('./examples/js/simple.js', { encoding: 'utf-8' })
const targetIterator = "map"
const analyzer = new Analyzer(js)
const sourcePosition = analyzer.sourcePositionAt(targetIterator);
sourcePosition.forEach((item) => {
  const parsedAt = Parser.parseExpressionAt(js, item.start, acornOpions);
  const { start, end } = parsedAt
  const result: ISourceCodeWithPosition = {
    target: targetIterator,
    code: js.substring(start, end),
    line: item.line,
    start,
    end,
    offset: item.offset,
  };
  console.log(result);
})
