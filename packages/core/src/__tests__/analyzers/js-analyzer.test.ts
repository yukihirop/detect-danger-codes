import path from "path";
import { JSAnalyzer } from "@/analyzers";

describe("JSAnalyzer", () => {
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
        const analyzer = new JSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/js/simple.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}`,\n" +
                  "          content: `content_${index}`,\n" +
                  "        },\n" +
                  "      ])",
                match: {
                  pattern: ["Task.create"],
                },
                matchInfo: {
                  "Task.create": {
                    line: 15,
                    position: 324,
                  },
                },
                startLine: 15,
                endLine: 21,
                startPosition: 324,
                endPosition: 441,
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
        const analyzer = new JSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/js/simple.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "map((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}`,\n" +
                  "          content: `content_${index}`,\n" +
                  "        },\n" +
                  "      ])\n" +
                  "    })",
                match: {
                  pattern: ["map", "Task.create"],
                },
                matchInfo: {
                  "Task.create": {
                    line: 15,
                    position: 324,
                  },
                  map: {
                    line: 14,
                    position: 291,
                  },
                },
                startLine: 14,
                endLine: 22,
                startPosition: 291,
                endPosition: 448,
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
        const analyzer = new JSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/js/simple.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Promise.all(\n" +
                  "    [...Array(10)].map((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}`,\n" +
                  "          content: `content_${index}`,\n" +
                  "        },\n" +
                  "      ])\n" +
                  "    })\n" +
                  "  )",
                match: {
                  pattern: ["Promise.all", "map", "Task.create"],
                },
                matchInfo: {
                  "Promise.all": {
                    line: 13,
                    position: 259,
                  },
                  map: {
                    line: 14,
                    position: 291,
                  },
                  "Task.create": {
                    line: 15,
                    position: 324,
                  },
                },
                startLine: 13,
                endLine: 23,
                startPosition: 259,
                endPosition: 452,
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
        const analyzer = new JSAnalyzer(config);
        it("should return [{ filepath, code, match, matchInfo, line, startPosition, endPosition, offsetPosition }]", () => {
          const filepath = "./src/__tests__/__fixtures__/js/simple.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({
            test: [
              {
                filepath: path.resolve(process.cwd(), filepath),
                code:
                  "Promise.all(\n" +
                  "    [...Array(10)].map((_, index) => {\n" +
                  "      return Task.create([\n" +
                  "        {\n" +
                  "          title: `title_${index}`,\n" +
                  "          content: `content_${index}`,\n" +
                  "        },\n" +
                  "      ])\n" +
                  "    })\n" +
                  "  )",
                match: {
                  pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
                },
                matchInfo: {
                  "Promise.all": {
                    line: 13,
                    position: 259,
                  },
                  map: {
                    line: 14,
                    position: 291,
                  },
                  "/[a-zA-Z]+.create/": {
                    line: 15,
                    position: 324,
                  },
                },
                startLine: 13,
                endLine: 23,
                startPosition: 259,
                endPosition: 452,
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
        const analyzer = new JSAnalyzer(config);
        it("should return []", () => {
        const filepath = "./src/__tests__/__fixtures__/js/simple.js.txt";
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
        const analyzer = new JSAnalyzer(config);
        it("should return []", () => {
          const filepath = "./src/__tests__/__fixtures__/js/export-only.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] })
        })
      })
    });
  });
});
