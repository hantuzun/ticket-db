var express = require('express');
var app = express();
var router = express.Router();
var session = require('cookie-session')


/* GET home page. */
router.get('/', function(req, res) {	
  //var username = req.session.username;
  res.render('home', { title: 'Eventss Database '});
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
