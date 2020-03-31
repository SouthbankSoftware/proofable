/*
 * provenx
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
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package cmd

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameDotGraphOutputPath = "dot-graph." + nameOutputPath

	viperKeyVerifyDotGraphOutputPath = nameVerify + "." + nameDotGraphOutputPath
)

var cmdVerify = &cobra.Command{
	Use:   nameVerify,
	Short: "Verify a proof or subproof",
}

func init() {
	cmdRoot.AddCommand(cmdVerify)

	cmdVerify.PersistentFlags().StringP(nameDotGraphOutputPath, "d", "", "specify the Graphviz Dot Graph (.dot) output path")
	viper.BindPFlag(viperKeyVerifyDotGraphOutputPath, cmdVerify.PersistentFlags().Lookup(nameDotGraphOutputPath))
}
