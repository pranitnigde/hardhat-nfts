// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

error  RandomIpfsNft__TransferFailed();
error RandomIpfsNft__LowFund();

contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {

    enum Breed {
        pug,
        shiba,
        huskey
    }
    
    uint64 private immutable i_subscriptionId;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUMWORDS =  1;

    uint256 private s_tokenId;
    uint256 private immutable i_mintFee;
    mapping (uint256 => address) s_requestIdTOSender;
    string[] internal s_dogTokenUris;
    
    event nftRequested(uint256 requestId, address sender);
    event NftMinted(address owner, Breed dogBreed);

    constructor(uint64 subscriptionId, 
        address vrfCoordinator,
        bytes32 keyHash,
        uint32 callbackGasLimit,
        uint256 mintFee,
        string[3] memory dogTokenUris
    )  VRFConsumerBaseV2(vrfCoordinator) ERC721("Random Ipfs Nft", "RIN"){
        i_subscriptionId = subscriptionId;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;
        s_tokenId = 0;
        i_mintFee = mintFee;
        s_dogTokenUris = dogTokenUris;
    }

    function request() public payable returns (uint256 requestId) {
        if(msg.value < i_mintFee)
            revert RandomIpfsNft__LowFund();
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUMWORDS
        );
        s_requestIdTOSender[requestId] = msg.sender;
        emit nftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address nftOwner = s_requestIdTOSender[requestId];
        s_tokenId ++;
        uint rare = randomWords[0] % 100;
        
        _mint(nftOwner, s_tokenId);
        Breed dogbreed = getDogBreed(rare);
        _setTokenURI(s_tokenId, s_dogTokenUris[ uint256(dogbreed) ]);
        emit NftMinted(nftOwner, dogbreed);
    }

    function withDraw() public onlyOwner {
        uint amount = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        if(!success){
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getDogBreed(uint256 rare) private pure returns(Breed){
        if( rare > 90 ){
           return Breed.huskey;
        }
        if(rare > 60){
            return Breed.shiba;
        }
        return Breed.pug;
    }

    function getMintFee() public view returns(uint256){
        return i_mintFee;
    }

}