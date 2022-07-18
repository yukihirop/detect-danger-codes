# detect-danger-codes

Matches code that has a dangerous structure and automatically comments at the time of PR

## Usage

Use as a danger plugin

Write `.ddcrc.js`

```js
module.exports = {
  matches: {
    maybeHeavyQuery: {
      pattern: ["Promise.all", "map", /[a-zA-Z]+.create/],
      description:
        "重いクエリが実行されたりすると一時的にスリープする可能性があります。",
    },
  },
};
```

Write `dangerfile.ts` as follows

```ts
import { warn } from "danger";
import { checkDangerCodes } from "@yukihirop/detect-danger-codes-danger"; 

async function main() {
  const result = await checkDangerCodes("./.ddcrc.js", 
    '!dangerfile.ts',
    '!**/*.test.ts',
    '**/*.{js,ts}'
  );
  result.forEach(({ key, filepath, line, description }) => {
    if (key === "maybeHeavyQuery") {
      warn(`
[ddc|${key}] 🤖 ${description}
既に退会したユーザーに関するレコードまで取得するようになっていて処理が重くなりお客さんに迷惑をかけたことがありました。
不必要なレコードを取得しないようにクエリを工夫しましょう。`,
        filepath,
        line
      );
    }
  })
}

main()
```


```bash
danger pr https://github.com/yukihirop/detect-danger-codes/pull/5

Starting Danger PR on yukihirop/detect-danger-codes#5
[BABEL] Note: The code generator has deoptimised the styling of /Users/yukihirop/JavaScriptProjects/detect-danger-codes/packages/danger/dist/index.js as it exceeds the max of 500KB.


Danger: ✓ found only warnings, not failing the build
## Warnings

[ddc|maybeHeavyQuery] 🤖 重いクエリが実行されたりすると一時的にスリープする可能性があります。
既に退会したユーザーに関するレコードまで取得するようになっていて処理が重くなりお客さんに迷惑をかけたことがありました。
不必要なレコードを取得しないようにクエリを工夫しましょう。

✨  Done in 12.06s.
```

## Development (core)

#### JavaScript

```bash
cd pacakages/core
$ node ./bin/ddc ./examples/js/files/simple.js -c ./examples/js/.ddcrc.js | jq .
{
  "maybeHeabyQuery": [
    {
      "filepath": "/Users/yukihirop/JavaScriptProjects/detect-danger-codes/packages/core/examples/js/files/simple.js",
      "code": "map((_, index) => {\n      return Task.create([\n        {\n          title: `title_${index}`,\n          content: `content_${index}`,\n        },\n      ])\n    })",
      "match": {
        "pattern": [
          "map",
          {}
        ],
        "description": "maybe heavy query"
      },
      "matchInfo": {
        "map": {
          "position": [
            291,
            448
          ],
          "index": 0,
          "line": 14
        },
        "/[a-zA-Z]+.create/": {
          "position": [
            324,
            441
          ],
          "index": 1,
          "line": 15
        }
      },
      "startLine": 14,
      "matchLine": 15,
      "endLine": 22,
      "startPosition": 291,
      "endPosition": 448,
      "offsetPosition": 19
    }
  ]
}
```

#### TypeScript

```bash
cd packages/core
$ node ./bin/ddc ./examples/ts/files/simple.ts -c ./examples/ts/.ddcrc.js | jq .
{
  "maybeHeabyQuery": [
    {
      "filepath": "/Users/yukihirop/JavaScriptProjects/detect-danger-codes/packages/core/examples/ts/files/simple.ts",
      "code": "map<any[]>((_, index) => {\n      return User.create([\n        {\n          name: `user_${index}` as string\n        }\n      ])\n    })",
      "match": {
        "pattern": [
          "map",
          {}
        ],
        "description": "maybe heavy query"
      },
      "matchInfo": {
        "map": {
          "position": [
            859,
            990
          ],
          "index": 0,
          "line": 34
        },
        "/[a-zA-Z]+.create/": {
          "position": [
            899,
            983
          ],
          "index": 1,
          "line": 35
        }
      },
      "startLine": 34,
      "matchLine": 35,
      "endLine": 41,
      "startPosition": 859,
      "endPosition": 990,
      "offsetPosition": 19
    },
    {
      "filepath": "/Users/yukihirop/JavaScriptProjects/detect-danger-codes/packages/core/examples/ts/files/simple.ts",
      "code": "map<any[]>((_, index) => {\n      return Task.create([\n        {\n          title: `title_${index}` as string,\n          content: `content_${index}` as string,\n        },\n      ]);\n    })",
      "match": {
        "pattern": [
          "map",
          {}
        ],
        "description": "maybe heavy query"
      },
      "matchInfo": {
        "map": {
          "position": [
            859,
            990
          ],
          "index": 0,
          "line": 34
        },
        "/[a-zA-Z]+.create/": {
          "position": [
            899,
            983
          ],
          "index": 1,
          "line": 35
        }
      },
      "startLine": 48,
      "matchLine": 35,
      "endLine": 56,
      "startPosition": 1108,
      "endPosition": 1293,
      "offsetPosition": 19
    }
  ]
}
```

## Development (danger)

```bash
cd packages/danger
$ DANGER_GITHUB_API_TOKEN=$GITHUB_DDC_TOKEN yarn danger:pr
yarn run v1.22.18
$ cd examples && danger pr https://github.com/yukihirop/detect-danger-codes/pull/5
Starting Danger PR on yukihirop/detect-danger-codes#5
[BABEL] Note: The code generator has deoptimised the styling of /Users/yukihirop/JavaScriptProjects/detect-danger-codes/packages/danger/dist/index.js as it exceeds the max of 500KB.


Danger: ✓ found only warnings, not failing the build
## Warnings

[ddc|maybeHeavyQuery] 🤖 重いクエリが実行されたりすると一時的にスリープする可能性があります。
既に退会したユーザーに関するレコードまで取得するようになっていて処理が重くなりお客さんに迷惑をかけたことがありました。
不必要なレコードを取得しないようにクエリを工夫しましょう。

✨  Done in 11.44s.
```

