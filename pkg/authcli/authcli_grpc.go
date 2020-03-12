/*
 * @Author: guiguan
 * @Date:   2020-03-11T12:01:57+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-11T14:08:11+11:00
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
