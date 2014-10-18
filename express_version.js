var express = require('express');
var http = require('http');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

//REGISTRATION
app.get('/register', function(req, res){
	var p = req.params;
	var reg = registerUser(p.email, p.username, p.passhash, p.firstname, p.lastname);
	if (reg == true){
		res.render('registration-completed');
	}
	else {
		res.locals.reason = reg;
		res.render('registration-failed')
});

//LOGIN
app.get('/login', function(req, res){
	var p = req.params;
	var login = performLogin(p.email, p.passhash);
	if (login == true){
		res.render('registration-completed');
	}
	else {
		res.locals.reason = login;
		res.render('login-failed')
});

//SEARCH
app.get('/search', function(req, res){
	var p = req.params;
	var login = searchDB(p.table, ...);
	if (login == true){
		res.render('login-completed');
	}
	else {
		res.locals.reason = login;
		res.render('login-failed')
});

/*********************/
/*********************/
http.createServer(app).listen(80);
/*********************/
/*********************/

function registerUser(email, username, passhash, firstname, lastname) {
	return true;
}

function performLogin(email, passhash) {
	return true;
}