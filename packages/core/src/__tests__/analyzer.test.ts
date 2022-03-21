import * as fs from 'fs';
import { Analyzer } from "@/analyzer";

describe('Analyzer', () => {
  const input = fs.readFileSync('./src/__tests__/fixtures/js/simple.js.txt', { encoding: 'utf-8'})
  const analyzer = new Analyzer(input)

  describe("sourcePositionAt", () => {
    it('should return { line, start, end }', () => {
      const partial = 'Promise.all'
      expect(analyzer.sourcePositionAt(partial)).toStrictEqual([{
        line: 13,
        start: 251,
        end: 272,
        offset: 8
      }])
    })
  });
})
