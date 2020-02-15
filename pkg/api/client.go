/*
 * @Author: guiguan
 * @Date:   2020-02-15T11:29:34+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-15T11:37:33+11:00
 */

package api

import (
	"context"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"google.golang.org/grpc"
)

type credentials struct{}

func (c *credentials) GetRequestMetadata(context.Context, ...string) (
	map[string]string, error) {
	return map[string]string{
		"authorization": "Bearer magic",
	}, nil
}

func (c *credentials) RequireTransportSecurity() bool {
	return false
}

// NewAPIClient creates a new API client
func NewAPIClient(hostPort string) (
	con *grpc.ClientConn, cli apiPB.APIServiceClient, er error) {
	conn, err := grpc.Dial(
		hostPort,
		grpc.WithInsecure(),
		grpc.WithPerRPCCredentials(&credentials{}),
	)
	if err != nil {
		er = err
		return
	}
	con = conn

	cli = apiPB.NewAPIServiceClient(conn)
	return
}
