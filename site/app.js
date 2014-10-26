 module.exports = app;
//Module dependencies
 var express = require('express');
 var path = require('path');
 var bodyParser = require('body-parser');
 var routes = require('./routes/index');
 //mysql file:
 var mdb = require('./mdb.js');

 var app = express();
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');
app.use('/',routes);


//SUBMIT LOGIN INFO
app.post('/loginForm',function(req,res){
	var p = req.params;
	var login = mdb.performLogin(p.email, p.password);
	if (login == true){
		if (isAdmin(p.email, p.password)) {
			res.locals.role = 'admin';
		} else {
			res.locals.role = 'user';
		}
		res.render('home');
	}
	else {
		res.locals.reason = login;
		res.send('///////////////////////')  //alert message, not new page
});

//SUBMIT REGISTRATION INFO
app.post('/registrationForm',function(req,res){
	var p = req.params;
	var reg = registerUser(p.email, p.username, p.password, p.firstname, p.lastname);
	if (reg == true){
		res.render('home');
	}
	else {
		res.locals.reason = reg;
		res.render('//////////////////////')
})

//SEARCH
app.get('/search', function(req, res){
	var p = req.params;
	var searchRes = search(p.role, p.table, p.targets, p.filers);
	if (searchRes == true){
		res.render('search-results');
	}
	else {
		res.locals.reason = searchRes;
		res.render('search-failed')
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

app.listen(80);


 