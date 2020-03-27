/*
 * @Author: guiguan
 * @Date:   2020-03-18T13:40:53+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-27T17:16:00+11:00
 */

package anchor

//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=../../../docs --doc_opt=markdown,anchor.md -I ../ --go_out=paths=source_relative,plugins=grpc:../ anchor/anchor.proto
//go:generate protoc --plugin=protoc-gen-doc=../protoc-gen-doc --doc_out=../../../docs --doc_opt=html,anchor.html -I ../ anchor/anchor.proto
