pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImageNft is ERC721, ERC721URIStorage, Ownable {
      mapping (uint256 => string) private _tokenURIs;
      constructor() ERC721("ImageNft", "IMG") {}

      function safeMint(address to, uint256 tokenId, string memory _tokenURI) public onlyOwner {
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, _tokenURI);
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
