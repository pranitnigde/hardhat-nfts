// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721{

    uint256 private s_tokenId;
    string private constant TOKEN_URI = "https://ipfs.io/ipfs/QmZuEvdfbR59sWvRmXNDaeMfHSUTfQoHhWsCX6bGKhsLTS?filename=doggyNft.metadata.json";

    constructor() ERC721("DoggiNFT", "DNFT") {
        s_tokenId = 0;
    }

    function mintNft() public returns (uint256) {
        s_tokenId += 1;
        _safeMint(msg.sender, s_tokenId);
        return s_tokenId;
    }

    function tokenURI(uint256 /* tokenId */) public view override returns (string memory) {
        return TOKEN_URI;     
    }

    function getTokenId() public view returns (uint256) {
        return s_tokenId;
    }

}