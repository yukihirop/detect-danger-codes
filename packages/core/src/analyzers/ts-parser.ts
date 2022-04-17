import { parse } from "@typescript-eslint/typescript-estree";
import flatten from 'flat'

import { IParserOptions, IParsedNode } from "@/interfaces";

type Range = [number, number]
type RangeMap = {
  [startPostion: number]: {
    [rangeLength: number]: Range
  }
}
export class TSParser {
  static parseExpressionAt(code: string, position: number, inputLineVSPos: number[], options: IParserOptions): IParsedNode {
    const ast = parse(code, options)

    let startPositions: number[] = []
    const flatBody: Record<string, any> = flatten(ast.body)
    const rangeMap = Object.keys(flatBody).reduce<RangeMap>((acc, key) => {
      if (key.endsWith("range.0")) {
        const nextKey = key.replace(/.0$/, ".1");
        const range: [number, number] = [flatBody[key], flatBody[nextKey]];
        const rangeLen = range[1] - range[0];
        startPositions.push(range[0]);
        if (acc[range[0]]) {
          acc[range[0]][rangeLen] = range
        } else {
          acc[range[0]] = { [rangeLen]: range }
        }
      } else if (key.endsWith("range.1")) {
        const prevKey = key.replace(/.1$/, ".0");
        const range: [number, number] = [flatBody[prevKey], flatBody[key]];
        const rangeLen = range[1] - range[0];
        startPositions.push(range[0]);
        if (acc[range[0]]) {
          acc[range[0]][rangeLen] = range;
        } else {
          acc[range[0]] = { [rangeLen]: range };
        }
      }
      return acc;
    }, {});
    
    startPositions = startPositions.sort((a, b) => a - b);

    let startPositionInLine = position
    for (let i = 0; i < inputLineVSPos.length; i++) {
      if (inputLineVSPos[i] <= position && position < inputLineVSPos[i + 1]) {
        startPositionInLine = inputLineVSPos[i]
      } else {
        continue
      }
    }

    const foundRange = this.#searchMaxRange(position, startPositionInLine, rangeMap)

    if (foundRange[0] === 0 && foundRange[1] === 0) {
      return {
        start: foundRange[0],
        end: foundRange[1],
      }
    } else {
      //  ↓ foundRange[0]
      //  ↓              ↓ position
      //  ↓              ↓
      // '[...Array(10)].map<any[]>((_, index) => {\n' +
      // '      return Task.create([\n' +
      // '        {\n' +
      // '          title: `title_${index}` as string,\n' +
      // '          content: `content_${index}` as string,\n' +
      // '        },\n' +
      // '      ]);\n' +
      // '    })',
      //        ↑
      //        ↑ foundRange[0]

      return {
        start: position,
        end: foundRange[1],
      };
    }
  }

  static #searchMaxRange(position: number, startPositionInLine: number, rangeMap: RangeMap): Range {
    const defaultRange: Range = [0, 0]
    const startPostions = Object.keys(rangeMap).map(Number)
    const searchTargetStartPositions = startPostions.reduce<number[]>((acc, currentPos) => {
      if (startPositionInLine <= currentPos && currentPos <= position) {
        acc.push(currentPos)
      }
      return acc
    }, [])

    let foundstartPosition = position
    let foundMaxLen = 0
    searchTargetStartPositions.forEach(key => {
      const newMaxLen = Math.max(...Object.keys(rangeMap[key]).map(Number));
      if (foundMaxLen < newMaxLen) {
        foundstartPosition = key;
        foundMaxLen = newMaxLen;
      }
    })

    if (rangeMap[foundstartPosition]) {
      return rangeMap[foundstartPosition][foundMaxLen];
    } else {
      return defaultRange
    }
  }
}
