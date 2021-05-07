pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImageNft is ERC721, ERC721URIStorage, Ownable {

      uint256 nextId;   //TODO: Use openzeppelin counter class
      constructor() ERC721("ImageNft", "IMG") {
            nextId = 0;
      }

      function _baseURI() internal view virtual override returns (string memory) {
            //Fake Json URI resource data can be found under db.json file
            return "https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/";
      }

      function mint(string memory _tokenURI) public {
            _safeMint(msg.sender, nextId);
            _setTokenURI(nextId, _tokenURI);
            nextId++;
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
