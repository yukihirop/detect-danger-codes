import { ISourcePosition } from "@/interfaces";

export class Analyzer {
  private input: string;

  #NEW_LINE_COUNT = 1
  #SPACE = ''

  constructor(input: string) {
    this.input = input;
  }

  public sourcePositionAt(partial: string): ISourcePosition[] {
    const inputArr = this.input.split('\n')
    
    let currentEndPosition = 0
    return inputArr.reduce((acc, item, index) => {
      const startIndex = item.indexOf(partial)
      if (item === this.#SPACE) {
        currentEndPosition += this.#NEW_LINE_COUNT;
      } else {
        const isInclude = startIndex != -1;
        if (isInclude) {
          acc.push({
            target: partial,
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
