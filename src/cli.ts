
import { Command, flags } from "@oclif/command";
import { packageDirectorySync } from 'pkg-dir';

import { run as ddiRun } from './runner'

const projectRoot = packageDirectorySync() || process.cwd();
const cwd = process.cwd();
export class DDICli extends Command {
  /**
   * @bug don't ovverride usage
   * @see https://oclif.io/docs/commands#other-command-options
   */
  static usage = "ddi";
  static description = "detect danger iterators";

  static flags = {
    help: flags.help({
      char: "h",
      required: false,
    }),
    config: flags.string({
      char: "c",
      description: ".ddirc.js",
      required: false,
    }),
  };

  static args = [
    {
      name: 'filename',
      required: true,
      description: 'single js file',
    }
  ]

  async run() {
    const { args, flags } = this.parse(DDICli)

    const defaultConfigPath = `${projectRoot}/.ddirc.js`
    const configPath = `${cwd}/${flags.config}`

    try {
      const config = require(configPath || defaultConfigPath);
      return ddiRun(args.filename, config);
    } catch (err) {
      console.error(err)
    }
  }
}


