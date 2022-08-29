# sk-web3

This was built on top of the fantastic work of [@frolic](https://twitter.com/frolic)'s [web3-scaffold](https://github.com/holic/web3-scaffold) template repo.

It has a couple of differences that are mainly personal preferences of mine, and also includes fonts that I use in my personal projects.

## `packages/app`

[NextJS](https://nextjs.org/) app with [TypeScript](https://www.typescriptlang.org/). Uses [React Query](https://tanstack.com/query/v4/docs/overview) and [GraphQL Request](https://github.com/prisma-labs/graphql-request) for data fetching from both REST and GraphQL APIs. Styling/CSS with [Emotion](https://emotion.sh) because I still like writing CSS myself, sorry Tailwind lovers!

Wallets are connected with [ConnectKit](https://docs.family.co/connectkit#connectkit) since I like how much you can customize it to fit the aesthetic of each site, and contract interactions use hooks from [wagmi](https://wagmi.sh).

## `packages/contracts`

Uses [Foundry](https://book.getfoundry.sh/) to compile, test, and deploy smart contracts.

Features the latest solidity compiler, currently `v0.8.17`, and relies solely on `forge` scripts for deployment. This means we can load env vars, verify on etherscan, and have all the transactions happen (usually) in a single block.

#### Deploy script example

```sh
# Load the env vars
source .env

# Run the script
forge script packages/contracts/script/Deploy.s.sol --ledger --hd-paths "m/44'/60'/0'/0/0" --sender <MY_ADDRESS> --broadcast --verify -vvv
```

## `packages/subgraph`

_For now_ until they sunset the hosted service. This may change in future as other tools appear. I'm really excited about what [Ponder](https://github.com/0xOlias/ponder) can do.
