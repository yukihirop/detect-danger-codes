module.exports = {
  matches: {
    maybeHeavyQuery: {
      pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
      description:
        "重いクエリが実行されたりすると一時的にスリープする可能性があります。",
    },
  },
};
