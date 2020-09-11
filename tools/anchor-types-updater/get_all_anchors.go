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
 * @Date:   2020-09-10T18:11:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-09-11T09:38:09+10:00
 */

package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
)

const (
	prefixComment = "//"
)

func getAnchors() (as []*anchorInfo, er error) {
	anchorsFile, err := os.Open(filePathAnchorProto)
	if err != nil {
		er = err
		return
	}
	defer anchorsFile.Close()

	anchorsReader := bufio.NewReader(anchorsFile)
	anchorsRE := regexp.MustCompile(`message\s+Anchor\s+{[^{}]*enum\s+Type\s+{\n([^{}]*)\n\s*}`)
	anchors := make([]*anchorInfo, 0, 0)

	anchorRE := regexp.MustCompile(`\s*(\w+)\s*=\s*(\d+)\s*;`)

	if loc := anchorsRE.FindReaderSubmatchIndex(anchorsReader); len(loc) == 4 {
		from, to := loc[2], loc[3]

		_, err := anchorsFile.Seek(int64(from), 0)
		if err != nil {
			er = err
			return
		}

		scn := bufio.NewScanner(io.LimitReader(anchorsFile, int64(to-from)))

		anchor := &anchorInfo{}

		for scn.Scan() {
			line := strings.TrimSpace(scn.Text())

			if strings.HasPrefix(line, prefixComment) {
				if len(anchor.Description) > 0 {
					anchor.Description += " "
				}

				anchor.Description += strings.TrimSpace(strings.TrimPrefix(line, prefixComment))
			} else if m := anchorRE.FindStringSubmatch(line); len(m) == 3 {
				anchor.Name = m[1]
				anchor.Number = m[2]

				anchors = append(anchors, anchor)

				anchor = &anchorInfo{}
			} else {
				er = fmt.Errorf("invalid line encountered when retrieving anchor types: %s", line)
				return
			}
		}
	} else {
		er = errors.New("cannot retrieve all anchor types")
		return
	}

	as = anchors
	return
}
