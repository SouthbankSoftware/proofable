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
 * @Date:   2020-12-17T15:45:07+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-12-17T17:57:18+11:00
 */

package trie

type (
	// Node represents a trie node
	Node = node
	// FullNode represents a full trie node
	FullNode = fullNode
	// ShortNode represents a short trie node
	ShortNode = shortNode
	// HashNode represents a hash trie node
	HashNode = hashNode
	// ValueNode represents a value trie node
	ValueNode = valueNode
)

var (
	// KeybytesToHex converts keybytes to hex
	KeybytesToHex = keybytesToHex
	// HexToKeybytes converts hex to keybytes
	HexToKeybytes = hexToKeybytes
	// DecodeNode decodes node
	DecodeNode = decodeNode
)
