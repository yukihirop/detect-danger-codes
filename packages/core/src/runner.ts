import path from 'path'

import { ISourceCodeWithPosition, IConfig } from '@/interfaces'
import { JSAnalyzer } from "./analyzers";
import { validateConfig } from './validator'

const Extname = {
  JS: '.js'
}

export const run = (filepath: string, config: IConfig): ISourceCodeWithPosition[] => {
  const { result, message } = validateConfig(config)
  if(!result) throw message

  const extname = path.extname(filepath)
  if (extname === Extname.JS) {
    return new JSAnalyzer(config).analyze(filepath);
  } else {
    throw `[ddc] Do not support typescript: ${filepath}`
  }
};
