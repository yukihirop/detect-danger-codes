import path from 'path'

import { TSourcePositionWithCodeMap, IConfig } from '@/interfaces'
import { JSAnalyzer, TSAnalyzer } from "./analyzers";
import { validateConfig } from './validator'

const Extname = {
  JS: '.js',
  TS: '.ts'
}

export const run = (filepath: string, config: IConfig): TSourcePositionWithCodeMap => {
  const validationResult = validateConfig(config);
  Object.keys(validationResult).forEach(key => {
    const { result, message } = validationResult[key];
    if (!result) throw message;
  })

  const extname = path.extname(filepath);
  if (extname === Extname.JS) {
    return new JSAnalyzer(config).analyze(filepath);
  } else if (extname === Extname.TS) {
    return new TSAnalyzer(config).analyze(filepath);
  } else {
    throw `[ddc] Do not support ${extname}: ${filepath}`;
  }
};
