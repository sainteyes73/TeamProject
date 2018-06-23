var fs = require('fs');
var Project = require('../models/project.js');

exports.getImage = function(req, res) {
    var id = req.params.id || 0;
    Project.find({img_location: "uploads/"+id}, function(err, docs){
       if(err){
           
       }
       else{
           var mimeType = docs[0].img_type;
           var filestream = fs.createReadStream(docs[0].img_location);
           
           res.writeHead(200, {
               "Content-Type" : mimeType
           });
           filestream.pipe(res);
           
       }
    });

};