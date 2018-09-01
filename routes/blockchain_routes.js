const router = require("express").Router();
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({extended:false});
const User = require('../models/user');
const blockchain = require('../src/blockchain');


const AuthCheck = (req,res,next)=>{
    if(!(req.user)){
        res.redirect('/auth/google');
    }
   next();
}

router.get('/chainheight',(req,res)=>{
    User.count().then(function(count) {
        let random = Math.floor(Math.random() * count)
        User.findOne().skip(random).then(function(result) {
         res.json(result.chain.length);
      })
  })
})

router.post('/createtransaction',urlencodedparser,(req,res)=>{
    blockchain.createTransaction(req.body.transcode,req.body.from,req.body.to,req.body.amount,req.body.timestamp);   
    blockchain.minePendingTransactions();
    res.send('done');
})

router.get('/chainview',AuthCheck,(req,res)=>{
    User.findById(req.user._id).then(function(result) {
        res.render('chain_view',{chain:result.chain});
  })
})

router.get('/newtransaction',AuthCheck,(req,res)=>{
    res.render("createTransaction",{user:req.user});
})


module.exports = router;