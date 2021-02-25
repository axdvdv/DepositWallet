const DepositWalletFactory = artifacts.require("DepositWalletFactory");
const DepositWallet = artifacts.require("DepositWallet");
const Token = artifacts.require("Token");

contract("", ([owner, user, receiver]) => {
  let Factory, TokenA, walletAddress;

  before("", async () => {
    Factory = await DepositWalletFactory.deployed();
    TokenA = await Token.deployed();
  });

  describe("Compare bytecodes", () => {
    it("Bytecodes should be the same", async () => {
      const bytecode = await Factory.getByteCode.call(
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8"
      );
      assert.equal(bytecode, DepositWallet.bytecode);
    });
  });

  describe("Withdraw 1 token from simple wallet", () => {
    const userSalt = web3.utils.randomHex(32);
    depositAmount = "100000000000000000000000";

    it("Calculate wallet address", async () => {
      walletAddress = await Factory.computeAddress.call(
        userSalt,
        TokenA.address,
        receiver
      );
    });

    it("User gets funds", async () => {
      await TokenA.mint(user, depositAmount);
    });

    it("User deposits funds", async () => {
      await TokenA.transfer(walletAddress, depositAmount, { from: user });
      const walletBalance = await TokenA.balanceOf.call(walletAddress);
      assert.equal(walletBalance.toString(), depositAmount);
    });

    it("Exchange withdraws funds", async () => {
      await Factory.withdraw(userSalt, TokenA.address, receiver, {
        from: owner,
      });

      const walletBalance = await TokenA.balanceOf.call(walletAddress);
      const receiverBalance = await TokenA.balanceOf.call(receiver);
      assert.equal(walletBalance.toString(), "0");
      assert.equal(receiverBalance.toString(), depositAmount);
    });
  });
});
