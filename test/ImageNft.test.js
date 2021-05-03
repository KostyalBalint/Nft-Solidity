const ImageNft = artifacts.require("ImageNft");

contract("ImageNft", (accounts) => {
  it("shoud safeMint the 0-th token to the first address", async () => {
    const imageNftInstance = await ImageNft.deployed();
    //const accounts = await web3.eth.getAccounts();
    const uriStr = "Token Uri";

    mageNftInstance.safeMint(accounts[0], 0, uriStr);

    console.log(imageNftInstance.tokenURI(0));

    assert.equal(imageNftInstance.tokenURI(0), uriStr, `Token 0 shoud have URI String: ${uriStr}`);
  })
});