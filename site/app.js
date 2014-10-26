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

app.post('/login',function(req,res){
	var username = req.param('username');
	var password = req.param('password');
	console.log(username+'\n'+password);
	res.send('tah dah');
});

app.post('/signUpForm',function(req,res){
	var name = req.param('name');
	var email = req.param('emialAddress')
	var password = req.param('password')
	console.log(name+'\n'+email+'\n'+password) 
})



//catch 404
app.use(function(req,res,next){
 		var err = new Error('Not Found');
 		err.status = 404;
 		next(err);
 	});








 app.listen(3000);


 