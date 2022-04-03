import { IConfig, TValidationMap } from '@/interfaces'

const WHITE_SPACE = ' '

export const validateConfig = (config: IConfig): TValidationMap => {
  return Object.keys(config.matches).reduce<TValidationMap>((acc, key) => {
    const match = config.matches[key];
    const isValid = match.pattern.every((item) => !item.includes(WHITE_SPACE));
    if (isValid) {
      acc[key] = { result: true, message: null };
    } else {
      acc[key] = {
        result: false,
        message: `[ddc] Invalid config.matches[${key}].pattern: '[${match.pattern.join(', ')}]'. Cannot contain whitespace.`,
      };
    }
    return acc;
  }, {});
};
