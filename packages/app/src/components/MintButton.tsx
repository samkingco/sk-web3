import { BigNumber } from "ethers";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEtherscan } from "../hooks/useEtherscan";
import { useIsMounted } from "../hooks/useIsMounted";
import { useSufficientBalance } from "../hooks/useSufficientBalance";
import { exampleNFT } from "../utils/contracts";
import { formatEther } from "../utils/format-ether";
import { Button } from "./Button";
import { LoadingIndicator } from "./LoadingIndicator";
import { Mono } from "./Typography";

export function MintButton() {
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const { data: price } = useContractRead({
    ...exampleNFT,
    functionName: "PRICE",
  });

  // Check if they have enough to mint
  const { balance, hasInsufficientBalance } = useSufficientBalance({
    address,
    required: price || BigNumber.from(0),
  });

  // Prepare the mint transaction
  const prepare = usePrepareContractWrite({
    ...exampleNFT,
    functionName: "mint",
    overrides: {
      value: price,
    },
    enabled: Boolean(price),
  });

  // Send the transaction
  const {
    write,
    data: txData,
    isLoading: isWaitingOnWallet,
  } = useContractWrite(prepare.config);

  // Watch the for the transaction receipt
  const { isLoading: isWaitingOnTx, isSuccess } = useWaitForTransaction({
    confirmations: 1,
    hash: txData?.hash,
  });

  // Get the block explorer URL
  const { getTransactionUrl } = useEtherscan();
  const transactionLink = txData && getTransactionUrl(txData.hash);

  // if (!isMounted) return null;

  return (
    <div>
      <Button
        disabled={Boolean(!write || prepare.error)}
        onClick={() => write?.()}
      >
        Mint a token
      </Button>

      {hasInsufficientBalance && price && (
        <Mono subdued margin="16 0 0">
          Insufficient balance for minting. Need {formatEther(price)} ETH
        </Mono>
      )}

      {isWaitingOnWallet && (
        <Mono subdued margin="16 0 0">
          <LoadingIndicator /> Check wallet
        </Mono>
      )}

      {isWaitingOnTx && (
        <Mono subdued margin="16 0 0">
          <LoadingIndicator /> Transaction sent.{" "}
          {transactionLink && <a href={transactionLink}>View on explorer</a>}
        </Mono>
      )}

      {isSuccess && (
        <Mono subdued margin="16 0 0">
          Transaction sent successfully{" "}
          {transactionLink && <a href={transactionLink}>View on explorer</a>}
        </Mono>
      )}
    </div>
  );
}
