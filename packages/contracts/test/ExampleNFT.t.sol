// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "solmate/tokens/ERC20.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "../src/ExampleNFT.sol";
import "../src/Metadata.sol";
import "../src/IMetadata.sol";

contract CustomCoin is ERC20 {
    constructor() ERC20("Dummy ERC20", "DUMMY", 18) {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}

contract ExampleNFTTest is Test {
    ExampleNFT private nft;
    Metadata private metadata;

    address private owner = mkaddr("owner");
    address private minter = mkaddr("minter");

    function mkaddr(string memory name) public returns (address) {
        address addr = address(uint160(uint256(keccak256(abi.encodePacked(name)))));
        vm.label(addr, name);
        return addr;
    }

    function setUp() public {
        metadata = new Metadata(owner, "ipfs://<baseHash>/");
        nft = new ExampleNFT("Example NFT", "NFT", owner, owner, 1000, address(metadata));
        vm.deal(owner, 10 ether);
        vm.deal(minter, 10 ether);
    }

    function testMint() public {
        assertEq(nft.balanceOf(minter), 0);

        vm.expectRevert(ExampleNFT.IncorrectPaymentAmount.selector);
        nft.mint{value: 0.1 ether}();
        assertEq(nft.balanceOf(minter), 0);

        vm.prank(minter);
        nft.mint{value: 1 ether}();
        assertEq(nft.balanceOf(minter), 1);

        vm.prank(minter);
        nft.mint{value: 1 ether}();
        assertEq(nft.balanceOf(minter), 2);
    }

    function testWithdrawAll() public {
        assertEq(address(nft).balance, 0);
        assertEq(owner.balance, 10 ether);

        vm.prank(owner);
        vm.expectRevert(ExampleNFT.ZeroBalance.selector);
        nft.withdrawAllETH();

        vm.prank(minter);
        nft.mint{value: 1 ether}();
        assertEq(address(nft).balance, 1 ether);

        vm.prank(owner);
        nft.withdrawAllETH();
        assertEq(owner.balance, 11 ether);
    }

    function testWithdrawAllERC20() public {
        CustomCoin coin = new CustomCoin();

        vm.startPrank(minter);
        coin.mint(100);
        coin.transfer(address(nft), 50);
        vm.stopPrank();

        assertEq(coin.balanceOf(address(minter)), 50);
        assertEq(coin.balanceOf(address(nft)), 50);
        assertEq(coin.balanceOf(address(owner)), 0);

        vm.prank(owner);
        nft.withdrawAllERC20(IERC20(address(coin)));
        assertEq(coin.balanceOf(address(minter)), 50);
        assertEq(coin.balanceOf(address(nft)), 0);
        assertEq(coin.balanceOf(address(owner)), 50);
    }
}
