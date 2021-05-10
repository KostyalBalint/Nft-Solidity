const ImageNft = artifacts.require('ImageNft');
const { assert } = require('chai');
const fetch = require('node-fetch');

contract('ImageNft', (accounts) => {
  let imageNftContract;

  //Deplye the contract once before the tests
  before(async () => {
    //TODO: remove state after each test 
    imageNftContract = await ImageNft.new();
    //imageNftContract = await ImageNft.deployed();
  });

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

  it('should cost 0.01 ether to mint a token', async () => {
    let value = web3.utils.toWei('0.01', 'ether');
    let balanceBefore = await web3.eth.getBalance(accounts[2]);
    //Gas price set to 0 here to properly test the price
    let tokenResult = await imageNftContract.mint('token-uri-1', {from: accounts[2], value, gasPrice: 0});
    let balanceAfter = await web3.eth.getBalance(accounts[2]);

    assert.equal(balanceBefore - balanceAfter, value, 'Minting a token should const 0.01 ether');
    //TODO: test transaction with lower price
  });

  it('shoud have proper uri string of a minted token', async () => {
    const uriStr = 'token-uri-1';
    const baseUri = 'https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/';

    await imageNftContract.mint.call(uriStr, {from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});

    assert.equal(await imageNftContract.tokenURI(0), baseUri + uriStr, `Token 0 shoud have URI String: ${baseUri + uriStr}`);
  });

  it('should return image url in the json response for token 0', async () => {
    // Create token
    await imageNftContract.mint('token-uri-1', {from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});

    // Get URI back
    const tokenUri = await imageNftContract.tokenURI(0);

    // Fetch the Json data from the uri
    const tokenJson = await fetch(tokenUri).then((res) => res.json());

    assert.equal(tokenJson.image, 'https://pic.weblogographic.com/img/technology-2017/difference-between-uri-and-url.jpg');
  });
});

// TODO: Test: should have base uri
