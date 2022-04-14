import { run as runDDC } from "@detect-danger-codes/core";
import path from 'path'
import gitRootDir from "git-root-dir";

// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "@@danger";
declare var danger: DangerDSLType;

const cwd = process.cwd();

export async function checkDangerCodes(pattern: RegExp, configPath: string) {
  const rootDir = await gitRootDir()
  const files = [...danger.git.modified_files, ...danger.git.created_files];
  const targetFiles = files.filter((filepath) => filepath.match(pattern));
  const modifiedLine: Record<string, Set<number>> = {};

  console.log({ targetFiles })

  for (const file of targetFiles) {
    if (!modifiedLine[file]) {
      modifiedLine[file] = new Set();
    }
    const diff = await danger.git.structuredDiffForFile(file);
    if (diff) {
      diff.chunks.forEach((chunk) => {
        chunk.changes.forEach((change) => {
          if (change.type === "add") {
            modifiedLine[file].add(change.ln);
          } else if (change.type === "del") {
            modifiedLine[file].add(change.ln);
          }
        });
      });
    }
    const absConfigPath = path.resolve(cwd, configPath)
    const absFilePath = path.resolve(rootDir, file)
    const result = runDDC(absFilePath, require(absConfigPath));
    Object.keys(result).forEach((key) => {
      const items = result[key];
      const targetItems = items.filter((item) => {
        // const hits = []
        // for (let i = item.startLine; i <= item.endLine; i++) {

        // }
        return modifiedLine[file].has(item.startLine);
      });

      console.log({ targetItems });
    });
  }
  // console.log(modifiedLine);
}
