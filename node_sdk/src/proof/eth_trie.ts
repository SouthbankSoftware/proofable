export interface EthTrie {
  anchorType: string;
  txnId: string;
  txnUri: string;
  blockTime: number;
  blockTimeNano: number;
  blockNumber: number;
  trieNodes: string[];
}

export const defaultEthTrie: EthTrie = {
  anchorType: "ETH",
  txnId: "",
  txnUri: "",
  blockTime: 0,
  blockTimeNano: 0,
  blockNumber: 0,
  trieNodes: [],
};
