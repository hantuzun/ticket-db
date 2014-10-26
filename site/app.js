module.exports = app;
//Module dependencies
var express = require('express');
var path = require('path');
var routes = require('./routes/index');
//mysql file:
var mdb = require('./mdb');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use('/',routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



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
			res.send('login not found'); //alert message, not new page
		}
	};

	mdb.performLogin(p.email, p.password, callback);
});

//SUBMIT REGISTRATION INFO
app.post('/registrationForm',function(req,res){
	var p = req.body;

	var callback = function(status, result) {
		if (status == true) {
			res.render('home');
		} else {
			res.locals.reason = result;
			console.log(result);
			res.send('reg failed');
		}
	};

	mdb.registerUser(p.email, p.password, p.firstname, p.lastname, callback);
});

//SEARCH
app.get('/search', function(req, res){
	var p = req.body;

	var callback = function(status, result) {
		if (status == true){
			res.render('search-results');
		} else {
			res.locals.reason = result;
			res.send('search-failed');
		}
	};

	mdb.search(p.role, p.table, p.targets, p.filers, callback);
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


 