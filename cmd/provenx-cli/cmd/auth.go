/*
 * @Author: guiguan
 * @Date:   2020-03-10T11:38:58+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-10T15:34:25+11:00
 */

package cmd

import (
	"context"
	"errors"
	"fmt"

	"github.com/SouthbankSoftware/proven-cli/pkg/auth"
	"github.com/SouthbankSoftware/provendb-tree/pkg/log"
	"github.com/fatih/color"
	"github.com/skratchdot/open-golang/open"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"google.golang.org/grpc/credentials"
)

const (
	nameAuth                       = "auth"
	nameDelete                     = "delete"
	nameProvenDBAPIGatewayEndpoint = "provendb-api-gateway.endpoint"

	viperKeyAuthProvenDBAPIGatewayEndpoint = nameAuth + "." + nameProvenDBAPIGatewayEndpoint
	viperKeyAuthDelete                     = nameAuth + "." + nameDelete
)

type authCreds struct {
	token  string
	secure bool
}

func (c *authCreds) GetRequestMetadata(context.Context, ...string) (
	map[string]string, error) {
	return map[string]string{
		"authorization": "Bearer " + c.token,
	}, nil
}

func (c *authCreds) RequireTransportSecurity() bool {
	return c.secure
}

func getCreds() (creds credentials.PerRPCCredentials, er error) {
	secure := viper.GetBool(viperKeyAPISecure)

	if t := viper.GetString(viperKeyDevToken); t != "" {
		// use dev token
		creds = &authCreds{
			token:  t,
			secure: secure,
		}
		return
	}

	if !auth.CheckAuthentication() {
		er = errors.New("authentication required: please use `auth` subcommand to authenticate")
	}

	pdbCreds := auth.RetrieveAuthentication()
	pdbCreds.UseTLS = secure
	creds = pdbCreds
	return
}

// TODO: needs to refactor auth pkg with proper error handling
var authCmd = &cobra.Command{
	Use:   nameAuth,
	Short: "Authenticate with ProvenDB",
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		err := log.SetSharedFactory(name, "dev")
		if err != nil {
			return err
		}

		if viper.GetBool(viperKeyAuthDelete) {
			auth.StoreAuthentication("", "")
			auth.StoreConfig("")

			fmt.Fprintf(color.Output, "%s deleted authentication\n", headerGreen(" OK "))
			return nil
		}

		pdbEndpoint := viper.GetString(viperKeyAuthProvenDBAPIGatewayEndpoint)

		if !auth.CheckAuthentication() {
			prompt := auth.GetSelect(pdbEndpoint)

			choice, _, err := prompt.Run()
			if err != nil {
				return err
			}

			switch {
			case choice < 3:
				open.Run(prompt.Items.([]auth.OauthProvider)[choice].URI)
				auth.StartHTTPServer()
			default:
				prompt := auth.GetEmailPrompt()
				email, err := prompt.Run()
				if err != nil {
					return err
				}

				prompt = auth.GetPasswordPrompt()
				password, err := prompt.Run()
				if err != nil {
					return err
				}

				if !auth.EmailLogin(pdbEndpoint, email, password) {
					return errors.New("failed to login")
				}
			}
		}

		auth.StoreConfig(pdbEndpoint)

		fmt.Fprintf(color.Output, "%s authenticated\n", headerGreen(" OK "))
		return nil
	},
}

func init() {
	cmdRoot.AddCommand(authCmd)

	authCmd.Flags().String(nameProvenDBAPIGatewayEndpoint, "https://apigateway.dev.provendb.com", "specify the ProvenDB API Gateway endpoint to authenticate with")
	viper.BindPFlag(viperKeyAuthProvenDBAPIGatewayEndpoint, authCmd.Flags().Lookup(nameProvenDBAPIGatewayEndpoint))

	authCmd.Flags().BoolP(nameDelete, "d", false, "specify whether to delete the authentication instead")
	viper.BindPFlag(viperKeyAuthDelete, authCmd.Flags().Lookup(nameDelete))
}
