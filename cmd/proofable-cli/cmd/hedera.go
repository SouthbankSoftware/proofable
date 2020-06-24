/*
 * @Author: guiguan
 * @Date:   2020-06-22T15:01:12+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-22T15:14:23+10:00
 */

package cmd

import (
	"fmt"
	"strings"

	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
)

func getBlockNumberString(
	anchorType string,
	blockTime,
	blockTimeNano,
	blockNumber uint64) string {
	if strings.HasPrefix(anchorType, anchorPB.Anchor_HEDERA.String()) {
		return fmt.Sprintf("%v.%v", blockTime, blockTimeNano)
	}

	return fmt.Sprintf("%v", blockNumber)
}
