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
 * @Date:   2020-06-19T10:49:04+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-24T13:17:57+10:00
 */

import { Metadata } from "grpc";
import { ServiceError, callErrorFromStatus } from "grpc/build/src/call";
import { Status } from "grpc/build/src/constants";

/**
 * Create a ServiceError out of an Error
 */
export function makeServiceError(
  err: Error,
  code = Status.INTERNAL,
  metadata = new Metadata()
): ServiceError {
  if ((err as ServiceError).code != undefined) {
    return err as ServiceError;
  }

  return callErrorFromStatus({
    code,
    details: err.message,
    metadata,
  });
}
