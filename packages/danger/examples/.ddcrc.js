module.exports = {
  matches: {
    maybeHeabyQuery: {
      pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
      // pattern: ['Promise.resolve'],
      description: "maybe heavy query",
    },
  },
};
