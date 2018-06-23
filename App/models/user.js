var mongoose = require("mongoose"),
    uniqueValidator = require("mongoose-unique-validator"),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var UserSchema = new Schema({
    first_name:{
        type:String,
        required:true,
        match:/^[a-zA-Z]+$/
    },
    last_name:{
        type:String,
        required:true,
        match:/^[a-zA-Z0-9]+$/
    },
    username:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9]+$/
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    permissions:{
        type:String,
        enum:['guest', 'author','administrator']
    },
    created:{
        type:Date,
        default:Date.now()
    },
    updated:{
        type:Date,
        default:Date.now()
    }
});

function hashPassword(pwd){
    return crypto.createHash("sha256").update(pwd).digest('hex');
}

UserSchema.methods.hashPassword = function(pwd){
    return crypto.createHash("sha256").update(pwd).digest('hex');
};

UserSchema.plugin(uniqueValidator);
UserSchema.pre('save', function(next){
    var user = this;
    
    //only hash the password if it has been modified or is new
    if(!user.isModified("password")) return next();
    
    user.password = hashPassword(user.password);
    next();
});

var User = mongoose.model("User",UserSchema);
module.exports = User;