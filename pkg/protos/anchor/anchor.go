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
 * @Last modified time: 2020-05-07T18:02:24+10:00
 */

package anchor

//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=../../../docs --doc_opt=markdown,anchor.md -I ../ --go_out=paths=source_relative,plugins=grpc:../ anchor/anchor.proto
//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=../../../docs --doc_opt=html,anchor.html -I ../ anchor/anchor.proto
//go:generate ../../../node_sdk/node_modules/.bin/grpc_tools_node_protoc --plugin=protoc-gen-grpc=../../../node_sdk/node_modules/.bin/grpc_tools_node_protoc_plugin --grpc_out=generate_package_definition:../../../node_sdk/src/protos --proto_path=../ anchor/anchor.proto
//go:generate protoc --plugin=protoc-gen-ts=../../../node_sdk/node_modules/.bin/protoc-gen-ts --ts_out=../../../node_sdk/src/protos -I ../ anchor/anchor.proto
