var express = require('express');
var app = require('../app');
var mdb = require('../mdb');
var router = express.Router();
var session = require('cookie-session');


/* GET home page. */
router.get('/', function(req, res) {
  //var elem = document.getElementById('hideThis');
  //elem.style.display = 'none';	
 var username = req.session.username;
 console.log('the username = ' + username);
  res.render('home', {title: 'Events Database'+ username});
});

/* GET login page. */
router.get('/login', function(req, res) {
 if(req.session.loginError=='true'){	
 res.render('login', { title: 'login', error:'true' });
}
else{
	res.render('login', { title: 'login', error:'false' });
}
});

/* GET profile page*/
router.get('/userProfile',function(req,res){
	var email = "test@test.test";//req.session.username;
	var callback = function(status, result) {
		if (status == true) {
			res.render('userProfile',{res:result});
			console.log("result from queryDB() = "+JSON.stringify(result));
		} else {
			res.locals.reason = result;
			res.send('could not find profile\n'+res.locals.reason);
		}
	};

	mdb.showProfile(email, callback);
});
	
/*GET sign up page*/
router.get('/register',function(req,res){
	res.render('signUp');
});

/*GET search page*/
router.get('/search',function(req,res){
	res.render('search');
});

/*GET results page*/
router.get('/admin',function(req,res){
	res.render('admin');
});

/*GET admin panel*/
router.get('/results',function(req,res){
	res.render('results');
});


module.exports = router;
