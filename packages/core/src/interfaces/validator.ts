export interface IValidationResult {
  result: boolean,
  message: string | null
}

export type TValidationMap = Record<string, IValidationResult>
