# Temporary deposit wallet

The smart contract allows you to withdraw funds (erc20, eth) from the temporary deposit wallet in one transaction. This makes it possible for services to withdraw user tokens from a temporary deposit address without sending eth to it.

## Description

In case when exchanges or services give temporary deposit addresses to users for erc20 tokens they also have to send some ETH to these addresses when they want to withdraw deposited funds. It takes 2 transactions (send ETH and transfer tokens) and these transactions cost approximately 47000 gas in total. It could be not so easy to calculate how much ETH it will cost when the gas price changes quickly.

This solution allows to generate temporary wallets for deposits and withdraw funds without sending ETH in one transaction and it costs ~57000 gas.

## Test

```js
npm i -g truffle
truffle test
```
