/*
 * proofable
 * Copyright (C) 2020  Southbank Software Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @Author: guiguan
 * @Date:   2020-06-25T18:41:25+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-25T19:22:31+10:00
 */

import path from "path";
import os from "os";

/**
 * The name of the ProvenDB root config directory
 */
export const NAME_CONFIG_ROOT = "ProvenDB";

/**
 * The OS user config path
 */
export function userConfigDir(): string {
  switch (os.type()) {
    case "Windows_NT": {
      const dir = process.env["AppData"];

      if (!dir) {
        throw new Error("%AppData% is not defined");
      }

      return dir;
    }
    case "Darwin": {
      const dir = process.env["HOME"];

      if (!dir) {
        throw new Error("$HOME is not defined");
      }

      return path.join(dir, "/Library/Application Support");
    }
    // Unix
    default: {
      let dir = process.env["XDG_CONFIG_HOME"];
      if (!dir) {
        dir = process.env["HOME"];
        if (!dir) {
          throw new Error("neither $XDG_CONFIG_HOME nor $HOME are defined");
        }

        dir = path.join(dir, "/.config");
      }

      return dir;
    }
  }
}

/**
 * The ProvenDB config root path
 */
export function rootPath(): string {
  return path.join(userConfigDir(), NAME_CONFIG_ROOT);
}

/**
 * The config file path for the given ProvenDB config file name
 */
export function filePath(configFileName: string): string {
  return path.join(rootPath(), configFileName);
}
