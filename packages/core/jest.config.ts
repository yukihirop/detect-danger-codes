/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  rootDir: "../..",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/packages/core/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/esbuild-jest",
  },
};
