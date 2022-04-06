import { parse } from "@typescript-eslint/typescript-estree";
import flatten from 'flat'

import { IParserOptions, IParsedNode } from "@/interfaces";

export class TSParser {
  static parseExpressionAt(code: string, position: number, options: IParserOptions): IParsedNode {
    const ast = parse(code, options)

    let startPositions: number[] = []
    const flatBody: Record<string, any> = flatten(ast.body)
    const rangeMap = Object.keys(flatBody).reduce<Record<number /* startPosition */, [number, number] /* range */>>(
      (acc, key) => {
        if (key.endsWith('range.0')) {
          const nextKey = key.replace(/.0$/, '.1')
          const range: [number, number] = [flatBody[key], flatBody[nextKey]]
          startPositions.push(range[0])
          acc[range[0]] = range
        } else if (key.endsWith('range.1')) {
          const prevKey = key.replace(/.1$/, '.0')
          const range: [number, number] = [flatBody[prevKey], flatBody[key]]
          startPositions.push(range[0])
          acc[range[0]] = range
        }
        return acc
      }, {})
    
    let foundRange: [number, number] = [0, 0];
    startPositions = startPositions.sort((a, b) => a - b);
    for (let i = 0; i < startPositions.length; i++) {
      const prevStartPosition = i >= 1 ? startPositions[i - 1] : 0
      let startPosition = startPositions[i]
      const nextStartPosition = i <= startPositions.length ? startPositions[i + 1] : 0
      
      if (prevStartPosition <= position && position < startPosition) {
        foundRange = rangeMap[prevStartPosition];
      } else if (position === startPosition) {
        foundRange = rangeMap[startPosition];
      } else if (startPosition < position && position <= nextStartPosition) {
        foundRange = rangeMap[nextStartPosition];
      } else {
        continue
      }
    }

    return {
      start: foundRange[0],
      end: foundRange[1]
    }
  }
}
