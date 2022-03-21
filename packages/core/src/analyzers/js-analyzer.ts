import { Parser, Options } from "acorn";

import { ISourcePosition, ISourceCodeWithPosition, IConfig } from "@/interfaces";

/**
 * @see https://npmdoc.github.io/node-npmdoc-acorn/build/apidoc.html
 */

const acornOpions: Options = {
  ecmaVersion: 2022,
  locations: true
}

export class JSAnalyzer {
  private input: string;
  private config: IConfig;

  #NEW_LINE_COUNT = 1
  #SPACE = ''
  #RESERVED_CODES = ['await', 'async']

  constructor(config: IConfig) {
    this.config = config;
  }

  public analyze(input: string): ISourceCodeWithPosition[] {
    const target = this.config.target[0]
    const sourcePosition = this.sourcePositionAt(input, target)
    return sourcePosition.reduce((acc, item) => {
      let parsedAt = Parser.parseExpressionAt(input, item.start, acornOpions);
      const { start, end } = parsedAt;
      let code = input.substring(start, end)

      if (this.#RESERVED_CODES.includes(code)) {
        const awaitOrAsync = code
        parsedAt = Parser.parseExpressionAt(input, item.start + item.offset, acornOpions)
        code = awaitOrAsync + ' ' + input.substring(parsedAt.start, parsedAt.end)
      }

      const result: ISourceCodeWithPosition = {
        target,
        code,
        line: item.line,
        start,
        end,
        offset: item.offset,
      };
      acc.push(result);
      return acc;
    }, [] as ISourceCodeWithPosition[]);
  }

  private sourcePositionAt(input: string, target: string): ISourcePosition[] {
    const inputArr = input.split('\n')
    
    let currentEndPosition = 0
    return inputArr.reduce((acc, item, index) => {
      const startIndex = item.indexOf(target)
      if (item === this.#SPACE) {
        currentEndPosition += this.#NEW_LINE_COUNT;
      } else {
        const isInclude = startIndex != -1;
        if (isInclude) {
          acc.push({
            target: target,
            line: index + 1,
            start: currentEndPosition,
            end: currentEndPosition + item.length + this.#NEW_LINE_COUNT,
            offset: startIndex,
          });
        }
        currentEndPosition += item.length + this.#NEW_LINE_COUNT;
      }
      return acc
    }, [] as ISourcePosition[])
  }
}
