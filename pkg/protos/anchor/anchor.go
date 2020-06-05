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
 * @Date:   2020-03-18T13:40:53+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-02T14:48:23+10:00
 */

package anchor

//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=markdown,anchor.md:../../../docs --go_out=paths=source_relative,plugins=grpc:../ -I ../ anchor/anchor.proto
//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=html,anchor.html:../../../docs -I ../ anchor/anchor.proto
//go:generate protoc --plugin=protoc-gen-ts=../../../node_sdk/node_modules/.bin/protoc-gen-ts --plugin=protoc-gen-grpc=../../../node_sdk/node_modules/.bin/grpc_tools_node_protoc_plugin --ts_out=service=grpc-node:../../../node_sdk/src/protos --js_out=import_style=commonjs,binary:../../../node_sdk/src/protos --grpc_out=../../../node_sdk/src/protos -I ../ anchor/anchor.proto
