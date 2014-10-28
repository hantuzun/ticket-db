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

function purchase(event_id, email, price, callback) {
	var sql1 = "SELECT tickets_left FROM events WHERE event_id = ?";
	sql1 = mysql.format(sql, [event_id]);
	var sql2 = "UPDATE events SET tickets_left = ? WHERE event_id = ?";
	var sql3 = "INSERT INTO purchased_tickets (event_id, owner, date_of_purchase, price) VALUES(?, ?, ?, ?)";
	sql3 = mysql.format(sql3, [event_id, email, currDate()/*Works?*/, price]);

	queryDB(sql1, 
		function(status, result){
			if (!status) {
				callback(false, result);
			} else {
				numTix = Number(result[0].tickets_left);
				if (numTix < 1) {
					callback(false, "SOLD OUT");
				} else {
					sql2 = mysql.format(sql2, [numTix-1, event_id]);
					queryDB(sql2, 
						function(status, result) {
							if (!status) {
								callback(false, result);
							} else {
								queryDB(sql3, callback);
							}
						}
					);
				}
			}
		}
	);
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

function currDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	}
	if(mm<10) {
		mm='0'+mm
	}
	return yyyy+'-'+mm+'-'+dd;
}

module.exports.registerUser = registerUser;
module.exports.performLogin = performLogin;
module.exports.search = search;
module.exports.purchase = purchase;
