import styled from "@emotion/styled";
import { useContractRead } from "wagmi";
import { Inventory } from "../components/Inventory";
import { Layout } from "../components/Layout";
import { MintButton } from "../components/MintButton";
import { Heading, Mono, Subheading } from "../components/Typography";
import { useEtherscan } from "../hooks/useEtherscan";
import { useIsMounted } from "../hooks/useIsMounted";
import { exampleNFT } from "../utils/contracts";
import { trpc } from "../utils/trpc";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function HomePage() {
  const isMounted = useIsMounted();

  const { data: greeting } = trpc.greeting.useQuery({ name: "web3 dev" });

  const { getAddressUrl } = useEtherscan();
  const { data: totalSupply } = useContractRead({
    ...exampleNFT,
    functionName: "totalSupply",
    watch: true,
  });

  return (
    <Layout>
      <Heading margin="0 0 24">{greeting || "Loading"}</Heading>

      <Content>
        <div>
          <Subheading>Contract</Subheading>
          <Mono>
            Address:{" "}
            <a href={getAddressUrl(exampleNFT.address)}>{exampleNFT.address}</a>
          </Mono>
          <Mono>
            Minted:{" "}
            {(isMounted ? totalSupply?.toNumber().toLocaleString() : null) ??
              "-"}
          </Mono>
        </div>
        <MintButton />
        <Inventory />
      </Content>
    </Layout>
  );
}
