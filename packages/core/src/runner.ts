import { Parser, Options } from "acorn";
import * as fs from 'fs'
import path from 'path'

import { ISourceCodeWithPosition, IConfig } from '@/interfaces'
import { JSAnalyzer } from "./analyzers";

const Extname = {
  JS: '.js'
}

export const run = (filepath: string, config: IConfig): ISourceCodeWithPosition[] => {
  const extname = path.extname(filepath)

  if (extname === Extname.JS) {
    const input = fs.readFileSync(filepath, { encoding: "utf-8" });
    return new JSAnalyzer(config).analyze(input)
  } else {
    console.error(`do not support typescript: ${filepath}`)
  }
};
