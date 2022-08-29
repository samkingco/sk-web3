// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "forge-std/Script.sol";

import "../src/ExampleNFT.sol";
import "../src/Metadata.sol";

contract Deploy is Script {
    // Deployable contracts
    ExampleNFT public nft;
    Metadata public metadata;

    function run() public {
        // Deployment config
        string memory chainId = vm.envString("CHAIN_ID");
        address owner = msg.sender;

        // Start deployment
        vm.startBroadcast();

        // Deploy metadata contract
        metadata = new Metadata(owner, "ipfs://<baseHash>/");

        // Deploy NFT contract
        nft = new ExampleNFT("Example NFT", "NFT", owner, owner, 7_50, address(metadata));

        string memory nftJson = string.concat(
            '{"address": "',
            vm.toString(address(nft)),
            '", "blockNumber": ',
            vm.toString(block.number),
            "}"
        );

        vm.writeFile(string.concat("packages/contracts/deploys/nft.", chainId, ".json"), nftJson);

        string memory metadataJson = string.concat(
            '{"address": "',
            vm.toString(address(metadata)),
            '", "blockNumber": ',
            vm.toString(block.number),
            "}"
        );

        vm.writeFile(
            string.concat("packages/contracts/deploys/metadata.", chainId, ".json"),
            metadataJson
        );

        // Finish deployment
        vm.stopBroadcast();
    }
}
