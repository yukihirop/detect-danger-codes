import path from 'path'

import { ISourceCodeWithPosition, IConfig } from '@/interfaces'
import { JSAnalyzer, TSAnalyzer } from "./analyzers";
import { validateConfig } from './validator'

const Extname = {
  JS: '.js',
  TS: '.ts'
}

export const run = (filepath: string, config: IConfig): ISourceCodeWithPosition[] => {
  const { result, message } = validateConfig(config)
  if(!result) throw message

  const extname = path.extname(filepath)
  if (extname === Extname.JS) {
    return new JSAnalyzer(config).analyze(filepath);
  } else if (extname === Extname.TS) { 
    return new TSAnalyzer(config).analyze(filepath);
  } else {
    throw `[ddc] Do not support ${extname}: ${filepath}`
  }
};
