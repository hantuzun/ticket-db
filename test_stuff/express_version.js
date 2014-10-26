var express = require('express');
var http = require('http');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

//REGISTRATION
app.post('/register', function(req, res){
	var p = req.params;
	var reg = registerUser(p.email, p.username, p.passhash, p.firstname, p.lastname);
	if (reg == true){
		res.render('registration-completed');
	}
	else {
		res.locals.reason = reg;
		res.render('registration-failed')
	}
});

//LOGIN
app.get('/login', function(req, res){
	var p = req.params;
	var login = performLogin(p.email, p.passhash);
	if (login == true){
		if (isAdmin(p.email, p.passhash)) {
			res.locals.role = 'admin';
		} else {
			res.locals.role = 'user';
		}
		res.render('registration-completed');
	}
	else {
		res.locals.reason = login;
		res.render('login-failed')
	}
});

//SEARCH
app.get('/search', function(req, res){
	var p = req.params;
	var search = searchDB(p.table, ..., p.role);
	if (search == true){
		res.render('search-results');
	}
	else {
		res.locals.reason = search;
		res.render('search-failed')
});

/*********************/
/*********************/
http.createServer(app).listen(80);
/*********************/
/*********************/

function registerUser(email, username, passhash, firstname, lastname) {
	//stuff
	return true;
}

function performLogin(email, passhash) {
	//stuff
	return true;
}

function searchDB(....) {
	var admin = (role == 'admin');
	if (table == 'users' || table == 'tickets') {
		if (!admin) {
			return false;
		} else {
			//...
	}
}