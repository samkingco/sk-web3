import { useContractRead } from "wagmi";
import { Inventory } from "../components/Inventory";
import { Layout } from "../components/Layout";
import { MintButton } from "../components/MintButton";
import { Body, Mono } from "../components/Typography";
import { useEtherscan } from "../hooks/useEtherscan";
import { useIsMounted } from "../hooks/useIsMounted";
import { exampleNFT } from "../utils/contracts";

export default function HomePage() {
  const isMounted = useIsMounted();
  const { getAddressUrl } = useEtherscan();

  const { data: totalSupply } = useContractRead({
    ...exampleNFT,
    functionName: "totalSupply",
    watch: true,
  });

  return (
    <Layout>
      <Mono margin="0 0 24">
        <a href={getAddressUrl(exampleNFT.address)}>{exampleNFT.address}</a>
      </Mono>

      <Body margin="0 0 24">
        Total supply:{" "}
        {(isMounted ? totalSupply?.toNumber().toLocaleString() : null) ?? "-"}{" "}
        minted
      </Body>

      <MintButton />
      <Inventory />
    </Layout>
  );
}
