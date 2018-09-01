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

router.post('/updateprofile',urlencodedparser,(req,res)=>{
    User.findOneAndUpdate({_id:req.body.user_id},{"$set":{
        "NationalID":req.body.NationalID,
        "gateNumber":req.body.gateNumber,
        "email":req.body.email
    }}).then(data=>{
       res.redirect('/profile');
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/',AuthCheck,(req,res)=>{
   res.render('profile',{user:req.user});
})

router.get('/mytransactions',AuthCheck,(req,res)=>{
    let result = [];
  User.findById(req.query.id).then((data)=>{
    
      data.chain.forEach(data=>{
          if(data.from == req.user.NationalID){
                result.push(data);
          }
      })
      res.json(result)
  }).catch(err=>{
      console.log("failed to retrieve data",err)
      res.json('failed to retrieve data').statusCode(404);
  })
})
router.get('/usertransactions',AuthCheck,(req,res)=>{
    res.render('usertransactions',{user:req.user})
})


module.exports = router;