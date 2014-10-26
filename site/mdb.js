var mysql = require('mysql'); 

var client = mysql.createConnection(
	{
	host:'ticketdb.cs08b6d209wu.us-west-2.rds.amazonaws.com',
	user:'masterlogin',
	password: 'masterpass',
	port: 3306,
	database: 'ticketdb'
	}
);

function registerUser(email, password, firstname, lastname, callback) {
	var sql = "INSERT INTO users VALUES(?,?,?,?)";
	sql = mysql.format(sql, [email, password, firstname, lastname]);

	res = queryDB(sql, callback);
}

function performLogin(email, password, callback) {
	var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
	sql = mysql.format(sql, [email, password]);
	
	res = queryDB(sql, callback);
}

function search(table, filters, callback) {
	//........
}

function purchase(event_id, callback) {
	//........
}

//GENERIC DB QUERY FUNCTION
function queryDB(requestStr, callback) {

	client.connect(function(err) {
		if (err){
			callback(false, err);
		}
	});

	client.query(requestStr,
		function (err, res) {
			if (! err) {
				client.end();
				callback(true, res);
			} else {
				client.end();
				callback(false, err);
			}
		}
	);
}

module.exports.registerUser = registerUser;
module.exports.performLogin = performLogin;
module.exports.search = search;
module.exports.purchase = purchase;
