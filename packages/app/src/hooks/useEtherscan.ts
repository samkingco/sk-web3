import { useCallback } from "react";
import { etherscanBlockExplorers } from "wagmi";
import { chains } from "../components/EthereumProviders";
import { targetChainId } from "../utils/contracts";

export function useEtherscan() {
  const chain = chains.find((i) => i.id === targetChainId) || chains[0];

  let explorerURL = etherscanBlockExplorers.mainnet.url;
  if (chain.id !== 1) {
    // @ts-ignore
    explorerURL = etherscanBlockExplorers[chain.network].url;
  }

  const getTransactionUrl = useCallback(
    (hash: string) => `${explorerURL}/tx/${hash}`,
    [explorerURL]
  );

  const getAddressUrl = useCallback(
    (address: string) => `${explorerURL}/address/${address}`,
    [explorerURL]
  );

  return { getTransactionUrl, getAddressUrl };
}
