const ImageNft = artifacts.require('ImageNft');
const { assert } = require('chai');
const fetch = require('node-fetch');

contract('ImageNft', (accounts) => {
  let imageNftContract;

  //Deplye the contract once before the tests

  beforeEach(async () => {
    ImageNft.new();
    imageNftContract = await ImageNft.deployed();
  });

  describe('depoloyment', async () => {
    it('shoud deploy sucessfully', async () => {
      const address = imageNftContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  
    it('shoud have a name and symbol', async () => {
      const name = await imageNftContract.name();
      const symbol = await imageNftContract.symbol();
      assert.equal(name, 'ImageNft');
      assert.equal(symbol, 'IMG');
    });
  });

  describe('minting', () => {
    it('should cost 0.01 ether to mint a token', async () => {
      let value = web3.utils.toWei('0.01', 'ether');
      let balanceBefore = await web3.eth.getBalance(accounts[2]);
      //Gas price set to 0 here to properly test the price
      let tokenResult = await imageNftContract.mint('token-uri-2', {from: accounts[2], value, gasPrice: 0});
      let balanceAfter = await web3.eth.getBalance(accounts[2]);
  
      assert.equal(balanceBefore - balanceAfter, value, 'Minting a token should const 0.01 ether');
      //TODO: test transaction with lower price
    });
  
    it('should have proper uri string of a minted token', async () => {
      const uriStr = 'token-uri-1';
      const baseUri = 'https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/';
      
      const result = await imageNftContract.mint(uriStr, {from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
      const tokenId = result.logs[0].args.tokenId;
  
      assert.equal(await imageNftContract.tokenURI(tokenId), baseUri + uriStr, `Token 0 shoud have URI String: ${baseUri + uriStr}`);
    });
  
    it('should return image url in the json response', async () => {
      // Create token
      const result = await imageNftContract.mint('token-uri-3', {from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});

      // Get the token id
      const tokenId = result.logs[0].args.tokenId; 
  
      // Get URI back
      const tokenUri = await imageNftContract.tokenURI(tokenId);
  
      // Fetch the Json data from the uri
      const tokenJson = await fetch(tokenUri).then((res) => res.json());
  
      assert.equal(tokenJson.image, 'image url here');
    });
  })

  describe('transfer', async () => {
    it('should be transferable between users', async () => {
      let ownerBefore = await imageNftContract.ownerOf(1);
      await imageNftContract.transferFrom(ownerBefore, accounts[4], 1, {from: ownerBefore});
      let ownerAfter = await imageNftContract.ownerOf(1);
      assert.equal(ownerAfter, accounts[4], "Should transfer token between users");
    });
  });

});

// TODO: Test: should have base uri
