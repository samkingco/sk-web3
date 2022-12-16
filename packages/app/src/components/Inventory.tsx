import { useAccount } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import { useMarketplace } from "../hooks/useMarketplace";
import { exampleNFT } from "../utils/contracts";
import { trpc } from "../utils/trpc";
import { LoadingIndicator } from "./LoadingIndicator";
import { Body, Subheading } from "./Typography";

export function Inventory() {
  const isMounted = useIsMounted();
  const { getOpenSeaUrl } = useMarketplace();
  const { address } = useAccount();

  const { data, isLoading } = trpc.inventory.byOwner.useQuery(
    { owner: address ? address.toLowerCase() : "" },
    { enabled: Boolean(address) }
  );

  if (!isMounted || !address) return null;

  if (!data || isLoading) {
    return (
      <Body>
        <LoadingIndicator /> Loading
      </Body>
    );
  }

  return (
    <div>
      <Subheading>Inventory</Subheading>
      <div>
        {data.tokens.length > 0 ? (
          <>
            {data.tokens.map((token) => (
              <a
                key={token.id}
                href={getOpenSeaUrl(exampleNFT.address, token.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Body>Token #{token.id}</Body>
              </a>
            ))}
          </>
        ) : (
          <Body>You don't own any NFTs</Body>
        )}
      </div>
    </div>
  );
}
