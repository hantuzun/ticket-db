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
var adminEmail = 'admin';


//SUBMIT LOGIN INFO
app.post('/loginForm',function(req,res){
	var p = req.body;
    if (p.email == '' || p.password == '') {
        res.redirect('/login');
        return;
    }
    
	req.session.username = p.email;
	if (p.email == adminEmail){
		req.session.admin = true;
	}else{
		req.session.admin = false;
	}

	var queryString = 'SELECT firstname FROM users WHERE email ="'+p.email+'"';
	mdb.queryDB(queryString,function(status,firstname){
        if (firstname.length != 0)
            req.session.firstname = firstname[0].firstname;
	});

	var callback = function(status, result) {
		if (status == true && result.length == 1) { 	
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
	if(p.firstname == '' || p.lastname == '' || p.email =='' || p.password==''){
		res.render('signUp',{errorMessage:'Please fill in all fields'});
	}
	else{
		var emailCheck = 'SELECT * FROM users WHERE email = ?';
		emailCheck = mysql.format(emailCheck, [p.email]);
		mdb.queryDB(emailCheck,function(status,emailExistsResult){
			console.log('here is the emailExists '+JSON.stringify(emailExistsResult));
			if(emailExistsResult.length!=0){
				res.render('signUp',{errorMessage:'Sorry email address already registered'});
			}
			else{
					var callback = function(status, result) {
			if (status == true) {
				res.render('home');
			} else {
				res.locals.reason = result;
				res.send('reg failed: \n' + result);  //TODO: alert
			}
		};

			mdb.registerUser(p.email, p.password, p.firstname, p.lastname, callback);
			}
		});
	}
});

//SEARCH
app.post('/searchForm', function(req, res){
	var p = req.body;
    var eventsOrNot = true ? (p.table == 'events') : false;
    
	var callback = function(status, result) {
		if (status == true) {
			res.render('results', {res: result, isEvents: eventsOrNot});
		} else {
			res.locals.reason = result;
			res.send('search-failed: \n' + result);
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
			res.redirect('/userProfile');
		} else {
			res.locals.reason = result;
			res.send('purchase failed: \n' + result);
		}
	};
	
	var callback_2 = function(status, result) {
		if (status == true) {
			res.redirect('/userProfile');
		} else {
			res.locals.reason = result;
			res.send('cancellation failed: \n' + result);
		}
	};
    
	if (p.ticket_id != undefined) {
		mdb.cancelTicket(p.ticket_id, p.event_id, callback_2);
	} else {
        var email = req.session.username;
        if (email == undefined || email == null) {
            res.render('login');
            return;
        }
		mdb.purchase(p.event_id, email, callback);
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
			res.send('request failed: \n' + result);
		}
	};

	var callback_2 = function(status, result) {
		if (status == true) {
			res.render('results', {res: result});
		} else {
			res.locals.reason = result;
			res.send('request failed: \n' + result);
		}
	};
	
	if (p.action == undefined) {
		mdb.showAll(p.table, callback_2);
	} else {
		var act;
        var bundle;
        if (p.action == 'upd')
            act = 1;
        else if (p.action == 'del')
            act = 2;
        else if (p.action == 'ins')
            act = 3;
            if (p.table == 'artists')
                bundle = [p.art_name, p.art_info];
            else if (p.table == 'events')
                bundle = [p.eid, p.ename, p.venue, p.date, p.size, p.num_tix, p.price];
            else if (p.table == 'users')
                bundle = [p.email, p.pass, p.fname, p.lname];
		mdb.modifyTable(p.table, act, p.keyCol, p.keyVal, p.changeCol, p.newVal, bundle, callback);
	}
});


//catch 404
app.use(function(req,res,next){
 		var err = new Error('404: Not Found');
 		err.status = 404;
 		next(err);
});
	
/***********/
app.listen(3000);
/***********/
