var mongoose = require("mongoose"),
    uniqueValidator = require("mongoose-unique-validator"),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
    
var ProjectSchema = new Schema({
    user_id:{
        type:String,
        required:true
    },
    project_name:{
        type:String,
        required:true
    },
    project_description:{
        type:String,
        required:true
    },
    img_location:{
        type:String
    },
    img_type:{
        type:String
    },
    steps:[
        {
            sequence:{
                type:Number,
                required:true,
                //unique:true
            },
            name:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            }
        }
    ],
    supplies:[
        {
            name:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
});
ProjectSchema.plugin(uniqueValidator);

var Project = mongoose.model("Project",ProjectSchema);
module.exports = Project;