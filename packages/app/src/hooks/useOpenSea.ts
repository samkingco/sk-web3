import { useCallback } from "react";
import { useNetwork } from "wagmi";

export function useOpenSea() {
  const { chain } = useNetwork();
  let openSeaUrl = "https://opensea.io";
  let assetName = chain?.id === 1 ? "ethereum" : chain?.name.toLowerCase();

  if (chain?.testnet) {
    openSeaUrl = "https://testnets.opensea.io";
  }

  const getAssetUrl = useCallback(
    (contract: string, tokenId: string) =>
      `${openSeaUrl}/assets/${assetName}/${contract}/${tokenId}`,
    [openSeaUrl, assetName]
  );

  return { getAssetUrl };
}
