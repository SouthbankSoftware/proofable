/*
 * proofable
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
 * @Date:   2020-03-16T17:43:29+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package cmd

import (
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	"github.com/SouthbankSoftware/proofable/pkg/diff"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/strutil"
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
				strutil.String(strutil.BytesWithoutNullChar(leftKV.Key)),
				strutil.HexOrString(leftKV.Value))
		}
	case diff.KeyValueValueDifferent:
		d.changedKV++

		colorcli.Faillnf("%s -> %s %s",
			strutil.String(strutil.BytesWithoutNullChar(leftKV.Key)),
			colorcli.Red("- ", strutil.HexOrString(rightKV.Value)),
			colorcli.Green("+ ", strutil.HexOrString(leftKV.Value)))
	case diff.KeyValueLeftKeyMissing:
		d.missingKV++

		colorcli.Faillnf("%s",
			colorcli.Red("- ",
				strutil.String(strutil.BytesWithoutNullChar(rightKV.Key)),
				" -> ",
				strutil.HexOrString(rightKV.Value)))
	case diff.KeyValueRightKeyMissing:
		d.untrackedKV++

		colorcli.Faillnf("%s",
			colorcli.Green("+ ",
				strutil.String(strutil.BytesWithoutNullChar(leftKV.Key)),
				" -> ",
				strutil.HexOrString(leftKV.Value)))
	default:
		colorcli.Faillnf("unexpected key-value diff result type: %T",
			result)
	}

	return nil
}
