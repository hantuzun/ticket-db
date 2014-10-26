module.exports = app;
//Module dependencies
var express = require('express');
var path = require('path');
var routes = require('./routes/index');
//mysql file:
var mdb = require('./mdb');
var session = require('cookie-session')
var app = express();
 

app.use(express.cookieSession());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use('/',routes);



//SUBMIT LOGIN INFO
app.post('/loginForm',function(req,res){
	var p = req.body;

	var callback = function(status, result) {
		if (status == true && result.length == 1) { //found in table
			req.session.username = p.email;
			if (isAdmin(p.email, p.password)) {
				res.session.role = 'admin';
			} else {
				res.session.role = 'user';
			}
			res.render('home');
		} else {
			res.locals.reason = result;
			res.send('///////////////////////'); //alert message, not new page
		}
	};

	mdb.performLogin(p.email, p.password, callback);
});

//SUBMIT REGISTRATION INFO
app.post('/registrationForm',function(req,res){
	var p = req.body;
	
	var callback = function(status, result) {
		if (status == true){
			res.render('home');
		}
		else {
			res.locals.reason = result;
			res.render('//////////////////////')
		}
	};
	
	mdb.registerUser(p.email, p.username, p.password, p.firstname, p.lastname, callback);
});

//SEARCH
app.get('/search', function(req, res){
	var p = req.body;
	var searchRes = mdb.search(p.role, p.table, p.targets, p.filers);
	
	if (searchRes == true){
		res.render('search-results');
	}
	else {
		res.locals.reason = searchRes;
		res.render('search-failed')
	}
});

function isAdmin(u, p) {
	return (u == 'admin' && p == 'pass');
}

//catch 404
app.use(function(req,res,next){
 		var err = new Error('Not Found');
 		err.status = 404;
 		next(err);
});

	
/***********/
app.listen(80);
/***********/


 