// exports.index = function(req,res){
//    res.render('index/home',{
//        title:"HOME",
//        flash:{}
//    });
// };


var Project = require('../models/project.js');

exports.index = function(req,res){
   Project.find({},function(err,docs){
      if(err){
         console.log(err);
         //flash.error = "There was an error locating your pages";
         docs = [];
      }
      res.render('index/home',{
         title:"HOME",
         flash:{},
         docs: docs
      });
   });
};
