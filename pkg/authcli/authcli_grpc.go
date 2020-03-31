/*
 * provenx-cli
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
 * @Date:   2020-03-11T12:01:57+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T11:15:57+11:00
 */

package authcli

import (
	"context"

	"google.golang.org/grpc/credentials"
)

type grpcCreds struct {
	token  string
	secure bool
}

func (c *grpcCreds) GetRequestMetadata(context.Context, ...string) (
	map[string]string, error) {
	return map[string]string{
		"authorization": "Bearer " + c.token,
	}, nil
}

func (c *grpcCreds) RequireTransportSecurity() bool {
	return c.secure
}

// AuthenticateForGRPC authenticates with ProvenDB for gRPC via the CLI
func AuthenticateForGRPC(
	ctx context.Context,
	endpoint string,
	secure bool,
	devToken string,
) (creds credentials.PerRPCCredentials, er error) {
	gc := &grpcCreds{
		secure: secure,
	}

	if devToken != "" {
		gc.token = devToken
	} else {
		au, err := Authenticate(ctx, endpoint)
		if err != nil {
			er = err
			return
		}

		gc.token = au.AuthToken
	}

	creds = gc
	return
}
