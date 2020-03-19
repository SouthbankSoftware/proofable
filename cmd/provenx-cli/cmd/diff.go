/*
 * @Author: guiguan
 * @Date:   2020-03-16T17:43:29+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-19T12:07:44+11:00
 */

package cmd

import (
	"github.com/SouthbankSoftware/provenx-cli/pkg/colorcli"
	"github.com/SouthbankSoftware/provenx-cli/pkg/diff"
	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
	"github.com/SouthbankSoftware/provenx-cli/pkg/strutil"
)

type differ struct {
	quiet bool
	totalKV,
	passedKV,
	changedKV,
	untrackedKV,
	missingKV int
}

func (d *differ) push(leftKV, rightKV *apiPB.KeyValue, result diff.KeyValueDiffResult) error {
	d.totalKV++

	switch result {
	case diff.KeyValueEqual:
		d.passedKV++

		if !d.quiet {
			colorcli.Passlnf("%s -> %s",
				strutil.String(leftKV.Key),
				strutil.HexOrString(leftKV.Value))
		}
	case diff.KeyValueValueDifferent:
		d.changedKV++

		colorcli.Faillnf("%s -> %s %s",
			strutil.String(leftKV.Key),
			colorcli.Red("- ", strutil.HexOrString(rightKV.Value)),
			colorcli.Green("+ ", strutil.HexOrString(leftKV.Value)))
	case diff.KeyValueLeftKeyMissing:
		d.missingKV++

		colorcli.Faillnf("%s",
			colorcli.Red("- ",
				strutil.String(rightKV.Key),
				" -> ",
				strutil.HexOrString(rightKV.Value)))
	case diff.KeyValueRightKeyMissing:
		d.untrackedKV++

		colorcli.Faillnf("%s",
			colorcli.Green("+ ",
				strutil.String(leftKV.Key),
				" -> ",
				strutil.HexOrString(leftKV.Value)))
	default:
		colorcli.Faillnf("unexpected key-value diff result type: %T",
			result)
	}

	return nil
}
