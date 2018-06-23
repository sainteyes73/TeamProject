//Created on: 2-14-2017
var accounts = require('./controllers/accounts.js'),
    administration = require('./controllers/administration.js'),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require("body-parser"),
    logger = require("express-logger"),
    cookieParser = require("cookie-parser"),
    flash = require("express-flash"),
    mongoose = require("mongoose"),
    pages = require("./controllers/pages.js"),
    projects = require('./controllers/projects.js'),
    workspace = require('./controllers/workspace.js'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js"),
    Multer = require("multer"),
    uploads = require('./controllers/uploads.js');

    

var app = express();
var upload = Multer({dest: './uploads/'});
var sessionStore = new session.MemoryStore;

//configuratin goes here
app.set('port', process.env.PORT || 3000);
app.set('views','./views');
app.set('view engine', 'pug');

//Middleware
app.use(express.static('./public'));//set a static route
app.use(logger({path:"logfile.txt"}));
app.use(bodyParser.urlencoded({extended:false}));// parse post boddy (.json()) is also available
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

app.post('/projects/create', upload.single('displayImage'), function (req, res, next){
  console.log(req.file);
  next()
})

//Mongoose API http://mongoosejs.com/docs/api.html
mongoose.connect(process.env.IP + "/local");
mongoose.connection.on('connected',function(){
  console.log("Connected to MongoDB @" + process.env.IP + "/local");
});
mongoose.connection.on("SIGINT",function(){
  console.log('MongoDB disconnected due to Application Exit');
  process.exit(0);
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(function(username,password,done){
  User.findOne({username:username},function(err,doc){
	  if(err){                                                              //database error
	    return done(err,false);
	  }
	  if(!doc){                                                             //user not found
	    return done(null,false,{message:'User or password not found.'});
	  }else{
				if(doc.password === doc.hashPassword(password)){            //success
				  console.log(doc.username + " logged in successfully");
					return done(null,doc);
				}else{                                                      //bad password
				  console.log(doc.username + " inserted the wrong password");
					return done(null,false,{message:'User or password not found.'});
				}
			}
	});
}));

app.use(function(req, res, next){
  //Step 9
  res.locals.user = req.user;
  
  // console.log(req.path);
  var anonymousPaths = [
    "/",
    "/index",
    "/accounts/signup",
    "/accounts/login",
    "/accounts/forgotpassword",
    "/projects/list",
    "/uploads"
    ];
  if((req.user === undefined) && ((anonymousPaths.indexOf(req.path) < 0) && !req.path.includes("/projects/view") && ! req.path.includes("/uploads/"))){
    res.redirect("/accounts/login");
  }else{
    next();
  }
});

//Step 6
passport.serializeUser(function(user, done) {
		done(null, user);
});
	
passport.deserializeUser(function(user, done) {
		done(null, user);
});


//assign routes hear
app.get('/', pages.index);
app.get('/index', pages.index);

app.get('/accounts/signup',accounts.signUpGet);
app.post('/accounts/signup',accounts.signUpPost);
app.get('/accounts/login',accounts.login);
app.get('/accounts/logout',accounts.logout);
app.get('/accounts/forgotpassword',accounts.forgotPasswordGet);
app.post('/accounts/forgotpassword',accounts.forgotPasswordPost);
app.get('/accounts/settings',accounts.accountSettingsGet);
app.post('/accounts/settings',accounts.accountSettingsPost);

app.get('/administration/adminpage',administration.adminPageGet);
app.post('/administration/adminpage',administration.adminPagePost);
app.post('/administration/updateusers/:id',administration.updateUser);
app.get('/administration/deleteUser/:id',administration.deleteUser);

app.get('/projects/dashboard',projects.dashboardGet);
app.post('/projects/dashboard',projects.dashboardPost);
app.get('/projects/create',projects.createProjectGet);
app.post('/projects/create',projects.createProjectPost);
app.get('/projects/edit/:id',projects.editProjectGet);
app.post('/projects/edit/:id',projects.editProjectPost);
app.get('/projects/list', projects.listProjectsGet);
app.get('/projects/view/:id', projects.viewProjectGet);
app.get('/projects/')

app.get('/uploads/:id', uploads.getImage);

app.get('/workspace/view', workspace.viewWorkspaceGet);
app.post('/workspace/view', workspace.viewWorkspacePost);
app.get('/workspace/projectWorkspace', workspace.projectWorkspaceGet);
app.post('/workspace/projectWorkspace', workspace.projectWorkspacePost);

app.post('/file', function(req, res){
  console.log(req);
  res.redirect("/");
});

app.post('/accounts/login',passport.authenticate('local',{
      successRedirect:'/',          //where we go on successful login
      failureRedirect:'/accounts/login',     //where to go when we fail to login
      failureFlash:true             //use flash messages
    }));

// start the app
app.listen(process.env.PORT, function() {
    console.log('Connected on port ' + process.env.PORT + '!');
});
