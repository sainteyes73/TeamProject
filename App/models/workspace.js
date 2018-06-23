var mongoose = require("mongoose"),
    uniqueValidator = require("mongoose-unique-validator"),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
function hashPassword(pwd){
    return crypto.createHash("sha256").update(pwd).digest('hex');
}
    
var UserSchema = new Schema({
    workspace_id:{
        type:Number,
        required:true
    },
    user_id:{
        type:Number,
        required:true
    },
    working_projects:[
        {
            id:{
                type:Number,
                required:true
            },
            project_id:{
                type:Number,
                required:true
            },
            steps:[
                {
                    
                }
            ]
        }
    ]
    
});
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