module.exports = {
  matches: {
    maybeHeabyQuery: {
      pattern: ["map", /[a-zA-Z]+.create/],
      // pattern: ['Promise.resolve'],
      description: "maybe heavy query",
    },
  },
};
