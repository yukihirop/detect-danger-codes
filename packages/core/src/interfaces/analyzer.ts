/**
 * @description
 * 
 * If you want to match `[Task.create] in [map] in [Promise.all]` with the following code,
 * 
 * await Promise.all(
 *   [...Array(10)].map((_, index) => {
 *     return Task.create([
 *       {
 *         title: `title_${index}`,
 *         content: `content_${index}`,
 *       },
 *     ]);
 *   })
 * );
 * 
 * write as follows:
 * 
 * pattern: ['Promise.all', 'map', 'Task.create']
 * 
 */
export interface ISourcePositionMatch {
  pattern: string[],
  description?: string
}

export type TSourcePositionMatches = Record<string /* match identifier */, ISourcePositionMatch>

export type TSourcePositionMatchInfo = Record<string, { position: number, line?: number }>
export interface ISourcePosition {
  match: ISourcePositionMatch;
  matchInfo: TSourcePositionMatchInfo;
  line: number;
  startPosition: number;
  endPosition: number;
  offsetPosition: number;
}
export interface ISourcePositionWithCode extends ISourcePosition {
  filepath: string;
  code: string;
}

export type TSourcePositionWithCodeMap = Record<string, ISourcePositionWithCode[]>
