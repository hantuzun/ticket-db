module.exports = app;
//Module dependencies
var express = require('express');
var path = require('path');
var routes = require('./routes/index');

var mdb = require('./mdb'); //mysql file
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
		if (status == true && result.length == 1) {
			req.session.username = p.email;
			if (isAdmin(p.email, p.password)) {
				res.session.role = 'admin';
			} else {
				res.session.role = 'user';
			}
			res.render('home');
		} else {
			res.locals.reason = result;
			res.send('login not found');  //TODO: alert
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
			res.send('reg failed');  //TODO: alert
		}
	};

	mdb.registerUser(p.email, p.password, p.firstname, p.lastname, callback);
});

//SEARCH
app.post('/search', function(req, res){
	var p = req.body;

	var callback = function(status, result) {
		if (status == true) {
			res.render('search-results');
		} else {
			res.locals.reason = result;
			res.send('search-failed');  //TODO: alert?
		}
	};

	mdb.search(p.table, p.filters, callback);
});

//PURCHASE
app.post('/purchaseForm', function(req, res){
	var p = req.body;

	var callback = function(status, result) {
		if (status == true) {
			res.render('purchase-confirmed');
		} else {
			res.locals.reason = result;
			res.send('purchase-failed');
		}
	};

	mdb.purchase(p.event_id, p.email, p.price, callback);
});

function isAdmin(e, p) {
	return (e == 'admin' && p == 'pass');
}

//catch 404
app.use(function(req,res,next){
 		var err = new Error('Not Found');
 		err.status = 404;
 		next(err);
});
	
/***********/
app.listen(8080);
/***********/
