import { IConfig } from '@/interfaces'

const WHITE_SPACE = ' '

export const validateConfig = (config: IConfig): { result: boolean, message: string | null } => {
  const validTarget = config.target.every(item => !item.includes(WHITE_SPACE))
  if(validTarget) return { result: true, message: null }
  return { result: false, message: `[ddc] Invalid config.target: '${config.target}'. Cannot contain whitespace.` }
}
