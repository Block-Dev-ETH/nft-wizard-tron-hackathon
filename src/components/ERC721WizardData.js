import React, { useEffect } from "react";
import "../App.css";

const hljs = require("highlight.js");
var hljsDefineSolidity = require("highlightjs-solidity");

hljsDefineSolidity(hljs);
hljs.initHighlightingOnLoad();

export default function WizardData({
  paused,
  maxMintPerTrx,
  name,
  baseTokenURI,
  unrevealed,
  unrevealedURI,
  cost,
  maxSupply,
  symbol,
  botPrevention,
  handleWizardCode,
}) {
  const setPausedFunctionCode = `
    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }
    `;

  const setUnrevealedURITokenFlag = `
        if(!reveled){
            return unrevealedURI;
        }
    `;

  const setUnrevealedURIFunctionCode = `
    function setReveled(bool _state) public onlyOwner {
        reveled = _state;
    }

    function setUnrevealedURI(string memory uri) public onlyOwner {
        unrevealedURI = uri;
    }
    `;

  let text = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/extensions/ERC721AQueryable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol";
${paused ? "\nerror MintPaused();" : ""}${
    botPrevention ? "\nerror WaitOneMinute();" : ""
  }
error MaxMintPerTrxExceeded();
error MaxSupplyExceeded();
error WrongEthAmount();

contract ${name} is ERC721AQueryable, Ownable, ReentrancyGuard {

    string public baseTokenURI = "${baseTokenURI}";${
    unrevealed
      ? '\n    string public unrevealedURI = "' + unrevealedURI + '";'
      : ""
  }
    uint256 public immutable cost = ${cost} * 10 ** 18;
    uint256 public immutable maxSupply = ${maxSupply};
    uint256 public immutable maxMintAmountPerTx = ${maxMintPerTrx};${
    paused ? "\n    bool public paused = true;" : ""
  }${unrevealed ? "\n    bool public reveled = false;" : ""}${
    botPrevention
      ? "\n    mapping(address => uint256) public lastTimeBought;"
      : ""
  }

    constructor() ERC721A("${name}", "${symbol}") Ownable(msg.sender){}

    function mint(uint256 _mintAmount) public payable nonReentrant{${
      paused ? "\n        if (paused) revert MintPaused();" : ""
    }${
    botPrevention
      ? "\n        if (lastTimeBought[msg.sender] + 1 minutes < block.timestamp && lastTimeBought[msg.sender] != 0) revert WaitOneMinute();"
      : ""
  }
        if (_mintAmount > maxMintAmountPerTx) revert MaxMintPerTrxExceeded();
        if (totalSupply() + _mintAmount > maxSupply) revert MaxSupplyExceeded();
        if (msg.value < cost * _mintAmount) revert WrongEthAmount();${
          botPrevention
            ? "\n\n        lastTimeBought[msg.sender] = block.timestamp;"
            : ""
        }
        
        _safeMint(_msgSender(), _mintAmount);
    }

    function tokenURI(uint256 tokenId) override(ERC721A, IERC721A) public view returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();  
        ${unrevealed ? setUnrevealedURITokenFlag : ""}
        return string(abi.encodePacked(baseTokenURI, tokenId, ".json"));
    }

    function _startTokenId() override internal view virtual returns (uint256) {
        return 1;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }
    ${paused ? setPausedFunctionCode : ""}${
    unrevealed ? setUnrevealedURIFunctionCode : ""
  }
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
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
