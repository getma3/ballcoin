const express = require("express");
const ejs = require('ejs');
const app = express();
const keys = require("../config/keys");
const passport = require("passport");
const passportSetup = require('../config/passport-setup');
const cookieSession =require("cookie-session");
const secure = require("express-force-https");
const port = process.env.PORT || 3000;
const BlockChain = require('./blockchain.js')
const mongoose = require('mongoose');
const socket = require('socket.io');

const User = require('../models/user');
const BlockChain_Routes = require('../routes/blockchain_routes')
const AUTH_routes = require("../routes/auth_routes");
const Profile_routes = require('../routes/profile_routes');


mongoose.connect('mongodb://admin:node3000@ds125352.mlab.com:25352/jamiiblockchain');
mongoose.connection.once('open',()=>{
    console.log('successful connection to  database')
}).on('error',(err)=>{
    console.log('failed to connect to database\n',err);
}).catch(err=>{
    console.log(err);
})

app.use(cookieSession({
    maxAge:3*60*60*1000,
    keys:[keys.session.key]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(secure);

app.use('/auth',AUTH_routes);
app.use('/api',BlockChain_Routes);
app.use('/profile',Profile_routes);

app.use('/assets',express.static('assets'));
app.set('view engine', 'ejs');

const server = app.listen(port,()=>{
    console.log(`listening to requests on port ${port}`);
})

app.get('/',(req,res)=>{
    res.render('index');
})


const io = socket(server);

io.on('connection',(socket)=>{
    console.log('new peer online')

    socket.on('newTransaction',()=>{

      console.log("new Block Transaction :\n")
     
    })

    socket.on('newblock',()=>{
    //    on new block mined
    console.log(BlockChain.getLatestBlock());
    User.update({},{$push:{
                chain:{
                    from:BlockChain.getLatestBlock().transactions[0].fromAddress,
                    to:BlockChain.getLatestBlock().transactions[0].toAddress,
                    amount:BlockChain.getLatestBlock().transactions[0].amount,
                 // amount:BlockChain.getLatestBlock().transactions.validators,
                    code:BlockChain.getLatestBlock().transactions[0].code,
                    prevHash:BlockChain.getLatestBlock().prevHash,
                    hash:BlockChain.getLatestBlock().hash,
                    nonce:BlockChain.getLatestBlock().nonce,
                    timestamp:BlockChain.getLatestBlock().timestamp
                }}
            },{multi:true}).then(()=>{
                console.log('new block has been broadcasted to all users');
            })
            
        })
})

module.export = io;









    // on new block mined
   // User.update({},{$push:{
        //     chain:{
        //         from:BlockChain.getLatestBlock().transactions[0].fromAddress,
        //         to:BlockChain.getLatestBlock().transactions[0].toAddress,
        //         amount:BlockChain.getLatestBlock().transactions[0].amount,
        //         code:BlockChain.getLatestBlock().transactions[0].code,
        //         prevHash:BlockChain.getLatestBlock().prevHash,
        //         hash:BlockChain.getLatestBlock().hash,
        //         nonce:BlockChain.getLatestBlock().nonce,
        //         timestamp:BlockChain.getLatestBlock().timestamp
        //     }}
        // },{multi:true}).then(()=>{
        //     console.log('new block has been broadcasted to all users');
        // })
