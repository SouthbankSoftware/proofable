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
 * @Date:   2020-06-25T19:16:39+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-25T20:11:02+10:00
 */

import util from "util";
import fs from "fs";
import * as grpc from "grpc";
import { filePath } from "../config";

const FILE_NAME_AUTH_CONFIG = "auth.json";

/**
 * Get the authentication metadata from user's ProvenDB configuration directory
 */
export function getAuthMetadata(): grpc.Metadata {
  const metadata = new grpc.Metadata();

  try {
    metadata.add(
      "authorization",
      `Bearer ${
        JSON.parse(fs.readFileSync(filePath(FILE_NAME_AUTH_CONFIG)).toString())
          .authToken
      }`
    );
  } catch (err) {
    throw new Error(
      util.format(
        "failed to get auth metadata: %s, please use `proofable-cli auth` to create one",
        err.message
      )
    );
  }

  return metadata;
}
