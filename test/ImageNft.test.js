const { accounts, contract } = require('@openzeppelin/test-environment');
const [ owner ] = accounts;

const { expect } = require('chai');

const imageNft = contract.fromArtifact('ImageNft'); // Loads a compiled contract

describe('ImageNft', function () {
  it('deployer is owner', async function () {
    const imageNft = await imageNft.new({ from: owner });
    expect(await imageNft.owner()).to.equal(owner);
  });
});

describe('ImageNft', function() {
      it('create token', async function () {
            
      });
});