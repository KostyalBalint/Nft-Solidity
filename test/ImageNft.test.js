const ImageNft = artifacts.require("ImageNft");
const fetch = require("node-fetch");

contract("ImageNft", (accounts) => {
  it("shoud safeMint the 0-th token to the first address", async () => {
    const imageNftInstance = await ImageNft.deployed();
    //const accounts = await web3.eth.getAccounts();
    const uriStr = "token-uri-1";
    const baseUri = "https://my-json-server.typicode.com/KostyalBalint/Nft-Solidity/";

    let token = await imageNftInstance.mint(uriStr, {'from': accounts[2]});
    console.log(token);

    assert.equal(await imageNftInstance.tokenURI(0), baseUri + uriStr, `Token 0 shoud have URI String: ${baseUri + uriStr}`);
  })
});

//TODO: Test: should have base uri

contract("ImageNft", (accounts) => {
  it(" token 0 uri should return image url in the json response", async () => {
    const imageNftInstance = await ImageNft.deployed();

    //Create token
    let token = await imageNftInstance.mint("token-uri-1");

    //Get URI back
    let tokenUri = await imageNftInstance.tokenURI(0);

    //Fetch the Json data from the uri
    let tokenJson = await fetch(tokenUri).then(res => res.json());
  
    assert.equal(tokenJson.image, "https://pic.weblogographic.com/img/technology-2017/difference-between-uri-and-url.jpg");
  })
});