const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
   googleID:String,
   username:String,
   NationalID:String,
   gateNumber:Number,
   email:String,
   chain:[{
       from:String,
       to:String,
       amount:Number,
       code:String,
       prevHash:String,
       hash:String,
       nonce:Number,
       timestamp:Number
   }]
})

const User = mongoose.model('users',UserSchema);

module.exports = User;