var express = require('express');
var app = require('../app');
var mdb = require('../mdb');
var router = express.Router();
var session = require('cookie-session');


/* GET home page. */
router.get('/', function(req, res) {
 var userFirstName = req.session.firstname;
 var admin = req.session.admin;
  res.render('home', {title: 'Events Database Prototype',firstname: userFirstName,isAdmin : admin});
});

/* GET login page. */
router.get('/login', function(req, res) {
    //if (req.session.username != undefined) {
        //res.redirect('/');
    //} else {
        if(req.session.loginError=='true'){	
        res.render('login', { title: 'login', error:'true' });
        }else{
            res.render('login', { title: 'login', error:'false' });
        }
    //}
});

/* GET profile page*/
router.get('/userProfile',function(req,res){
	var email = req.session.username;
	if(email===undefined){
		res.redirect('/login');
	}
	else{
		var callback = function(status, result) {
			if (status == true) {
				res.render('userProfile',{res:result, username:(req.session.firstName)});
			} else {
				res.locals.reason = result;
				res.send('could not find profile\n'+res.locals.reason);
			}
		};

		mdb.showProfile(email, callback);
	}
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
	if(req.session.admin == true){
		res.render('admin');
	}else{
		res.redirect('/login');
	}
});

/*GET admin panel*/
router.get('/results',function(req,res){
	res.render('results');
});

/*GET logout request*/
router.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/')
})


module.exports = router;
