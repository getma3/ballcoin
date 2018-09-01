const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require('../config/keys');
const User = require('../models/user');

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
     User.findById(id).then(user=>{
         done(null,user);
     })
})

passport.use(
    new GoogleStrategy({
    clientID:keys.google_auth.clientID,
    clientSecret:keys.google_auth.clientSecret,
    callbackURL:"/auth/google/redirect"
},(accessToken,refreshToken,profile,done)=>{ 
   User.findOne({googleID:profile.id}).then(user=>{
        if(!user){
            User.count().then(function(count) {
                if(count < 1){
                    new User ({
                        username:profile.displayName,
                        googleID:profile.id,
                    }).save().then((newUser)=>{
                        done(null,newUser);
                    }).catch(err=>{
                        console.log('failed to add new team member',err)
                    })
                }else{
                let random = Math.floor(Math.random() * count)
                User.findOne().skip(random).then(function(result) {
                    new User ({
                        username:profile.displayName,
                        googleID:profile.id,
                        chain:result.chain
                    }).save().then((newUser)=>{
                        done(null,newUser);
                    }).catch(err=>{
                        console.log('failed to add new team member',err)
                    })
              })
            }
          })
        
        }else{
            done(null,user);
        } 
    })
}));