import { run as runDDC, IConfig } from "@yukihirop/detect-danger-codes-core";
import path from 'path'
import gitRootDir from "git-root-dir";
import minimatch from 'minimatch';

import { IDDCDangerResult, TMinimatchGlobPattern } from "@/interfaces";

// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "@@danger";
declare var danger: DangerDSLType;

const cwd = process.cwd();

export async function checkDangerCodes(
  configPath: string,
  ...pattern: TMinimatchGlobPattern
): Promise<IDDCDangerResult[]> {
  const rootDir = await gitRootDir();
  const files = [...danger.git.modified_files, ...danger.git.created_files];
  const targetFiles = files.filter((filepath) => {
    return pattern.every((globPattern) => minimatch(filepath, globPattern));
  });
  const modifiedLine: Record<string, Set<number>> = {};
  const hitLineMap: Record<
    string /* key */,
    Record<string /* file of danger */, Set<number>>
    > = {};
  const absConfigPath = path.resolve(cwd, configPath);
  const config: IConfig = require(absConfigPath);

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
    const absFilePath = path.resolve(rootDir, file);
    const resultStr = runDDC(absFilePath, config);
    const result = JSON.parse(resultStr)
    Object.keys(result).forEach((key) => {
      const items = result[key];
      if (!hitLineMap[key]) {
        hitLineMap[key] = {};
      }

      items.forEach((item) => {
        if (!hitLineMap[key][file]) {
          hitLineMap[key][file] = new Set<number>();
        }

        const lineIter = modifiedLine[file].values();
        for (let i = 0; i < modifiedLine[file].size; i++) {
          const line = lineIter.next().value;
          if (line === item.matchLine) {
            hitLineMap[key][file].add(line);
          }
        }
      });
    });
  }

  return Object.keys(hitLineMap).reduce<IDDCDangerResult[]>((acc, key) => {
    Object.keys(hitLineMap[key]).forEach((filepath) => {
      hitLineMap[key][filepath].forEach((line) => {
        const description = config.matches[key].description;
        acc.push({ key, filepath, line, description });
      });
    });
    return acc;
  }, []);
}
