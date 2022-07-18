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
                    index: 0,
                    line: 15,
                    position: [324, 441],
                  },
                },
                startLine: 15,
                matchLine: 15,
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
                    index: 1,
                    line: 15,
                    position: [324, 441],
                  },
                  map: {
                    index: 0,
                    line: 14,
                    position: [291, 448],
                  },
                },
                startLine: 14,
                matchLine: 15,
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
                    index: 0,
                    line: 13,
                    position: [259, 452],
                  },
                  map: {
                    index: 1,
                    line: 14,
                    position: [291, 448],
                  },
                  "Task.create": {
                    index: 2,
                    line: 15,
                    position: [324, 441],
                  },
                },
                startLine: 13,
                matchLine: 15,
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
                    index: 0,
                    line: 13,
                    position: [259, 452],
                  },
                  map: {
                    index: 1,
                    line: 14,
                    position: [291, 448],
                  },
                  "/[a-zA-Z]+.create/": {
                    index: 2,
                    line: 15,
                    position: [324, 441],
                  },
                },
                startLine: 13,
                matchLine: 15,
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
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] });
        });
      });

      describe("When the match is a comment", () => {
        const config = {
          matches: {
            test: {
              pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
            },
          },
        };
        const analyzer = new JSAnalyzer(config);
        it("should return []", () => {
          const filepath = "./src/__tests__/__fixtures__/js/comment.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] });
        });
      });

      describe("when the match is a unnested", () => {
        const config = {
          matches: {
            test: {
              pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
            },
          },
        };
        const analyzer = new JSAnalyzer(config);
        it("should return []", () => {
          const filepath = "./src/__tests__/__fixtures__/js/unnested.js.txt";
          expect(analyzer.analyze(filepath)).toStrictEqual({ test: [] });
        });
      });
    });
  });
});
