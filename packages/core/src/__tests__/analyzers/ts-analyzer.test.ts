import path from "path";
import { TSAnalyzer } from "@/analyzers";

describe("TSAnalyzer", () => {
  describe("analyze", () => {
    describe("when found", () => {
      describe("when `[Task.create]`", () => {
        const config = {
          matches: {
            test: {
              pattern: ["Task.create"],
            },
          },
        };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}` as string,\n" +
                  "          content: `content_${index}` as string,\n" +
                  "        },\n" +
                  "      ]);",
                match: {
                  pattern: ["Task.create"],
                },
                matchInfo: {
                  "Task.create": {
                    line: 25,
                    position: 586,
                  },
                },
                startLine: 25,
                matchLine: 25,
                endLine: 31,
                startPosition: 586,
                endPosition: 724,
                offsetPosition: 13,
              },
            ],
          });
        });
      });

      describe("when `[map, Task.create]`", () => {
        const config = {
          matches: {
            test: {
              pattern: ["map", "Task.create"],
            },
          },
        };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "map<any[]>((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}` as string,\n" +
                  "          content: `content_${index}` as string,\n" +
                  "        },\n" +
                  "      ]);\n" +
                  "    })",
                match: {
                  pattern: ["map", "Task.create"],
                },
                matchInfo: {
                  "Task.create": {
                    line: 25,
                    position: 586,
                  },
                  map: {
                    line: 24,
                    position: 546,
                  },
                },
                startLine: 24,
                matchLine: 25,
                endLine: 32,
                startPosition: 546,
                endPosition: 731,
                offsetPosition: 19,
              },
            ],
          });
        });
      });

      describe("when `[Promise.all, map, Task.create]`", () => {
        const config = {
          matches: {
            test: {
              pattern: ["Promise.all", "map", "Task.create"],
            },
          },
        };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Promise.all(\n" +
                  "    // @ts-expect-error\n" +
                  "    [...Array(10)].map<any[]>((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}` as string,\n" +
                  "          content: `content_${index}` as string,\n" +
                  "        },\n" +
                  "      ]);\n" +
                  "    })\n" +
                  "  );",
                match: {
                  pattern: ["Promise.all", "map", "Task.create"],
                },
                matchInfo: {
                  "Promise.all": {
                    line: 22,
                    position: 490,
                  },
                  map: {
                    line: 24,
                    position: 546,
                  },
                  "Task.create": {
                    line: 25,
                    position: 586,
                  },
                },
                startLine: 22,
                matchLine: 25,
                endLine: 33,
                startPosition: 490,
                endPosition: 736,
                offsetPosition: 8,
              },
            ],
          });
        });
      });

      describe("when `[Promise.all, map, /[a-zA-Z]+.create/]`", () => {
        const config = {
          matches: {
            test: {
              pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
            },
          },
        };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Promise.all(\n" +
                  "    // @ts-expect-error\n" +
                  "    [...Array(10)].map<any[]>((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}` as string,\n" +
                  "          content: `content_${index}` as string,\n" +
                  "        },\n" +
                  "      ]);\n" +
                  "    })\n" +
                  "  );",
                match: {
                  pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
                },
                matchInfo: {
                  "Promise.all": {
                    line: 22,
                    position: 490,
                  },
                  map: {
                    line: 24,
                    position: 546,
                  },
                  "/[a-zA-Z]+.create/": {
                    line: 25,
                    position: 586,
                  },
                },
                startLine: 22,
                matchLine: 25,
                endLine: 33,
                startPosition: 490,
                endPosition: 736,
                offsetPosition: 8,
              },
            ],
          });
        });
      });
    });

    describe("when do not found", () => {
      describe("when do not match pattern", () => {
        const config = {
          matches: {
            test: {
              pattern: ["do", "not", "exists"],
            },
          },
        };
        const analyzer = new TSAnalyzer(config);
        it("should return []", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] });
        });
      });

      describe("when export only file", () => {
        const config = {
          matches: {
            test: {
              pattern: [/[a-zA-Z]+.create/],
            },
          },
        };
        const analyzer = new TSAnalyzer(config)
        it("should return []", () => {
          const filepath = "./src/__tests__/__fixtures__/ts/export-only.ts.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] })
        })
      })
    });
  });
});
