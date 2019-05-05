const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const myKey = ec.keyFromPrivate('efbfaab81692f791ea08737c5c753a245582b8c4c20ed43bcd8cba229d8f3c60');
const myWalletAddress = myKey.getPublic('hex')


// Testing
let kelehanCoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress, 'public key gose here', 10)
tx1.signTransaction(myKey);
kelehanCoin.addTransaction(tx1)

console.log('\n Starting miner...');
kelehanCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of Ste is: ', kelehanCoin.getBalanceOfAddress(myWalletAddress));

// kelehanCoin.createTransaction(new Transaction('add 1', 'add 2', 100))
// kelehanCoin.createTransaction(new Transaction('add 2', 'add 1', 70))

// console.log('\n Start the miner...');
// kelehanCoin.minePendingTransactions('stes-address');

// console.log('\nBalance of Ste is', kelehanCoin.getBalanceOfAddress('stes-address'));

// console.log('\n Start the miner...');
// kelehanCoin.minePendingTransactions('stes-address');

// console.log('\nBalance of Ste is', kelehanCoin.getBalanceOfAddress('stes-address'));

// console.log('\n Start the miner...');
// kelehanCoin.minePendingTransactions('stes-address');

// console.log('\nBalance of Ste is', kelehanCoin.getBalanceOfAddress('add 1'));

// console.log('Transactions', JSON.stringify(kelehanCoin.chain, null, 4));
// console.log('Mining Block 1...', );
// kelehanCoin.addBlock(new Block(1, "14/11/2019", {amount: 100}))
// console.log('Mining Block 2...', );
// kelehanCoin.addBlock(new Block(2, "12/12/2019", {amount: 8}))



// stringify pram 1: value, pram 2: function to act of value, pram 3: white space 
// console.log(JSON.stringify(kelehanCoin, null, 4));

// console.log('Is it vaild? ', kelehanCoin.isChainVaild());
