module.exports = app;
//Module dependencies
var express = require('express');
var path = require('path');
var routes = require('./routes/index');

var mysql = require('mysql');
var mdb = require('./mdb'); //mysql file
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret:'secretKeyHash'}));
app.use('/',routes);



//SUBMIT LOGIN INFO
app.post('/loginForm',function(req,res){
	var p = req.body;
	req.session.username = p.email;
	var queryString = 'SELECT firstname FROM users WHERE email ="'+p.email+'"';
	mdb.queryDB(queryString,function(status,firstname){
		req.session.firstname = firstname[0].firstname;
	});
	var callback = function(status, result) {
		if (status == true && result.length == 1) { 
			/*if (isAdmin(p.email, p.password)) { //TODO: REQ.SESSION DOESN'T EXIST YET
				res.session.role = 'admin';
			} else {
				res.session.role = 'user';
			}*/
			res.redirect('/');
		} else {
			res.locals.reason = result;
			req.session.loginError = 'true';
			res.redirect( '/login');  //TODO: alert
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
			res.send('reg failed' + result);  //TODO: alert
		}
	};

	mdb.registerUser(p.email, p.password, p.firstname, p.lastname, callback);
});

//SEARCH
app.post('/searchForm', function(req, res){
	var p = req.body;
	var callback = function(status, result) {
		if (status == true) {
			//console.log("\n\n\nthe search results are "+JSON.stringify(result)+"\n\n");
			res.render('results', {res: result});
		} else {
			res.locals.reason = result;
			res.send('search-failed' + result);  //TODO: alert?
		}
	};
	
	var filters = {};
	if (p.artist != '') { filters.artist_name = p.artist; }
	if (p.venue != '') { filters.venue = p.venue; }
	if (p.date != '') { filters.date = p.date; }

	mdb.search(p.table, filters, callback);
});

//PURCHASE
app.post('/purchaseForm', function(req, res) {
	var p = req.body;
	var callback = function(status, result) {
		if (status == true) {
			res.send('purchase confirmed');
		} else {
			res.locals.reason = result;
			res.send('purchase failed: ' + result);
		}
	};
	
	var callback_2 = function(status, result) {
		if (status == true) {
			res.send('cancellation complete');
		} else {
			res.locals.reason = result;
			res.send('cancellation failed');
		}
	};

	if (p.ticket_id != undefined) {
		mdb.cancelTicket(p.ticket_id, p.email, p.event_id, callback_2);
	} else {
		mdb.purchase(p.event_id, p.email, callback);
	}
});

//ADMINCALL
app.post('/adminForm', function(req, res) {
	var p = req.body;

	var callback = function(status, result) {
		if (status == true) {
			res.send('change made');
		} else {
			res.locals.reason = result;
			res.send('request failed');
		}
	};

	var callback_2 = function(status, result) {
		if (status == true) {
			res.render('results', {res: result});
		} else {
			res.locals.reason = result;
			res.send('request failed');
		}
	};
	
	if (p.action == undefined) {
		mdb.showAll(p.table, callback_2);
	} else {
		var uORd = true ? (p.action == 'upd') : false;
		mdb.modifyTable(p.table, uORd, p.keyCol, p.keyVal, p.changeCol, p.newVal, callback);
	}
});

function isAdmin(e, p) {
	return (e == 'admin' && p == 'pass');
}

//catch 404
app.use(function(req,res,next){
 		var err = new Error('404: Not Found');
 		err.status = 404;
 		next(err);
});
	
/***********/
app.listen(3000);
/***********/
