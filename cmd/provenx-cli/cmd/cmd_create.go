/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2020-03-19T10:28:11+11:00
 */

package cmd

import (
	"github.com/spf13/cobra"
)

var cmdCreate = &cobra.Command{
	Use:   nameCreate,
	Short: "Create a proof or subproof",
}

func init() {
	cmdRoot.AddCommand(cmdCreate)
}
