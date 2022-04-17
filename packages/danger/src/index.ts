import { run as runDDC } from "@detect-danger-codes/core";
import path from 'path'
import gitRootDir from "git-root-dir";
import { DDCDangerResult } from "@/interfaces";

// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "@@danger";
declare var danger: DangerDSLType;

const cwd = process.cwd();

export async function checkDangerCodes(pattern: RegExp, configPath: string): Promise<DDCDangerResult[]> {
  const rootDir = await gitRootDir()
  const files = [...danger.git.modified_files, ...danger.git.created_files];
  const targetFiles = files.filter((filepath) => filepath.match(pattern));
  const modifiedLine: Record<string, Set<number>> = {};
  const hitLineMap: Record<
    string /* key */,
    Record<string /* file of danger */, Set<number>>
    > = {};
  
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
      if (!hitLineMap[key]) {
        hitLineMap[key] = {};
      }

      items.forEach((item) => {
        if (!hitLineMap[key][file]) {
          hitLineMap[key][file] = new Set<number>();
        }

        const lineIter = modifiedLine[file].values()
        for (let i = 0; i < modifiedLine[file].size; i++) {
          const line = lineIter.next().value

          if (item.startLine <= line && line <= item.endLine) {
            hitLineMap[key][file].add(line);
          }
        }
      });
    });
  }

  return Object.keys(hitLineMap).reduce<DDCDangerResult[]>((acc, key) => {
    Object.keys(hitLineMap[key]).forEach((filepath) => {
      hitLineMap[key][filepath].forEach((line) => {
        acc.push({ key, filepath, line });
      });
    });
    return acc;
  }, []);
}
