/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-15T12:29:21+11:00
 */

package cmd

import (
	"github.com/spf13/cobra"
)

var cmdCreate = &cobra.Command{
	Use:   nameCreate,
	Short: "Create a target",
}

func init() {
	cmdRoot.AddCommand(cmdCreate)
}
