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
 * @Date:   2020-07-07T11:05:07+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-07T11:07:18+10:00
 */

import util from "util";
import { Anchor } from "./anchor_pb";

/**
 * Gets the string representation of the block number concept. For Hedera, it is
 * `blockTime.blockTimeNano`; for the rest, it is `blockNumber`
 */
export function getBlockNumberString(
  anchorType: string,
  blockTime: number,
  blockTimeNano: number,
  blockNumber: number
): string {
  if (anchorType.startsWith(Anchor.TypeName[Anchor.Type.HEDERA])) {
    return util.format("%d.%d", blockTime, blockTimeNano);
  }

  return blockNumber.toString();
}
