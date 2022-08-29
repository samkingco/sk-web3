// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "solmate/tokens/ERC721.sol";
import "solmate/auth/Owned.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "./IMetadata.sol";

/// @author Sam King (samking.eth)
/// @title  NFT contract
/// @notice Includes common functions for NFT projects e.g. royalties, withdrawals and
///         a separate metadata contract.
contract ExampleNFT is ERC721, Owned {
    /* ------------------------------------------------------------------------
       S T O R A G E
    ------------------------------------------------------------------------ */

    uint256 public constant PRICE = 1 ether;

    uint256 public nextTokenId = 1;

    IMetadata internal _metadata;

    /// @dev Store info about token royalties
    struct RoyaltyInfo {
        address receiver;
        uint24 amount;
    }

    RoyaltyInfo internal _royaltyInfo;

    /* ------------------------------------------------------------------------
       E R R O R S
    ------------------------------------------------------------------------ */

    error IncorrectPaymentAmount();
    error ZeroBalance();
    error WithdrawFailed();

    /* ------------------------------------------------------------------------
       E V E N T S
    ------------------------------------------------------------------------ */

    event Initialized();
    event MetadataUpdated(address indexed prevMetadata, address metadata);
    event RoyaltiesUpdated(address indexed receiver, uint256 indexed amount);

    /* ------------------------------------------------------------------------
       I N I T
    ------------------------------------------------------------------------ */

    constructor(
        string memory name,
        string memory symbol,
        address owner,
        address royaltiesReceiver,
        uint256 royaltiesAmount,
        address metadata
    ) ERC721(name, symbol) Owned(owner) {
        _royaltyInfo = RoyaltyInfo(royaltiesReceiver, uint24(royaltiesAmount));
        _metadata = IMetadata(metadata);
        emit Initialized();
    }

    /* ------------------------------------------------------------------------
       M I N T
    ------------------------------------------------------------------------ */

    function mint() external payable {
        if (msg.value != PRICE) revert IncorrectPaymentAmount();
        _mint(msg.sender, nextTokenId);
        ++nextTokenId;
    }

    /* ------------------------------------------------------------------------
       M E T A D A T A
    ------------------------------------------------------------------------ */

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _metadata.tokenURI(tokenId);
    }

    function setMetadata(address metadata) public onlyOwner {
        emit MetadataUpdated(address(_metadata), metadata);
        _metadata = IMetadata(metadata);
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }

    /* ------------------------------------------------------------------------
       R O Y A L T I E S
    ------------------------------------------------------------------------ */

    /// @notice EIP-2981 royalty standard for on-chain royalties
    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = _royaltyInfo.receiver;
        royaltyAmount = (salePrice * _royaltyInfo.amount) / 10_000;
    }

    /// @dev Extend `supportsInterface` to suppoer EIP-2981
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        // EIP-2981 = bytes4(keccak256("royaltyInfo(uint256,uint256)")) == 0x2a55205a
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }

    /// @notice Update royalty information
    /// @param receiver The receiver of royalty payments
    /// @param amount The royalty percentage with two decimals (10000 = 100)
    function setRoyaltyInfo(address receiver, uint256 amount) external onlyOwner {
        emit RoyaltiesUpdated(receiver, amount);
        _royaltyInfo = RoyaltyInfo(receiver, uint24(amount));
    }

    /* ------------------------------------------------------------------------
       W I T H D R A W
    ------------------------------------------------------------------------ */

    function withdrawAllETH() external onlyOwner {
        if (address(this).balance == 0) revert ZeroBalance();
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        if (!success) revert WithdrawFailed();
    }

    function withdrawAllERC20(IERC20 token) external onlyOwner {
        token.transfer(owner, token.balanceOf(address(this)));
    }
}
