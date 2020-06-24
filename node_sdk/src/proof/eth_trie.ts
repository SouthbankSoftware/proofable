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
 * @Date:   2020-06-22T16:45:37+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-24T18:52:47+10:00
 */

import { sha3 } from "../hasher";

export abstract class EthTrie {
  anchorType = "ETH";
  txnId = "";
  txnUri = "";
  blockTime = 0;
  blockTimeNano = 0;
  blockNumber = 0;
  trieNodes: string[] = [];

  get root(): string {
    if (this.trieNodes.length > 0) {
      return sha3(Buffer.from(this.trieNodes[0], "base64"));
    }

    return sha3("0x");
  }
}
