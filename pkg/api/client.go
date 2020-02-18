/*
 * @Author: guiguan
 * @Date:   2020-02-15T11:29:34+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T15:53:40+11:00
 */

package api

import (
	"context"
	"crypto/tls"
	"crypto/x509"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type authCreds struct {
	secure bool
}

func (c *authCreds) GetRequestMetadata(context.Context, ...string) (
	map[string]string, error) {
	return map[string]string{
		"authorization": "Bearer magic",
	}, nil
}

func (c *authCreds) RequireTransportSecurity() bool {
	return c.secure
}

// NewAPIClient creates a new API client
func NewAPIClient(hostPort string, secure bool) (
	con *grpc.ClientConn, cli apiPB.APIServiceClient, er error) {
	secureOpt := grpc.DialOption(nil)

	if secure {
		rootCAs, err := x509.SystemCertPool()
		if err != nil {
			er = err
			return
		}

		secureOpt = grpc.WithTransportCredentials(
			credentials.NewTLS(&tls.Config{RootCAs: rootCAs}))
	} else {
		secureOpt = grpc.WithInsecure()
	}

	conn, err := grpc.Dial(
		hostPort,
		secureOpt,
		grpc.WithPerRPCCredentials(&authCreds{secure}),
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
func WithAPIClient(hostPort string, secure bool,
	fn func(cli apiPB.APIServiceClient) error) error {
	conn, cli, err := NewAPIClient(hostPort, secure)
	if err != nil {
		return err
	}
	defer conn.Close()

	return fn(cli)
}
