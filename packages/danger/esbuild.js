const { argv } = require("process");
const { build } = require("esbuild");
const alias = require('esbuild-plugin-alias')
const path = require("path");

const options = {
  define: { "process.env.NODE_ENV": process.env.NODE_ENV },
  entryPoints: [path.resolve(__dirname, "src/index.ts")],
  minify: argv[2] === "production",
  bundle: true,
  target: "es2022",
  platform: "node",
  outdir: path.resolve(__dirname, "dist"),
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  plugins: [
    alias({
      '@@danger': path.resolve(__dirname, '../../node_modules/danger')
    })
  ]
};

build(options).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
