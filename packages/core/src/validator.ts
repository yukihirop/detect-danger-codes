import { IConfig, TValidationMap } from '@/interfaces'

const WHITE_SPACE = ' '

export const validateConfig = (config: IConfig): TValidationMap => {
  return Object.keys(config.matches).reduce<TValidationMap>((acc, key) => {
    const match = config.matches[key];
    const isValidMap = match.pattern.reduce<Record<string, { result: boolean, message: string | null }>>((acc, item) => {
      if (typeof item === 'string') {
        acc[item] = {
          result: !item.includes(WHITE_SPACE),
          message: item.includes(WHITE_SPACE) ? 'Cannot contain whitespace' : null,
        };
      } else if (item instanceof RegExp) {
        acc[item.toString()] = {
          result: true,
          message: null
        }
      } else {
        acc[`${item}`] = {
          result: false,
          message: `Do not support pattern: '${item}'`
        }
      }
      return acc
    }, {});

    const patternKeys = Object.keys(isValidMap)
    const patternLen = patternKeys.length
    for (let i = 0; i < patternLen; i++) {
      const { result, message } = isValidMap[patternKeys[i]]
      if (result && i === patternLen - 1) {
        acc[key] = { result, message }
      } else if (!result) {
        acc[key] = {
          result,
          message: `[ddc] Invalid config.matches[${key}].pattern: '[${match.pattern.join(
            ", "
          )}]'. ${message}.`,
        };
        break
      } else {
        continue
      }
    }
    return acc;
  }, {});
};
