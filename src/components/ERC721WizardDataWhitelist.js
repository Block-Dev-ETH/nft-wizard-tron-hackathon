import React, { useEffect } from "react";
import "../App.css";
const hljs = require("highlight.js");
var hljsDefineSolidity = require("highlightjs-solidity");

hljsDefineSolidity(hljs);
hljs.initHighlightingOnLoad();

export default function WizardDataWhitelist({
  name,
  symbol,
  baseTokenURI,
  unrevealedURI,
  publicCost,
  whitelistCost,
  amountPerWhitelist,
  maxSupply,
  maxMintPerTrx,
  handleWizardCode,
}) {
  let text = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/extensions/ERC721AQueryable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol";

error NoSaleActive();
error WhitelistSaleActiveNotActive();
error PublicSaleActiveNotActive();
error YouAreNotWhitelisted();
error MaxMintPerTrxExceeded();
error YourWhitelistAmountExceeded();
error MaxSupplyExceeded();
error WrongEthAmount();

contract ${name} is ERC721AQueryable, Ownable, ReentrancyGuard {

    string public baseTokenURI = "${baseTokenURI}";
    string public unrevealedURI = "${unrevealedURI}";
    uint256 public immutable publicCost = ${publicCost} * 10 ** 18;
    uint256 public immutable whitelistCost = ${whitelistCost} * 10 ** 18;
    uint256 public immutable amountPerWhitelist = ${amountPerWhitelist};
    uint256 public immutable maxSupply = ${maxSupply};
    uint256 public immutable maxMintPerTrx = ${maxMintPerTrx};

    bytes32 public whitelistRootHash;
    mapping(address => uint256) private boughtWhitelist;

    enum SaleStage {
        noSaleActive,
        whitelistSaleActive,
        publicSaleActive,
        revealed
    }

    SaleStage public saleStage = SaleStage.noSaleActive;

    event Mint(SaleStage saleStage, address minter, uint256 amount);

    constructor() ERC721A("${name}", "${symbol}") Ownable(msg.sender){}

    function mint(uint256 _mintAmount, bytes32[] calldata _proof) public payable nonReentrant{
        if (saleStage == SaleStage.noSaleActive) revert NoSaleActive();
        if (saleStage == SaleStage.revealed) revert NoSaleActive();
        
        if (totalSupply() + _mintAmount > maxSupply) revert MaxSupplyExceeded();

        if(saleStage == SaleStage.whitelistSaleActive) _mintWhitelist(_mintAmount, _proof);
        if(saleStage == SaleStage.publicSaleActive) _mintPublic(_mintAmount);

        _safeMint(msg.sender, _mintAmount);
        emit Mint(saleStage, msg.sender, _mintAmount);
    }
    
    function _mintWhitelist(uint256 _mintAmount, bytes32[] calldata _proof) internal {
        if (isValidProofWhitelist(_proof, keccak256(abi.encodePacked(msg.sender)))) revert YouAreNotWhitelisted();
        if (boughtWhitelist[msg.sender] + _mintAmount > amountPerWhitelist) revert YourWhitelistAmountExceeded();
        if (msg.value < whitelistCost * _mintAmount) revert WrongEthAmount();
        
        boughtWhitelist[msg.sender] += amountPerWhitelist;
    }

    function _mintPublic(uint256 _mintAmount) internal {
        if (_mintAmount > maxMintPerTrx) revert MaxMintPerTrxExceeded();
        if (msg.value < publicCost * _mintAmount) revert WrongEthAmount();
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

    function setSaleStage(SaleStage _stage) public onlyOwner {
        saleStage = _stage;
    }

    function getSaleStage() public view returns(SaleStage){
        return saleStage;
    }

    function setWhitelistHash(
        bytes32 _rootHash
    ) public onlyOwner {
        whitelistRootHash = _rootHash;
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
`;

  useEffect(() => {
    handleWizardCode(text);
  }, [text]);

  const highlightedCode = hljs.highlight(text, {
    language: "solidity",
  }).value;

  return (
    <pre className="hljs">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
    </pre>
  );
}
