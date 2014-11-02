var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret:'secretKeyHash'}));


/* GET home page. */
router.get('/', function(req, res) {	
  var name = req.session.username;
  res.render('home', { title: 'Eventss Database '+name});
});

/* GET login page. */
router.get('/login', function(req, res) {
 res.render('login', { title: 'login' });
});

/* GET profile page*/
router.get('/profile',function(req,res){
	res.send('user profile will go here');
});

/*GET sign up page*/
router.get('/register',function(req,res){
	res.render('signUp');
});
 

module.exports = router;
