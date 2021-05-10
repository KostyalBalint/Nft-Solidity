const ImageNft = artifacts.require('ImageNft');
const { assert } = require('chai');
const fetch = require('node-fetch');

contract('ImageNft', (accounts) => {
  let imageNftContract;

  //Deplye the contract once before the tests
  before(async () => {
    imageNftContract = await ImageNft.deployed();
  });

  it('shoud deply sucessfully', async () => {
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

  it('shoud mint the 0-th token to the first address', async () => {
    const uriStr = 'token-uri-1';
    const baseUri = 'https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/';

    const token = await imageNftContract.mint(uriStr);

    assert.equal(await imageNftContract.tokenURI(0), baseUri + uriStr, `Token 0 shoud have URI String: ${baseUri + uriStr}`);
  });

  it('should return image url in the json response for token 0', async () => {
    // Create token
    const token = await imageNftContract.mint('token-uri-1');

    // Get URI back
    const tokenUri = await imageNftContract.tokenURI(0);

    // Fetch the Json data from the uri
    const tokenJson = await fetch(tokenUri).then((res) => res.json());

    assert.equal(tokenJson.image, 'https://pic.weblogographic.com/img/technology-2017/difference-between-uri-and-url.jpg');
  });
});

// TODO: Test: should have base uri
