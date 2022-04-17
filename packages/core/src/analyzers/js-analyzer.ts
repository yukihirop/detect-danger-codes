import acorn, { Parser, Options } from "acorn";
import * as fs from "fs";
import path from "path";

import {
  ISourcePosition,
  ISourcePositionWithCode,
  IConfig,
  TSourcePositionMatches,
  ISourcePositionMatch,
  TSourcePositionMatchInfo,
  TSourcePositionWithCodeMap,
  IAnalyzer,
} from "@/interfaces";

/**
 * @see https://npmdoc.github.io/node-npmdoc-acorn/build/apidoc.html
 */

const acornOpions: Options = {
  ecmaVersion: 2022,
  locations: true,
};

export class JSAnalyzer implements IAnalyzer {
  protected config: IConfig;
  protected parseExpressionAt: (
    input: string,
    position: number,
    inputLineVSPos: number[]
  ) => any;

  #NEW_LINE_COUNT = 1;
  #SPACE = "";
  #RESERVED_CODES = ["await", "async"];

  constructor(config: IConfig) {
    this.config = config;
    this.parseExpressionAt = (
      input: string,
      position: number,
      _inputLineVSPos: number[]
    ) => Parser.parseExpressionAt(input, position, acornOpions) as acorn.Node;
  }

  public analyze(filepath: string): TSourcePositionWithCodeMap {
    const matches = this.config.matches;
    const input = fs.readFileSync(filepath, { encoding: "utf-8" });

    /**
     * Cumulative sum of each line of input
     */
    const inputArr = input.split("\n");
    const inputLineVSPos: number[] = new Array(inputArr.length).fill(0);
    inputLineVSPos[0] = inputArr[0].length + 1 /* \n */;
    for (let i = 1; i < inputArr.length; i++) {
      inputLineVSPos[i] =
        inputArr[i].length + inputLineVSPos[i - 1] + 1 /* \n */;
    }

    const sourcePositionMap = this.sourcePositionAt(
      input,
      matches,
      inputLineVSPos
    );

    return Object.keys(sourcePositionMap).reduce<TSourcePositionWithCodeMap>(
      (acc, key) => {
        const sourcePosition = sourcePositionMap[key];
        const sorcePositionWithCodes = sourcePosition.reduce<
          ISourcePositionWithCode[]
        >((childAcc, item) => {
          let parsedAt = this.parseExpressionAt(
            input,
            item.startPosition + item.offsetPosition,
            inputLineVSPos
          );

          let { start, end } = parsedAt;
          let code = input.substring(start, end);

          if (this.#RESERVED_CODES.includes(code)) {
            const awaitOrAsync = code;
            parsedAt = this.parseExpressionAt(
              input,
              item.startPosition + item.offsetPosition,
              []
            );
            end = parsedAt.end;
            code =
              awaitOrAsync +
              " " +
              input.substring(parsedAt.start, parsedAt.end);
          }

          const matchInfoValues = Object.values(item.matchInfo)
          const matchInfoLines = matchInfoValues.reduce<number[]>((acc, item) => {
            if (item.line) {
              acc.push(item.line)
            }
            return acc
          }, [])
          const matchLine = Math.max(...matchInfoLines)

          const result: ISourcePositionWithCode = {
            filepath: path.resolve(process.cwd(), filepath),
            code,
            match: item.match,
            matchInfo: item.matchInfo,
            startLine: item.startLine,
            matchLine,
            endLine: item.startLine + code.split('\n').length,
            startPosition: start,
            endPosition: end,
            offsetPosition: item.offsetPosition,
          };

          childAcc.push(result);
          return childAcc;
        }, []);
        acc[key] = sorcePositionWithCodes;
        return acc;
      },
      {}
    );
  }

  private sourcePositionAt(
    input: string,
    matches: TSourcePositionMatches,
    inputLineVSPos: number[]
  ): Record<string /* match identifier (key) */, ISourcePosition[]> {
    return Object.keys(matches).reduce<Record<string, ISourcePosition[]>>(
      (acc, key) => {
        const result = this.sourcePositionAtByPattern(
          input,
          matches[key],
          inputLineVSPos
        );
        acc[key] = result;
        return acc;
      },
      {}
    );
  }

  private sourcePositionAtByPattern(
    input: string,
    match: ISourcePositionMatch,
    inputLineVSPos: number[]
  ): ISourcePosition[] {
    /**
     * Offset when matching or matching
     */
    let isMatch = false;
    let currentPos = 0;
    const matchInfo: TSourcePositionMatchInfo = {};
    for (const pattern of match.pattern) {
      let result: number = -1;
      if (typeof pattern === "string") {
        result = input.indexOf(pattern, currentPos);
      } else {
        result = input.search(pattern);
      }

      if (result === -1) {
        isMatch = false;
        break;
      } else {
        currentPos = result;
        matchInfo[pattern.toString()] = { position: currentPos };
        isMatch = true;
      }
    }

    if (!isMatch) return [];

    /**
     * Identify the number of lines from position
     */
    Object.keys(matchInfo).forEach((key) => {
      const pos = matchInfo[key].position;
      const line = this.lineBy(pos, inputLineVSPos);
      matchInfo[key].line = line;
    });

    const inputArr = input.split("\n");
    let currentEndPosition = 0;
    return inputArr.reduce<ISourcePosition[]>((acc, item, index) => {
      const target = match.pattern[0];

      let startIndex = -1;
      if (typeof target === "string") {
        startIndex = item.indexOf(target);
      } else {
        startIndex = item.search(target);
      }

      if (item === this.#SPACE) {
        currentEndPosition += this.#NEW_LINE_COUNT;
      } else {
        const isInclude = startIndex != -1;
        if (isInclude) {
          acc.push({
            match,
            matchInfo,
            startLine: index + 1,
            startPosition: currentEndPosition,
            endPosition:
              currentEndPosition + item.length + this.#NEW_LINE_COUNT,
            offsetPosition: startIndex,
          });
        }
        currentEndPosition += item.length + this.#NEW_LINE_COUNT;
      }
      return acc;
    }, []);
  }

  private lineBy(
    pos: number,
    lineVsEndPos: number[]
  ): number /* line number */ {
    let currentLine = 0;
    for (let i = 0; i <= lineVsEndPos.length; i++) {
      if (lineVsEndPos[i] <= pos && pos <= lineVsEndPos[i + 1]) {
        currentLine = i + 1 /* 「1」 is next line */;
        break;
      } else {
        continue;
      }
    }
    return currentLine + 1;
  }
}
