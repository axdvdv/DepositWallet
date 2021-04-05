const InvoiceFactory = artifacts.require("InvoiceFactory");
const TokenContract = artifacts.require("Token");

const { BN } = require("@openzeppelin/test-helpers");

contract("Invoice contract", ([owner, user, receiver]) => {
  let Factory, ERC20, invoiceAddress;

  before("", async () => {
    Factory = await InvoiceFactory.deployed();
    ERC20 = await TokenContract.new();
  });

  describe("Withdraw tokens from invoice to the receiver with zero tokens balance", () => {
    const userSalt = web3.utils.randomHex(32);
    depositAmount = "100000000000000000000000";

    before("Receiver should have zero token balance", async () => {
      const receiverBalance = await ERC20.balanceOf.call(receiver);
      assert.equal(receiverBalance.toString(), "0");
    });

    it("Should calculate wallet address", async () => {
      invoiceAddress = await Factory.computeAddress.call(
        userSalt,
        ERC20.address,
        receiver
      );
    });

    it("User should have funds", async () => {
      await ERC20.mint(user, depositAmount);
    });

    it("User should deposit funds", async () => {
      await ERC20.transfer(invoiceAddress, depositAmount, { from: user });
      const invoiceBalance = await ERC20.balanceOf.call(invoiceAddress);
      assert.equal(invoiceBalance.toString(), depositAmount);
    });

    it("Should withdraw funds to receiver", async () => {
      const prevReceiverBalance = await ERC20.balanceOf.call(receiver);

      await Factory.withdraw(userSalt, ERC20.address, receiver, {
        from: owner,
      });

      const invoiceBalance = await ERC20.balanceOf.call(invoiceAddress);
      const receiverBalance = await ERC20.balanceOf.call(receiver);
      assert.equal(invoiceBalance.toString(), "0");
      assert.equal(
        receiverBalance.toString(),
        new BN(prevReceiverBalance).add(new BN(depositAmount))
      );
    });
  });

  describe("Withdraw tokens from invoice to the receiver with non-zero tokens balance", () => {
    const userSalt = web3.utils.randomHex(32);
    depositAmount = "100000000000000000000000";

    before("Receiver should have non-zero token balance", async () => {
      await ERC20.mint(receiver, 1);
      const receiverBalance = await ERC20.balanceOf.call(receiver);
      assert.notEqual(receiverBalance.toString(), 0);
    });

    it("Should calculate wallet address", async () => {
      invoiceAddress = await Factory.computeAddress.call(
        userSalt,
        ERC20.address,
        receiver
      );
    });

    it("User should have funds", async () => {
      await ERC20.mint(user, depositAmount);
    });

    it("User should deposit funds", async () => {
      await ERC20.transfer(invoiceAddress, depositAmount, { from: user });
      const invoiceBalance = await ERC20.balanceOf.call(invoiceAddress);
      assert.equal(invoiceBalance.toString(), depositAmount);
    });

    it("Should withdraw funds to receiver", async () => {
      const prevReceiverBalance = await ERC20.balanceOf.call(receiver);

      await Factory.withdraw(userSalt, ERC20.address, receiver, {
        from: owner,
      });

      const invoiceBalance = await ERC20.balanceOf.call(invoiceAddress);
      const receiverBalance = await ERC20.balanceOf.call(receiver);
      assert.equal(invoiceBalance.toString(), "0");
      assert.equal(
        receiverBalance.toString(),
        new BN(prevReceiverBalance).add(new BN(depositAmount))
      );
    });
  });

  describe.skip("Withdraw tokens from some invoices to the receiver", () => {
    const depositAmount = 1;
    const invoiceNumber = 10;
    let invoices = [];

    it("Should calculate wallet address", async () => {
      for (let i = 0; i < invoiceNumber; i++) {
        let invoice = {};
        invoice.id = web3.utils.randomHex(32);
        invoice.address = await Factory.computeAddress.call(
          invoice.id,
          ERC20.address,
          receiver,
          depositAmount
        );
        invoices.push(invoice);
      }
    });

    it("User should have funds", async () => {
      await ERC20.mint(user, depositAmount * invoiceNumber);
    });

    it("User should deposit funds", async () => {
      for (invoice of invoices) {
        await ERC20.transfer(invoice.address, depositAmount, { from: user });
        const invoiceBalance = await ERC20.balanceOf.call(invoice.address);
        assert.equal(invoiceBalance.toString(), depositAmount);
      }
    });

    it("Should withdraw funds to receiver", async () => {
      for (invoice of invoices) {
        const prevReceiverBalance = await ERC20.balanceOf.call(receiver);
        await Factory.withdraw(invoice.id, ERC20.address, receiver);
        const invoiceBalance = await ERC20.balanceOf.call(invoiceAddress);
        const receiverBalance = await ERC20.balanceOf.call(receiver);
        assert.equal(invoiceBalance.toString(), "0");
        assert.equal(
          receiverBalance.toString(),
          new BN(prevReceiverBalance).add(new BN(depositAmount))
        );
      }
    });
  });
});
