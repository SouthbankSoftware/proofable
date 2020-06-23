import { sha3 } from "../hasher";

export abstract class EthTrie {
  anchorType: string = "ETH";
  txnId: string = "";
  txnUri: string = "";
  blockTime: number = 0;
  blockTimeNano: number = 0;
  blockNumber: number = 0;
  trieNodes: string[] = [];

  get root(): string {
    if (this.trieNodes.length > 0) {
      return sha3(Buffer.from(this.trieNodes[0], "base64"));
    }

    return sha3("0x");
  }
}
