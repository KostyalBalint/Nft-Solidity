const ImageNft = artifacts.require('ImageNft');
const {expectRevert} = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const fetch = require('node-fetch');

contract('ImageNft', (accounts) => {
  let imageNftContract;

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
      const value = web3.utils.toWei('0.01', 'ether');
      const balanceBefore = await web3.eth.getBalance(accounts[2]);
      //Gas price set to 0 here to properly test the price
      const tokenResult = await imageNftContract.mint('first-token-uri', {from: accounts[2], value, gasPrice: 0});
      const balanceAfter = await web3.eth.getBalance(accounts[2]);
  
      assert.equal(balanceBefore - balanceAfter, value, 'Minting a token should const 0.01 ether');
    });

    it('should revet a transaction with lower ether', async () => {
      const value = web3.utils.toWei('0.01', 'ether') - 1;
      const account = accounts[3];
      await expectRevert(imageNftContract.mint('first-token-uri', {from: account, value, gasPrice: 0}), "revert");
    });
  
    it('should have proper uri string of a minted token', async () => {
      const uriStr = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png';
      
      const result = await imageNftContract.mint(uriStr, {from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
      const tokenId = result.logs[0].args.tokenId;
  
      assert.equal(await imageNftContract.tokenURI(tokenId), uriStr, `Token 0 shoud have URI String: ${uriStr}`);
    });

    it('should throw an error for minting the same token', async () => {
      await expectRevert(imageNftContract.mint('first-token-uri', {from: accounts[2], value: web3.utils.toWei('0.01', 'ether')}), "revert");
    });
  })

  describe('transfer', async () => {
    it('should be transferable between users', async () => {
      const ownerBefore = await imageNftContract.ownerOf(1);
      await imageNftContract.transferFrom(ownerBefore, accounts[4], 1, {from: ownerBefore});
      const ownerAfter = await imageNftContract.ownerOf(1);
      assert.equal(ownerAfter, accounts[4], "Should transfer token between users");
    });

    it('should revet when transfer is not sent from the owner', async () => {
      const owner = accounts[5];
      const notOwner = accounts[6];
      const result = await imageNftContract.mint('some-uri', {from: owner, value: web3.utils.toWei('0.01', 'ether')});
      const tokenId = result.logs[0].args.tokenId;

      await expectRevert(imageNftContract.transferFrom(owner, notOwner, tokenId, {from: notOwner}), "revert");
    });
  });

});

// TODO: Test: should have base uri
