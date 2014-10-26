 module.exports = app;
//Module deoendencies
 var express = require('express');
 var path = require('path');
 var bodyParser = require('body-parser');

 var routes = require('./routes/index');


 var app = express();
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',routes);

app.post('/loginForm',function(req,res){
	var username = req.param('username');
	var password = req.param('password');
	console.log(username+'\n'+password);
	res.get('/home');
});

app.post('/registrationForm',function(req,res){
	var firstname = req.param('firstname');
	var lastname = req.param('lastname');
	var email = req.param('email')
	var password = req.param('password')
	console.log(firstname+'\n'+lastname+'\n'+email+'\n'+password) 
})



//catch 404
app.use(function(req,res,next){
 		var err = new Error('Not Found');
 		err.status = 404;
 		next(err);
 	});








 app.listen(80);


 