pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ImageNft is ERC721, ERC721URIStorage, Ownable {
      using Counters for Counters.Counter;
      Counters.Counter private _tokenIds;
      mapping(string => bool) _uriExists;

      //uint256 nextId;   //TODO: Use openzeppelin counter class
      constructor() ERC721("ImageNft", "IMG") {}

      function _baseURI() internal view virtual override returns (string memory) {
            //Fake Json URI resource data can be found under db.json file
            return "https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/";
      }

      function mint(string memory _tokenURI) public payable returns (uint256) {
            //The creation of this token cost's a fixed 0.01 Ether
            require(msg.value == 0.01 ether);
            require(!_uriExists[_tokenURI]);    //Would be better to check the hash of the img on the uri

            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            _safeMint(msg.sender, newItemId);
            _setTokenURI(newItemId, _tokenURI);
            _uriExists[_tokenURI] = true;
            
            return newItemId;
      }

      function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
            super._burn(tokenId);
      }

      function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
      {
            require(_exists(tokenId), "ERC721Metadata: Token not exists");
            return super.tokenURI(tokenId);
      }
}
