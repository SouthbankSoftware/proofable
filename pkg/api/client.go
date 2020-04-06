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
 * @Date:   2020-02-15T11:29:34+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-06T11:08:52+10:00
 */

package api

import (
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

// NewAPIClient creates a new API client
func NewAPIClient(hostPort string, creds credentials.PerRPCCredentials) (
	con *grpc.ClientConn, cli apiPB.APIServiceClient, er error) {
	var secureOpt grpc.DialOption

	if creds.RequireTransportSecurity() {
		secureOpt = grpc.WithTransportCredentials(credentials.NewTLS(nil))
	} else {
		secureOpt = grpc.WithInsecure()
	}

	conn, err := grpc.Dial(
		hostPort,
		secureOpt,
		grpc.WithPerRPCCredentials(creds),
	)
	if err != nil {
		er = err
		return
	}
	con = conn

	cli = apiPB.NewAPIServiceClient(conn)
	return
}

// WithAPIClient provides an API client to a closure that is automatically destroyed when done
func WithAPIClient(hostPort string, creds credentials.PerRPCCredentials,
	fn func(cli apiPB.APIServiceClient) error) error {
	conn, cli, err := NewAPIClient(hostPort, creds)
	if err != nil {
		return err
	}
	defer conn.Close()

	return fn(cli)
}
