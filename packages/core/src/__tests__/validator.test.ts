import { validateConfig } from "@/validator";

describe("Validation", () => {
  describe("validateConfig", () => {
    describe("when valid `config.matches[].pattern`", () => {
      const config = {
        matches: {
          test: {
            pattern: ["Promise.all", "map", "Task.create"],
          },
        },
      };
      it("success", () => {
        expect(validateConfig(config)).toStrictEqual({
          test: { result: true, message: null },
        });
      });
    });

    describe("when valid `config.matches[].pattern (include regexp)`", () => {
      const config = {
        matches: {
          test: {
            pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
          },
        },
      };
      it("success", () => {
        expect(validateConfig(config)).toStrictEqual({
          test: { result: true, message: null },
        });
      });
    });

    describe("when invalid `config.matches[].pattern`", () => {
      const config = {
        matches: {
          test: {
            pattern: ["await Promise.all", "map", "Task.create"],
          },
        },
      };
      it("failure", () => {
        expect(validateConfig(config)).toStrictEqual({
          test: {
            result: false,
            message:
              "[ddc] Invalid config.matches[test].pattern: '[await Promise.all, map, Task.create]'. Cannot contain whitespace.",
          },
        });
      });
    });

    describe("when invalid `config.matches[].pattern (include unsupport value)`", () => {
      const config = {
        matches: {
          test: {
            pattern: ["Promise.all", "map", "Task.create", 1, false],
          },
        },
      };
      it("failure", () => {
        expect(validateConfig(config as any)).toStrictEqual({
          test: {
            result: false,
            message:
              "[ddc] Invalid config.matches[test].pattern: '[Promise.all, map, Task.create, 1, false]'. Do not support pattern: '1'.",
          },
        });
      });
    });
  });
});
