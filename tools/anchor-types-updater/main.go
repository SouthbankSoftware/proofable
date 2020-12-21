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
 * @Date:   2020-09-10T16:04:39+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-12-21T17:36:44+11:00
 */

package main

const (
	filePathAnchorProto       = "./pkg/protos/anchor/anchor.proto"
	fileAnchorBaseValues      = "./tools/anchor-types-updater/manifests/values.yaml"
	fileAnchorOverwriteValues = "./tools/anchor-types-updater/manifests/provendb-anchor.yaml"
	fileMarkdownTemplate      = "./tools/anchor-types-updater/markdown.tmpl"
	fileOutputMarkdown        = "./docs/concepts/anchor_types.md"
)

type anchorInfo struct {
	Name,
	Number,
	Description,
	BatchSize,
	BatchTime string
	Enabled bool
}

func main() {
	anchors, err := getAnchors()
	if err != nil {
		panic(err)
	}

	err = fillInActualConfig(anchors)
	if err != nil {
		panic(err)
	}

	err = genAnchorTypesMD(anchors)
	if err != nil {
		panic(err)
	}
}
