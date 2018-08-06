const SHA256 = require("crypto-js/sha256");
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({extended:false});


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine','ejs');

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

}

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
            this.nonce++;  7
            this.hash = this.calculateHash();
        }
        console.log('new block mined: '+this.hash);
    }

}

// Block Chain
class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 0.001;
    }

    createGenesisBlock(){
        return new Block(Date.now(),["Genesis block"],"0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
        
    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    minePendingTransactions(minerRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.prevHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,minerRewardAddress,this.miningReward)
        ]
    }

    getBalanceofAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance-=trans.amount; 5
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
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


var myCoin = new BlockChain();
myCoin.createGenesisBlock();

app.listen(port,()=>{
    console.log(`listening to requests on port ${port}`)
})

app.get('/',(req,res)=>{
    res.render('home');
})

app.post('/newTrans',urlencodedparser,(req,res)=>{
    myCoin.createTransaction(
        new Transaction(
            req.body.from,
            req.body.to,
            req.body.amount
        )
    )
    res.json('successfully created a new Transaction')
})

app.get('/recenttransactions',(req,res)=>{
    let result = myCoin.getLatestBlock();
    res.json(result);
})

app.post('/mineblock',urlencodedparser,(req,res)=>{
    myCoin.minePendingTransactions(req.body.mineraddress)
        res.json('Successfully mined new block!\nRewarded 0.001 Coins')
})

app.get('/mybalance',(req,res)=>{
    let balance = myCoin.getBalanceofAddress(req.query.mineraddress)
    res.json('miner: '+req.query.mineraddress+' balance = '+balance)
})















