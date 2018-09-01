const SHA256 = require("crypto-js/sha256");
// Block
class Block {
    constructor(timestamp,transactions,prevHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index+this.prevHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;  
            this.hash = this.calculateHash();
        }
        console.log('new block mined: '+this.hash);
    }

}

// Block Chain
class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
    }

    getPendingTransactions(){
        return this.pendingTransactions;
    }

    createGenesisBlock(){
        return new Block(Date.now(),["Genesis block"],"0");
    }
    
    createTransaction(code='',from='',to='',value='',timestamp=''){
        let newTransaction = {
            trans_code:code,
            fromAddress : from,
            toAddress : to,
            amount : value,
            timestamp :timestamp
        }
        this.pendingTransactions.push(newTransaction)
        }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
}

 
    isChainValid(){
        for(let i = 1; i < this.chain.length;i++){
            const CurrentBlock = this.chain[i];
            const PrevBlock = this.chain[i-1];

            if(CurrentBlock.hash !== CurrentBlock.calculateHash()){
                return false
            }
        }
        return true;
    }
}


var Blockchain = new BlockChain();

module.exports = Blockchain;