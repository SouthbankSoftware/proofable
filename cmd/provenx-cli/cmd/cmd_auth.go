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
 * @Date:   2020-03-10T11:38:58+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T11:09:02+11:00
 */

package cmd

import (
	"context"

	"github.com/SouthbankSoftware/provenx-cli/pkg/auth"
	"github.com/SouthbankSoftware/provenx-cli/pkg/authcli"
	"github.com/SouthbankSoftware/provenx-cli/pkg/colorcli"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"google.golang.org/grpc/credentials"
)

const (
	nameAuth   = "auth"
	nameDelete = "delete"

	viperKeyAuthDelete = nameAuth + "." + nameDelete
)

func getCreds(ctx context.Context) (creds credentials.PerRPCCredentials, er error) {
	return authcli.AuthenticateForGRPC(ctx,
		viper.GetString(viperKeyProvenDBAPIGatewayEndpoint),
		viper.GetBool(viperKeyAPISecure),
		viper.GetString(viperKeyDevToken),
	)
}

var authCmd = &cobra.Command{
	Use:   nameAuth,
	Short: "Authenticate with ProvenDB",
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		if viper.GetBool(viperKeyAuthDelete) {
			err := auth.DeleteAuth()
			if err != nil {
				return err
			}

			colorcli.Oklnf("deleted authentication")
			return nil
		}

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		_, err := getCreds(ctx)
		if err != nil {
			return err
		}

		colorcli.Oklnf("authenticated")
		return nil
	},
}

func init() {
	cmdRoot.AddCommand(authCmd)

	authCmd.Flags().BoolP(nameDelete, "d", false, "specify whether to delete the authentication instead")
	viper.BindPFlag(viperKeyAuthDelete, authCmd.Flags().Lookup(nameDelete))
}
