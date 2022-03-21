import path from "path";
import { TSAnalyzer } from "@/analyzers";

describe("TSAnalyzer", () => {
  const filepath = "./src/__tests__/__fixtures__/ts/simple.ts.txt";

  describe("analyze", () => {
    describe("when found", () => {
      describe("when `map`", () => {
        const config = { target: ["map"] };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ target, code, line, start, end, offset }]", () => {
          expect(analyzer.analyze(filepath)).toStrictEqual([
            {
              filepath: path.resolve(process.cwd(), filepath),
              target: "map",
              code:
                "[...Array(10)].map((_, index) => {\n" +
                "      return Task.create([\n" +
                "        {\n" +
                "          title: `title_${index}`,\n" +
                "          content: `content_${index}`,\n" +
                "        },\n" +
                "      ]);\n" +
                "    })",
              line: 23,
              start: 507,
              end: 680,
              offset: 19,
            },
          ]);
        });
      });

      describe("when `Promise.all`", () => {
        const config = { target: ["Promise.all"] };
        const analyzer = new TSAnalyzer(config);
        it("should return [{ target, code, line, start, end, offset }]", () => {
          expect(analyzer.analyze(filepath)).toStrictEqual([
            {
              filepath: path.resolve(process.cwd(), filepath),
              target: "Promise.all",
              code:
                "await Promise.all(\n" +
                "    [...Array(10)].map((_, index) => {\n" +
                "      return Task.create([\n" +
                "        {\n" +
                "          title: `title_${index}`,\n" +
                "          content: `content_${index}`,\n" +
                "        },\n" +
                "      ]);\n" +
                "    })\n" +
                "  )",
              line: 22,
              start: 484,
              end: 684,
              offset: 8,
            },
          ]);
        });
      });
    });

    describe("when do not found", () => {
      const config = { target: ["do_not_exist"] };
      const analyzer = new TSAnalyzer(config);
      it("should return []", () => {
        expect(analyzer.analyze(filepath)).toStrictEqual([]);
      });
    });
  });
});
