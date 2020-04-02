/*
 * provenx
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
 * @Date:   2020-03-31T12:29:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-02T13:08:12+11:00
 */

package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"time"

	"github.com/SouthbankSoftware/provenx/pkg/api"
	"github.com/SouthbankSoftware/provenx/pkg/authcli"
	anchorPB "github.com/SouthbankSoftware/provenx/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/provenx/pkg/protos/api"
	"github.com/SouthbankSoftware/provenx/pkg/strutil"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authenticate with ProvenDB
	creds, err := authcli.AuthenticateForGRPC(ctx,
		"https://apigateway.dev.provendb.com",
		true,
		"",
	)
	if err != nil {
		log.Panic(err)
	}

	// create a gRPC client
	err = api.WithAPIClient(
		"api.dev.provendb.com:443",
		creds,
		func(cli apiPB.APIServiceClient) error {
			// create an empty trie
			err := api.WithTrie(ctx, cli, func(id, root string) error {
				// set the key-values we want to prove. Note: the root is changed after we modify
				// the trie
				root, err := api.SetTrieKeyValues(ctx, cli, id, root,
					[]*apiPB.KeyValue{
						{Key: []byte("balcony/wind/speed"), Value: []byte("11km/h")},
						{Key: []byte("balcony/wind/direction"), Value: []byte("N")},
						{Key: []byte("living_room/temp"), Value: []byte("24.8℃")},
						{Key: []byte("living_room/Co2"), Value: []byte("564ppm")},
					})
				if err != nil {
					return err
				}

				// create a proof for the key-values
				triePf, err := api.CreateTrieProof(ctx, cli, id, root, anchorPB.Anchor_ETH)
				if err != nil {
					return err
				}

				// wait for the proof to be anchored to Ethereum
				tpCH, errCH := api.SubscribeTrieProof(ctx, cli, id, triePf.GetId())

				for tp := range tpCH {
					log.Printf("Anchoring proof: %s\n", tp.GetStatus())
					triePf = tp
				}

				// always check error from the error channel
				err = <-errCH
				if err != nil {
					return err
				}

				// verify the proof
				kvCH, rpCH, errCH := api.VerifyTrieProof(ctx, cli, id, triePf.GetId(),
					true, "proof.dot")

				// strip the anchor trie part from each key
				kvCH = api.InterceptKeyValueStream(ctx, kvCH,
					api.StripCompoundKeyAnchorTriePart)

				log.Println("key-values contained in the proof:")
				for kv := range kvCH {
					log.Printf("\t%s -> %s\n",
						strutil.String(kv.Key), strutil.String(kv.Value))
				}

				// always check error from the error channel
				err = <-errCH
				if err != nil {
					return err
				}

				rp := <-rpCH
				if !rp.GetVerified() {
					return fmt.Errorf("falsified proof: %s", rp.GetError())
				}

				log.Printf("the proof with a root hash of %s is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s\n",
					triePf.GetProofRoot(),
					triePf.GetAnchorType(),
					triePf.GetBlockNumber(),
					triePf.GetTxnId(),
					time.Unix(int64(triePf.GetBlockTime()), 0).Format(time.UnixDate),
					triePf.GetTxnUri(),
				)

				log.Println("the proof's dot graph is saved to `proof.dot`")

				// extract a subproof for just one key-value out of the proof
				err = api.CreateKeyValuesProof(ctx, cli, id, triePf.GetId(),
					&apiPB.KeyValuesFilter{
						Keys: []*apiPB.Key{
							{Key: []byte("living_room/Co2")},
						},
					},
					"living_room_Co2.pxsubproof")
				if err != nil {
					return err
				}

				log.Println("the subproof for the key `living_room/Co2` is saved to `living_room_Co2.pxsubproof`")
				return nil
			})
			if err != nil {
				return err
			}

			// verify the subproof independently
			kvCH, rpCH, errCH := api.VerifyKeyValuesProof(ctx, cli,
				"living_room_Co2.pxsubproof",
				true, "living_room_Co2_subproof.dot")

			// strip the anchor trie part from each key
			kvCH = api.InterceptKeyValueStream(ctx, kvCH,
				api.StripCompoundKeyAnchorTriePart)

			log.Println("key-values contained in the subproof:")
			for kv := range kvCH {
				log.Printf("\t%s -> %s\n",
					strutil.String(kv.Key), strutil.String(kv.Value))
			}

			// always check error from the error channel
			err = <-errCH
			if err != nil {
				return err
			}

			rp := <-rpCH
			if !rp.GetVerified() {
				return fmt.Errorf("falsified subproof: %s", rp.GetError())
			}

			et, err := api.GetEthTrieFromKeyValuesProof("living_room_Co2.pxsubproof")
			if err != nil {
				return err
			}
			merkleRoot := hex.EncodeToString(et.Root())

			log.Printf("the subproof with a root hash of %s is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s\n",
				merkleRoot,
				et.AnchorType,
				et.BlockNumber,
				et.TxnID,
				time.Unix(int64(et.BlockTime), 0).Format(time.UnixDate),
				et.TxnURI,
			)

			log.Println("the subproof's dot graph is saved to `living_room_Co2_subproof.dot`")

			return nil
		})
	if err != nil {
		log.Panic(err)
	}
}
