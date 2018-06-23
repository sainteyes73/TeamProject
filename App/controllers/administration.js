// var administration = require('../models/administrationModel.js');
var User = require('../models/user.js');

exports.adminPageGet = function(req,res){
    var admin = req.user;
    
    if (!(admin.permissions === "administrator")) {
        console.log(admin.username + " attempted to access the admin page.");
        res.redirect("/");
    }
    
    User.find({}, function(err, docs) {
        if(err) {
            console.log(err);
            res.redirect("/")
            docs=[];
        }
        res.render('administration/adminpage', {
            title: "Administration Page",
            docs:docs,
            flash: {}
        });
    });
    
};

exports.adminPagePost = function(req,res){
    
};

//allow the users to delete entries for movies
exports.deleteUser = function (req, res) {
    
    var admin = req.user;
    if (!(admin.permissions === "administrator")) {
        console.log(admin.username + " attempted to access the admin page.");
        res.redirect("/");
    }
    
    var id = req.params.id || 0;
    
    //find the movie entry by id
    User.findById(id, function(err, doc) {
        if(err) {
            req.flash('error', 'Page not found');
            res.redirect('/');
        } else {
            //delete the movie entry
            doc.remove(function(err) {
                if(err) {
                    req.flash('error', 'Error deleting page');
                    res.redirect('/');
                } else {
                    req.flash('notice', doc.title + "has been deleted");
                    res.redirect("/administration/adminpage");
                }
            });
        }
    });
};

exports.updateUser = function (req,res){
    
    var admin = req.user;
    if (!(admin.permissions === "administrator")) {
        console.log(admin.username + " attempted to access the admin page.");
        res.redirect("/");
    }
    var id = req.params.id || 0;
    
    User.findById(id, function(err,doc){
        if(err){
            req.flash('error','Page not found');
            res.redirect('/');
        }else{
            console.log(doc);
            //user_id: req.body.user_id,
            doc.permissions= req.body.permissions;
            
            //console.log(doc);
            doc.save(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/administration/adminPage');
                }
            });
        }
    });
    
};
