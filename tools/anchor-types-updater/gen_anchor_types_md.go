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
 * @Date:   2020-09-10T23:19:49+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-09-10T23:37:17+10:00
 */

package main

import (
	"os"
	"text/template"
)

func genAnchorTypesMD(anchors []*anchorInfo) error {
	tmpl, err := template.ParseFiles(fileMarkdownTemplate)
	if err != nil {
		return err
	}

	mdFile, err := os.Create(fileOutputMarkdown)
	if err != nil {
		return err
	}

	return tmpl.Execute(mdFile, anchors)
}
