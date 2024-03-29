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
  pattern: (string | RegExp)[];
  description?: string;
}

export type TSourcePositionMatches = Record<
  string /* match identifier */,
  ISourcePositionMatch
>;

export type TSourcePositionMatchInfo = Record<
  string,
  { position: [number, number]; line?: number, index: number }
>;
export interface ISourcePosition {
  match: ISourcePositionMatch;
  matchInfo: TSourcePositionMatchInfo;
  startLine: number;
  startPosition: number;
  endPosition: number;
  offsetPosition: number;
}
export interface ISourcePositionWithCode extends ISourcePosition {
  filepath: string;
  code: string;
  matchLine: number;
  endLine: number;
}

export type TSourcePositionWithCodeMap = Record<
  string,
  ISourcePositionWithCode[]
>;

export interface IAnalyzer {
  analyze(filepath: string): TSourcePositionWithCodeMap;
}
