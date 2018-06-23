var Project = require('../models/project.js'),
    User = require('../models/user.js');


//DO NOT EDIT -Will Jones
exports.dashboardGet = function(req, res) {
    var user = req.user;
    Project.find({},function(err,docs){
        if(err){
            console.log(err);
            //flash.error = "There was an error locating your pages";
            docs = [];
        }
        res.render('projects/dashboard', {
            title: "Dashboard",
            flash: {},
            docs: docs,
            user: user
        });
    });
};

exports.dashboardPost = function(req, res) {

};


//DO NOT EDIT -Will Jones
exports.createProjectGet = function(req, res) {
    res.render('projects/create', {
        title: "New Project",
        flash: {}
    });
};


//DO NOT EDIT -Will Jones
exports.createProjectPost = function(req, res) {
    
    var project = new Project({
        user_id: req.user._id,
        project_name: req.body.projectTitle,
        project_description: req.body.description,
        img_location: req.file.path,
        img_type: req.file.mimetype



    });


    var counter = 1;
    while (req.body['stepTitle-' + counter] != undefined) {
        project.steps.push({
            sequence: counter,
            name: req.body['stepTitle-' + counter],
            description: req.body['stepDescription-' + counter]
        })

        counter++;

    }
    
    counter = 1;
    while (req.body['supplyTitle-' + counter] != undefined) {
        project.supplies.push({
            name: req.body['supplyTitle-' + counter],
            description: req.body['supplyDescription-' + counter],
            quantity: req.body['supplyQuantity-' + counter]
        })

        counter++;

    }
    console.log(project);
    project.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/projects/dashboard');
        }
    });
    
};


//DO NOT EDIT -Will Jones
exports.editProjectGet = function(req, res) {
     var id = req.params.id || 0;

    Project.findById(id, function(err,doc){
        if(err){
            req.flash('error','Page not found');
            res.redirect('/movies');
        }else{
            res.render("projects/edit",{
               title:"Edit Project",
               flash:{},
               doc:doc
            });
        }
    });
};

exports.editProjectPost = function(req, res) {
    var id = req.params.id || 0;
    
    Project.findById(id, function(err,doc){
        if(err){
            req.flash('error','Page not found');
            res.redirect('/movies');
        }else{
            //user_id: req.body.user_id,
            doc.project_name= req.body.projectTitle;
            doc.project_description= req.body.description;
            
            doc.steps = [];
        
            var counter = 1;
            while (req.body['stepTitle-' + counter] != undefined) {
                doc.steps.push({
                    sequence: counter,
                    name: req.body['stepTitle-' + counter],
                    description: req.body['stepDescription-' + counter]
                })
        
                counter++;
        
            }
            
            doc.supplies = [];
            
            counter = 1;
            while (req.body['supplyTitle-' + counter] != undefined) {
                doc.supplies.push({
                    name: req.body['supplyTitle-' + counter],
                    description: req.body['supplyDescription-' + counter],
                    quantity: req.body['supplyQuantity-' + counter]
                })
        
                counter++;
        
            }
            //console.log(doc);
            doc.save(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/projects/dashboard');
                }
            });
        }
    });
};

exports.listProjectsGet = function(req, res) {
    var docs2 = [];
    User.find({}, function(err2, docs2) {
        if(err2) {
            console.log(err2);
            docs2=[];
        }
        Project.find({}, function(err, docs) {
            if(err) {
                console.log(err);
                docs = [];
            }
            res.render('projects/list', {
                title: "Projects",
                flash: {},
                docs: docs,
                docs2: docs2
            });
        });
    });
};


//DO NOT EDIT -Will Jones
exports.viewProjectGet = function(req, res) {
    var id = req.params.id || 0;

    Project.findById(id, function(err,doc){
        if(err){
            req.flash('error','Page not found');
            res.redirect('/projects/list');
        }else{
            res.render("projects/view",{
               title:"View Project",
               flash:{},
               doc:doc
            });
        }
    });
};

//allow the users to delete entries for movies
exports.deleteProject = function (req, res) {
    
    //check if the user is logged in, if not redirect to login
    if (req.user == null) {
            req.flash('error','Please login');
            res.redirect('/accounts/login');
    }
    
    var id = req.params.id || 0;
    
    //find the movie entry by id
    Project.findById(id, function(err, doc) {
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
                    res.redirect("/projects/list");
                }
            });
        }
    });
};