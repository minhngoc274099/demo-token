import { ethers } from "hardhat";
import { expect } from "chai";


describe("My Token test", function () {

  let myToken : any;
  let owner : any;
  let user1 : any;
  let user2 : any;

  beforeEach(async function() {
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();
    await myToken.deployed();

    [owner, user1, user2] = await ethers.getSigners();

  });
  
  it("Should successfully deploy", async function () {
    console.log("success!");
  });

  it("Should deploy with 10m of supply for the owner of the contract", async function() {
    const balance = await myToken.balanceOf(owner.address);
    expect(ethers.utils.formatEther(balance) == "10000000");
  });

  it("Should mint tokens to another address", async function() {
    await myToken.mint(user1.address, ethers.utils.parseEther("100"));
    expect(await myToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should send tokens to another address", async function() {
    await myToken.transfer(user1.address, ethers.utils.parseEther("100"));
    expect(await myToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should give another address the approval to send on your behalf", async function() {
    await myToken.connect(user1).approve(owner.address, ethers.utils.parseEther("1000"));
    await myToken.transfer(user1.address, ethers.utils.parseEther("1000"));
    await myToken.transferFrom(user1.address, user2.address, ethers.utils.parseEther("1000"));
    expect(await myToken.balanceOf(user2.address)).to.equal(ethers.utils.parseEther("1000"));
  })

  it("Should remove another address's approval to send on your behalf", async function() {
    await myToken.connect(owner).approve(user1.address, ethers.utils.parseEther("1000"));
    await myToken.removeAllowance(user1.address);
    expect(await myToken.allowance(owner.address,user1.address)).to.equal(ethers.utils.parseEther("0"));
  })
});