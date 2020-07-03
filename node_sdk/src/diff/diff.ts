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
 * @Date:   2020-07-02T14:08:35+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-03T01:43:42+10:00
 */

import { KeyValue } from "../protos/api";

export enum KeyValueDiff {
  Equal,
  ValueDifferent,
  LeftKeyMissing,
  RightKeyMissing,
}

export interface KeyValueDiffResult {
  type: KeyValueDiff;
  left: KeyValue | null;
  right: KeyValue | null;
}

async function* getKeyValueGenerator(
  stream: Iterable<KeyValue> | AsyncIterable<KeyValue>
) {
  for await (const kv of stream) {
    yield kv;
  }

  return null;
}

/**
 * Diffs two ordered key-value streams. The streams must be closed eventually for the diff to
 * terminate
 *
 * @param leftStream left key-value stream
 * @param rightStream right key-value stream
 */
export function diffOrderedKeyValueStreams(
  leftStream: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  rightStream: Iterable<KeyValue> | AsyncIterable<KeyValue>
): AsyncIterable<KeyValueDiffResult> {
  return {
    async *[Symbol.asyncIterator]() {
      const leftGen = getKeyValueGenerator(leftStream);
      const rightGen = getKeyValueGenerator(rightStream);

      let leftKV = (await leftGen.next()).value;
      let rightKV = (await rightGen.next()).value;

      while (true) {
        let type: KeyValueDiff;

        if (!leftKV) {
          if (!rightKV) {
            return null;
          }

          type = KeyValueDiff.LeftKeyMissing;
        } else if (!rightKV) {
          type = KeyValueDiff.RightKeyMissing;
        } else {
          const o = Buffer.compare(leftKV.getKey_asU8(), rightKV.getKey_asU8());

          if (o === 0) {
            if (
              Buffer.compare(
                leftKV.getValue_asU8(),
                rightKV.getValue_asU8()
              ) === 0
            ) {
              type = KeyValueDiff.Equal;
            } else {
              type = KeyValueDiff.ValueDifferent;
            }
          } else if (o < 0) {
            type = KeyValueDiff.RightKeyMissing;
          } else {
            type = KeyValueDiff.LeftKeyMissing;
          }
        }

        yield {
          type,
          left: leftKV,
          right: rightKV,
        };

        if (type === KeyValueDiff.LeftKeyMissing) {
          rightKV = (await rightGen.next()).value;
        } else if (type === KeyValueDiff.RightKeyMissing) {
          leftKV = (await leftGen.next()).value;
        } else {
          leftKV = (await leftGen.next()).value;
          rightKV = (await rightGen.next()).value;
        }
      }
    },
  };
}
