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
 * @Date:   2020-06-23T13:52:46+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-24T13:16:35+10:00
 */

// @ts-ignore
import { keccak256 } from "eth-lib/lib/hash";

/**
 * The size of a hash
 */
export const hashSize = 32;

/**
 * Hashes the given data using SHA3 256 Keccak
 */
export function sha3(data: Buffer | string): string {
  if (typeof data === "string" && !data.startsWith("0x")) {
    throw new Error("hex string must start with `0x`");
  }

  return (keccak256(data) as string).substring(2);
}
