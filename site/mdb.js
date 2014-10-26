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
	var inserts = [email, password, firstname, lastname];
	sql = mysql.format(sql, inserts);

	res = queryDB(sql);
	return res.status;
}

function performLogin(email, password) {
	//stuff
	return true;
}

function search(role, table, targets, filters) {
	var admin = (role == 'admin');
	if (table == 'users' || table == 'tickets') {
		if (!admin) {
			return false;
		} else {
			//...
		}
	}
}

//GENERIC DB QUERY FUNCTION
function queryDB(requestStr) {
	client.connect();
	
	var tupleRes;
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