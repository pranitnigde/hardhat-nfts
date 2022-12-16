// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import 'base64-sol/base64.sol';

contract DynamicSvgNft is ERC721{

    using Counters for Counters.Counter;
    AggregatorV3Interface internal i_priceFeed ;
    Counters.Counter private _tokenIdCounter;
    mapping (uint => int256) private s_tokenHighValue;

    string private s_lowImageUri;
    string private s_highImageUri;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";

    constructor(string memory lowSvg, string memory highSvg, address priceFeedAddress) ERC721("DynamicSvgNft", "DSN"){
        s_lowImageUri = svgToUri(lowSvg);
        s_highImageUri = svgToUri(highSvg);
        i_priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
    }

    function svgToUri(string memory svg) internal pure returns(string memory){
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function mintNft() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint tokenId) public view override returns(string memory) {
        if(!_exists(tokenId))
            revert();

        string memory baseUri =  "data:application/json;base64,";
        string memory imageURI = "";
        (,int256 price,,,) = i_priceFeed.latestRoundData();
        
        if(price >= s_tokenHighValue[tokenId]){
            
        }
        return string(
            abi.encodePacked(
                baseUri,
                Base64.encode(
                    bytes(
                         abi.encodePacked(
                                '{"name":"',
                                '"Dynamic nft"' , // You can add whatever name here
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                    )
                )
            )
        );
    }

}