module.exports = {
  matches: {
    maybeHeabyQuery: {
      pattern: ["Promise.all", "map", "Task.create"],
      description: "maybe heavy query",
    },
  },
};
