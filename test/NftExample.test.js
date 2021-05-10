const {accounts, contract} = require('@openzeppelin/test-environment');
const [owner] = accounts;

const {expect} = require('chai');

const MyContract = contract.fromArtifact('NftExample'); // Loads a compiled contract

describe('NftExample', function() {
  it('deployer is owner', async function() {
    const myContract = await MyContract.new({from: owner});
    expect(await myContract.owner()).to.equal(owner);
  });
});
