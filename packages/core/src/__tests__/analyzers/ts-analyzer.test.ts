import path from "path";
import { TSAnalyzer } from "@/analyzers";

describe("TSAnalyzer", () => {
  const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";

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
                line: 25,
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
                line: 24,
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
                line: 22,
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
                line: 22,
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
      const config = {
        matches: {
          test: {
            pattern: ["do", "not", "exists"],
          },
        },
      };
      const analyzer = new TSAnalyzer(config);
      it("should return []", () => {
        expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] });
      });
    });
  });
});
