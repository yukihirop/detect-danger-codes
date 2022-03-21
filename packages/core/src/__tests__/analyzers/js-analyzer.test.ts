import * as fs from 'fs';
import { JSAnalyzer } from "@/analyzers";

describe('JSAnalyzer', () => {
  const input = fs.readFileSync('./src/__tests__/fixtures/js/simple.js.txt', { encoding: 'utf-8'})

  describe("analyze", () => {
    describe('when found', () => {
      const config = { target: ['map'] }
      const analyzer = new JSAnalyzer(config)
      it('should return [{ target, code, line, start, end, offset }]', () => {
        expect(analyzer.analyze(input)).toStrictEqual(
          [
            {
              target: 'map',
              code: '[...Array(10)].map((_, index) => {\n' +
                '      return Task.create([\n' +
                '        {\n' +
                '          title: `title_${index}`,\n' +
                '          content: `content_${index}`,\n' +
                '        },\n' +
                '      ])\n' +
                '    })',
              line: 14,
              start: 276,
              end: 448,
              offset: 19
            }
          ]
        )
      })
    })

    describe("when do not found", () => {
      const config = { target: ['do_not_exist'] }
      const analyzer = new JSAnalyzer(config)
      it('should return []', () => {
        expect(analyzer.analyze(input)).toStrictEqual([])
      })
    })
  });
})
