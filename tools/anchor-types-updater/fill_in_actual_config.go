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
 * @Date:   2020-09-10T18:48:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-09-10T23:25:32+10:00
 */

package main

import (
	"strings"

	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/yaml"
)

func fillInActualConfig(anchors []*anchorInfo) error {
	bsCfg := config.New("base")
	bsCfg.AddDriver(yaml.Driver)
	err := bsCfg.LoadFiles(fileAnchorBaseValues)
	if err != nil {
		return err
	}

	owCfg := config.New("overwrite")
	owCfg.AddDriver(yaml.Driver)
	err = owCfg.LoadFiles(fileAnchorOverwriteValues)
	if err != nil {
		return err
	}

	err = config.LoadData(
		toStrMap(bsCfg.Get("anchor").(map[interface{}]interface{})),
		toStrMap(owCfg.Get("spec.values.anchor").(map[interface{}]interface{})),
	)
	if err != nil {
		return err
	}

	baseType := "<<<"

	for i, anchor := range anchors {
		cfgPath := strings.ReplaceAll(strings.ToLower(anchor.Name), "_", ".")
		if !strings.HasPrefix(anchor.Name, baseType) {
			baseType = anchor.Name

			if i+1 < len(anchors) && strings.HasPrefix(anchors[i+1].Name, baseType) {
				cfgPath += ".testnet"
			}
		}

		if config.Bool(cfgPath + ".enabled") {
			anchor.Enabled = true
			anchor.BatchSize = config.String(cfgPath + ".batch.size")
			anchor.BatchTime = config.String(cfgPath + ".batch.time")
		}
	}

	return nil
}

func toStrMap(m map[interface{}]interface{}) map[string]interface{} {
	result := make(map[string]interface{}, len(m))

	for k, v := range m {
		result[k.(string)] = v
	}

	return result
}
