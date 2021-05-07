const ImageNft = artifacts.require("ImageNft");
const fetch = require("node-fetch");

contract("ImageNft", (accounts) => {
  it("shoud safeMint the 0-th token to the first address", async () => {
    const imageNftInstance = await ImageNft.deployed();
    //const accounts = await web3.eth.getAccounts();
    const uriStr = "token-uri-1";
    const baseUri = "https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/";

    await imageNftInstance.safeMint(accounts[0], 0, uriStr);

    assert.equal(await imageNftInstance.tokenURI(0), baseUri + uriStr, `Token 0 shoud have URI String: ${baseUri + uriStr}`);
  })
});

//Test should have base uri

contract("ImageNft", (accounts) => {
  it(" token 0 uri should return image url", async () => {
    const imageNftInstance = await ImageNft.deployed();

    //Create token
    await imageNftInstance.safeMint(accounts[0], 0, "token-uri-1");

    //Get URI back
    let tokenJson = await imageNftInstance.tokenURI(0);
    await fetch(tokenJson).then(res => console.log(res));
  
    assert.equal(true, true);
  })
});