export interface ISourcePosition {
  target: string,
  line: number,
  start: number,
  end: number,
  offset: number
}
export interface ISourceCodeWithPosition extends ISourcePosition {
  filepath: string;
  code: string;
}
