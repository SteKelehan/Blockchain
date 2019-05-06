// running an npm install to install sha 256 
// TODO fix error
// TODO update readme
// p4m16:35
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

// sending coins
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    caculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){

        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign thransactions for other wallets!');
        }
        const hashTx = this.caculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        // toDER?
        this.signature = sig.toDER('hex')
    }

    isValid(){
        // this is for mining rewards
        if(this.fromAddress === null ) return true;

        if(!this.signature || this.signature.length === 0 ){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.caculateHash(), this.signature);
    }
} 


class Block{
    // index: where you are on the blockchain
    // time stamp: when it was created
    // data: what is been stored
    // previous hash: the hash of the previous block
    constructor( timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    caculateHash(){
        // sha 256 as out hash function
        // Creating a has with index, previous hash, timestpamp and the data
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        // this will keep looping until your hash has difficulty number of 0's in it 
        // the nonce is used in order to change the hash each time so you can fine the hash with the x number of zeros
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash  = this.caculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

    hashVaildTransactions(){
        for(const tx of this.transaction){
            if(!tx.isVaild()){
                return false;
            }
        }
        return true;
    }

}

// proof of work! -> this is to prove you did the work to get the block 
// ie for bitcoin you have to have a certain number of 0's in front of the hash
// you cannot predict a hashes outcome thus you have to put a lot of computer computation into the hash in order to find one with the 
// correct number of 0's. This is set so there is a set number of blocks created ever x number of mins. The difficulty of the hashes 
// will increase the better computaional power gets



class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        // how many coins you get when you sucessfully mine a block
        this.miningReward = 100
    }

    // the first block on a block chain is call a genious block - needs to be created manually
    createGenesisBlock(){
        return new Block( "01/01/2019", "Genesis block", "0")
    }

    getLastestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLastestBlock().hash
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock)
    // }


    minePendingTransactions(miningRewardAddress){
        // in large cyrpto currencys there are too many pending transactions thus the minner gets to choose which ones to add on to hers/his
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Minned!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }
        if(!transaction.isVaild()){
            throw new Error('Cannot add invaild transaction to chain');
        }
        this.pendingTransactions.push(transaction);
    }

    // No one has a balance you have to go though the blockchain and look at all the previous transactoins to fine out your balance
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainVaild(){
        // start with index 1 as dont include genisis block
        for(let i = 1; this.chain.length; i++ ){
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if(!currBlock.hashVaildTransactions()){
                return false;
            }

            if(currBlock.hash !== currBlock.caculateHash()){
                return false;
            }

            if(currBlock.previousHash !== prevBlock.hash){
                return false;
            }
            return true;
        }
    }
}


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
