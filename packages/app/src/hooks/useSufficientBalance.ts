import { BigNumber } from "ethers";
import { useBalance } from "wagmi";

interface Options {
  address?: `0x${string}`;
  required: BigNumber;
}

export function useSufficientBalance({ address, required }: Options) {
  // Check the ETH balance
  const { data: balance, ...query } = useBalance({ addressOrName: address });

  // Sometimes we only want to render something when we know we have a balance, and the balance is insufficient.
  const hasInsufficientBalance = Boolean(balance && balance.value.lt(required));

  const hasSufficientBalance = Boolean(balance && balance.value.gte(required));

  return {
    balance,
    hasInsufficientBalance,
    hasSufficientBalance,
    ...query,
  };
}
