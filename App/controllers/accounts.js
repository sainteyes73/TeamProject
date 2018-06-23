var User = require('../models/user.js'),
    validationFuncs = require('../funclibs/validation.js');

var permissions = ['guest', 'author','administrator'];

exports.signUpGet = function(req,res){
    res.render('accounts/signup',{
       title:"Sign Up",
       permissions:permissions,
       flash:{},
       doc:{}
   });
};

exports.signUpPost = function(req,res){
    var flash = {
        notice:req.flash('notice')[0],
        error:req.flash('error')[0]
    };
    
    var now = new Date();
    
    var user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        permissions:"guest",
        created: now,
        updated: now
    });
    
    user.save(function(err) {
        if(err) {
            flash.error="Failed to save user";
            console.log(err);
            validationFuncs.errorHelper(err, function(errors) {
               if(!errors) {
                   errors = "Failed to save user";
               } 
               res.render("accounts/signup", {
                   title:"Sign Up",
                   permissions:permissions,
                   flash:flash,
                   doc:{}
               });
            });
        } else {
            // if(req.user.permissions === "administrator") {
            //     // req.flash('notice', 'User save successfully');
            //     res.redirect('/Users');
            // } else {
                req.flash('notice', 'Your account has been created');
                res.redirect("/accounts/login");
            // }
        }
    });
    
};

exports.forgotPasswordGet = function(req,res){
    res.render('accounts/forgotpassword',{
       title:"Forgotten password",
       flash:{}
   });
};

exports.forgotPasswordPost = function(req,res){
    
};

exports.accountSettingsGet = function(req,res){
    res.render('accounts/settings',{
       title:"Account Settings",
       flash:{}
   });
};

exports.accountSettingsPost = function(req,res){
    var flash = {
        notice:req.flash('notice')[0],
        error:req.flash('error')[0]
    };
    
    User.findById(req.user._id, function(err, doc) {
        if(err) {
            console.log(err);
            res.redirect("/");
        }
        
        
        if (doc.hashPassword(req.body.old_password) === doc.password) {
            if (req.body.new_password === req.body.confirm_password) {
                doc.password = req.body.new_password;
                doc.save(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/accounts/logout');
                }
            });
            } else {
                console.log(res.username + " inserted different passwords while updating their password");
                flash.error = 'Your passwords do not match';
                res.render('accounts/settings',{
                title:"Account Settings",
                flash:flash
            });
            }
        } else {
            console.log(res.username + " inserted the wrong password while updating their password");
            flash.error = 'Your password is incorrect';
            res.render('accounts/settings',{
                title:"Account Settings",
                flash:flash
            });
        }
        
        
        
        
    });
};


//Step 3
exports.login = function(req,res){
    var flash = {
        notice:req.flash('notice')[0],
        error:req.flash('error')[0]
    }
    
    res.render("accounts/login",{
        title:"Login",
        flash:flash
    });
};

//Step 7
exports.logout = function(req,res){
    req.logout();
    console.log('User logged out');
    res.redirect('/accounts/login');
};