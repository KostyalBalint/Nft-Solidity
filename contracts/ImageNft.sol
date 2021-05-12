pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ImageNft is ERC721, ERC721URIStorage, Ownable {
      using Counters for Counters.Counter;
      Counters.Counter private _tokenIds;
      mapping(string => bool) _uriExists;
      mapping(uint256 => uint256) _price; //If price is not 0, the token is for sale

      constructor() ERC721("ImageNft", "IMG") {}

      function _baseURI() internal view virtual override returns (string memory) {}

      function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
            super._burn(tokenId);
      }

      function mint(string memory _tokenURI) public payable returns (uint256) {
            //The creation of this token cost's a fixed 0.01 Ether
            require(msg.value >= 0.01 ether);
            require(!_uriExists[_tokenURI]);    //Would be better to check the hash of the img on the uri

            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            _safeMint(msg.sender, newItemId);
            _setTokenURI(newItemId, _tokenURI);
            _uriExists[_tokenURI] = true;
            
            return newItemId;
      }

      function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
      {
            require(_exists(tokenId), "ERC721Metadata: Token not exists");
            return super.tokenURI(tokenId);
      }

      function setForSale(uint256 tokenId, uint256 tokenPrice) external onlyOwnerofToken(tokenId) {
            require(tokenPrice != 0);
            _price[tokenId] = tokenPrice;

            //emit Approval(ownerOf(tokenId), address(this), tokenId);
      }

      function removeFromSale(uint256 tokenId) external onlyOwnerofToken(tokenId){
            _price[tokenId] = 0;
      }

      function buy(uint256 tokenId) external payable {
            address buyer = msg.sender;
            address seller = ownerOf(tokenId);
            uint payedPrice = msg.value;

            require(_price[tokenId] != 0, "This token is not for sale");
            require(payedPrice >= _price[tokenId]);

            // pay the seller
            payable(seller).transfer(payedPrice);

            // remove token from tokensForSale
            _price[tokenId] = 0;

            _transfer(seller, buyer, tokenId);
      }

      modifier onlyOwnerofToken(uint256 tokenId) {
      address owner = ownerOf(tokenId);   //ownerOf will revert if this is an invalid token
      require(owner == msg.sender);
      _;
    }
}