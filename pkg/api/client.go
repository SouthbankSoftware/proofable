/*
 * @Author: guiguan
 * @Date:   2020-02-15T11:29:34+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-19T14:49:46+11:00
 */

package api

import (
	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

// NewAPIClient creates a new API client
func NewAPIClient(hostPort string, creds credentials.PerRPCCredentials) (
	con *grpc.ClientConn, cli apiPB.APIServiceClient, er error) {
	secureOpt := grpc.DialOption(nil)

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
