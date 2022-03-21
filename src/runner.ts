import { Parser, Options } from "acorn";
import * as fs from 'fs'

import { ISourceCodeWithPosition, IConfig } from '@/interfaces'
import { Analyzer } from "./analyzer";

/**
 * @see https://npmdoc.github.io/node-npmdoc-acorn/build/apidoc.html
 */

const acornOpions: Options = {
  ecmaVersion: 2022,
  locations: true
}

export const run = (filepath: string, config: IConfig): ISourceCodeWithPosition[] => {
  const js = fs.readFileSync(filepath, { encoding: "utf-8" });
  const targetIterator = config.iterators[0];
  const analyzer = new Analyzer(js);
  const sourcePosition = analyzer.sourcePositionAt(targetIterator);
  return sourcePosition.reduce((acc, item) => {
    const parsedAt = Parser.parseExpressionAt(js, item.start, acornOpions);
    const { start, end } = parsedAt;
    const result: ISourceCodeWithPosition = {
      target: targetIterator,
      code: js.substring(start, end),
      line: item.line,
      start,
      end,
      offset: item.offset,
    };
    acc.push(result);
    return acc;
  }, [] as ISourceCodeWithPosition[]);
};
