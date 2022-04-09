import { JSAnalyzer } from './js-analyzer'
import { TSParser } from './ts-parser'
import { IConfig, IParsedNode } from "@/interfaces";
export class TSAnalyzer extends JSAnalyzer {
  constructor(config: IConfig) {
    super(config);
    this.config = config;
    this.parseExpressionAt = (
      input: string,
      position: number,
      inputLineVSPos: number[]
    ) =>
      TSParser.parseExpressionAt(input, position, inputLineVSPos, {
        loc: true,
        range: true,
      }) as IParsedNode;
  }
}
