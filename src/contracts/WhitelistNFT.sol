// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/extensions/ERC721AQueryable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol";

error NoSaleActive();
error WhitelistSaleActiveNotActive();
error PublicSaleActiveNotActive();
error MaxMintPerTrxExceeded();
error YourWhitelistAmountExceeded();
error MaxSupplyExceeded();
error WrongEthAmount();

contract TokenName is ERC721AQueryable, Ownable, ReentrancyGuard {

    string public baseTokenURI = "https://baseTokenURI.com/myTokens/";
    string public unrevealedURI = "https://baseTokenURI.com/unrevealedURI.json";
    uint256 public immutable publicCost = 0.02 ether;
    uint256 public immutable whitelistCost = 0.01 ether;
    uint256 public immutable amountPerWhitelist = 2;
    uint256 public immutable maxSupply = 10000;
    uint256 public immutable maxMintAmountPerTx = 3;

    mapping(address => uint256) private boughtWhitelist;

    enum SaleStage {
        noSaleActive,
        whitelistSaleActive,
        publicSaleActive,
        revealed
    }

    SaleStage public saleStage = SaleStage.noSaleActive;

    event Mint(SaleStage saleStage, address minter, uint256 amount);

    constructor() ERC721A("TokenName", "TokenSymbol") Ownable(msg.sender){}

    function mint(uint256 _mintAmount) public payable {
        if (SaleStage.noSaleActive) revert NoSaleActive();

        if(SaleStage.whitelistSaleActive) _mintWhitelist(_mintAmount);
        if(SaleStage.publicSaleActive) _mintPublic(_mintAmount);

        emit Mint(saleStage, msg.msg.sender, _mintAmount);
    }

    function _mintWhitelist(uint256 _mintAmount) internal {
        if (boughtWhitelist[msg.sender] + _mintAmount > amountPerWhitelist) revert YourWhitelistAmountExceeded();
        if (totalSupply() + _mintAmount > maxSupply) revert MaxSupplyExceeded();
        if (msg.value * _mintAmount < whitelistCost) revert WrongEthAmount();

        boughtWhitelist[msg.sender] += amountPerWhitelist;
        _safeMint(msg.sender, _mintAmount);
    }

    function _mintPublic(uint256 _mintAmount) internal {
        if (_mintAmount > maxMintAmountPerTx) revert MaxMintPerTrxExceeded();
        if (totalSupply() + _mintAmount > maxSupply) revert MaxSupplyExceeded();
        if (msg.value < publicCost * _mintAmount) revert WrongEthAmount();

        _safeMint(msg.sender, _mintAmount);
    }

    function tokenURI(uint256 tokenId) override(ERC721A, IERC721A) public view returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();  

        if(saleStage != SaleStage.revealed){
            return unrevealedURI;
        }
        
        return string(abi.encodePacked(baseTokenURI, tokenId, ".json"));
    }

    function _startTokenId() override internal view virtual returns (uint256) {
        return 1;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function setUnrevealedURI(string memory uri) public onlyOwner {
        unrevealedURI = uri;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setSaleStage(uint256 _stage) public onlyOwner {
        saleStage = _stage;
    }

    function setWhitelistHash(
        bytes32 _rootHash
    ) public onlyOwner {
        whitelist1RootHash = _rootHash;
    }

    function isValidProofWhitelist(
        bytes32[] calldata proof,
        bytes32 leaf
    ) private view returns (bool) {
        return MerkleProof.verify(proof, whitelistRootHash, leaf);
    }

    function withdraw() public payable onlyOwner {
        require(payable(owner()).send(address(this).balance));
    }
}
