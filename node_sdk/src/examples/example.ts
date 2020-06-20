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
 * @Author: Koustubh Gaikwad
 * @Date:   2020-06-19T09:26:20+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-20T11:13:00+10:00
 */

import * as grpc from "grpc";
import {
  newApiServiceClient,
  KeyValue,
  stripCompoundKeyAnchorTriePart,
} from "../";

const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");

const client = newApiServiceClient("api.dev.proofable.io:443", metadata);

// you can use `npm run example` this run this
(async () => {
  for await (const val of client.verifyKeyValuesProof(
    "test.subproofable",
    true,
    "test.dot"
  )) {
    // use instanceof as the type guard:
    // https://www.staging-typescript.org/docs/handbook/advanced-types.html#instanceof-type-guards
    if (val instanceof KeyValue) {
      // within this branch, val is now narrowed down to KeyValue
      console.log(stripCompoundKeyAnchorTriePart(val).to("utf8", "hex"));
    } else {
      // within this branch, val is now narrowed down to VerifyProofReply
      console.log("the subproof is", val.getVerified());
    }
  }
})();
