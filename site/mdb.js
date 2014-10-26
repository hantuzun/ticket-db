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

function registerUser(email, password, firstname, lastname) {
	var sql = "INSERT INTO users VALUES(?,?,?,?)";
	sql = mysql.format(sql, [email, password, firstname, lastname]);

	res = queryDB(sql);
	return res.status;
}

function performLogin(email, password) {
	var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
	sql = mysql.format(sql, [email, password]);
	
	res = queryDB(sql);
	if (res.status && res.result.length == 1) {
		return true;
	}
	return false;
}

function search(role, table, targets, filters) {
	//........
}

//GENERIC DB QUERY FUNCTION
function queryDB(requestStr) {
	var tupleRes;
	
	client.connect(function(err) {
		if (err){
			tupleRes = {status: false, result: err};
		}
	});
	if (tupleRes != null && tupleRes != undefined) {
		client.end();
		return tupleRes;
	}

	client.query(requestStr,
		function (err, res) {
			if (! err) {
				tupleRes = {status: true, result: res};
			} else {
				tupleRes = {status: false, result: err};
			}
		}
	);

	client.end();
	return tupleRes;
}

module.exports.registerUser = registerUser;
module.exports.performLogin = performLogin;
module.exports.searchDB = searchDB;
