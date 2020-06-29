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
 * @Date:   2020-06-26T16:34:25+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-26T18:53:02+10:00
 */

import fs from "fs";
import _ from "lodash";
import {
  newApiServiceClient,
  APIServiceClient,
  grpc,
  getAuthMetadata,
} from "../src";
import { filePath } from "../src/config";

export function getTestClient(): APIServiceClient {
  // defaults to https://github.com/SouthbankSoftware/proofable/blob/master/cmd/proofable-cli/cmd/cmd.go#L65-L67
  const config = {
    apiHostPort: "api.dev.proofable.io:443",
    apiSecure: true,
    provendbApiGatewayEndpoint: "https://apigateway.dev.provendb.com",
    devToken: undefined,
  };

  try {
    _.merge(
      config,
      JSON.parse(fs.readFileSync(filePath("proofable-cli.json"), "utf8"))
    );
  } catch {}

  _.merge(config, {
    apiHostPort: process.env["PROOFABLE_CLI_API_HOST_PORT"],
    apiSecure: process.env["PROOFABLE_CLI_API_SECURE"] !== "false",
    provendbApiGatewayEndpoint:
      process.env["PROOFABLE_CLI_API_GATEWAY_ENDPOINT"],
    devToken: process.env["PROOFABLE_CLI_DEV_TOKEN"],
  });

  let metadata: grpc.Metadata;

  if (config.devToken) {
    metadata = new grpc.Metadata();
    metadata.add("authorization", `Bearer ${config.devToken}`);
  } else {
    metadata = getAuthMetadata();
  }

  return newApiServiceClient(config.apiHostPort, metadata, config.apiSecure);
}
