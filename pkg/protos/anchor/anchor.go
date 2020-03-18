/*
 * @Author: guiguan
 * @Date:   2020-03-18T13:40:53+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T13:52:49+11:00
 */

package anchor

//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=. --doc_opt=markdown,docs.md -I ../ --go_out=paths=source_relative,plugins=grpc:../ anchor/anchor.proto
