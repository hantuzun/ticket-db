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

	queryDB(sql, callback);
}

function performLogin(email, password, callback) {
	var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
	sql = mysql.format(sql, [email, password]);

	queryDB(sql, callback);
}

function search(table, filters, callback) {
	// filters is a js object
	// if table = "events" or "artists" and filters = {"venue": "Mungyeong", "date": "2015-03-24"}
	// when I query 'sql' on Sequel it returns the expected results
	var sql = "SELECT DISTINCT ? \
	    FROM artist_loc \
	    JOIN events ON artist_loc.event_id = events.event_id \
	    JOIN artists ON artist_loc.artist_name = artists.name";
	    
	var events_selection = "events.event_id, events.event_name, events.venue, events.date, events.tickets_left, events.price_per_ticket, artists.name";
	var artists_selection = "artists.name, artists.info";

	if (table === "events") {
		sql = sql.replace("?", events_selection);
	} else if (table === "artists") {
		sql = sql.replace("?", artists_selection);
	} else {
		callback(false, err);
	}

	if (Object.keys(filters).length > 0) {
		var array = []
		for(var k in filters) {
			array.push(k + " = \'" + filters[k] + "\'");
		}
		sql = sql + " WHERE " + array.join(" AND ");
	}

	queryDB(sql, callback);
}

function purchase(event_id, email, callback) {
	var sql1 = "SELECT tickets_left, price_per_ticket FROM events WHERE event_id = ?";
	sql1 = mysql.format(sql1, [event_id]);
	var sql2 = "UPDATE events SET tickets_left = ? WHERE event_id = ?";
	var sql3 = "INSERT INTO purchased_tickets (event_id, owner, date_of_purchase, price) VALUES(?, ?, ?, ?)";

	queryDB(sql1, 
		function(status, result){
			if (!status) {
				callback(false, result);
            } else if (result.length == 0) {
                callback(false, "No event found.");
			} else {
				var numTix = Number(result[0].tickets_left);
                var price = Number(result[0].price_per_ticket);
				if (numTix < 1) {
					callback(false, "SOLD OUT");
				} else {
					sql2 = mysql.format(sql2, [numTix-1, event_id]);
					queryDB(sql2, 
						function(status, result) {
							if (!status) {
								callback(false, result);
							} else {
                                sql3 = mysql.format(sql3, [event_id, email, currDate()/*Works?*/, price]);
								queryDB(sql3, callback);
							}
						}
					);
				}
			}
		}
	);
}

function cancelTicket(ticket_id, event_id, callback) {
	var sql1 = "SELECT tickets_left FROM events WHERE event_id = ?";
	sql1 = mysql.format(sql1, [event_id]);
	var sql2 = "DELETE FROM purchased_tickets WHERE ticket_id = ?";
	sql2 = mysql.format(sql2, [ticket_id]);
	var sql3 = "UPDATE events SET tickets_left = ? WHERE event_id = ?";

	queryDB(sql1, 
		function(status, result){
			if (!status) {
				callback(false, result);
			} else {
				numTix = Number(result[0].tickets_left);
				sql3 = mysql.format(sql3, [numTix+1, event_id]);
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
	);
}

function showProfile(email, callback) {
	var userTicketsQuery = "SELECT event_id FROM purchased_tickets WHERE owner = ?";
	userTicketsQuery = mysql.format(userTicketsQuery, [email]);
	var eventsQuery = "SELECT event_name, venue, DATE_FORMAT(events.date,'%Y-%m-%d'),event_id FROM events WHERE event_id = ?";
	var ticketQuery = "SELECT * FROM purchased_tickets WHERE owner = ?";
	ticketQuery = mysql.format(ticketQuery,[email]);
	queryDB(userTicketsQuery,function(status,userTicketResult){
			if(status === true && userTicketResult.hasOwnProperty(0)){
			eventsQuery = mysql.format(eventsQuery,userTicketResult[0].event_id);		
			for(var key=1; key<userTicketResult.length; key++ ){
				if(userTicketResult.hasOwnProperty(key)){
					eventsQuery+=(' OR event_id = ' +userTicketResult[key].event_id);	
				}
			}
			queryDB(ticketQuery,function(result,ticketInfo){
				queryDB(eventsQuery,function(result,eventInfo){
					for(var k in eventInfo){
						for(var i in ticketInfo){
							if(eventInfo[k].event_id == ticketInfo[i].event_id && ticketInfo[i].used!=true){
								eventInfo[k].ticket_id = ticketInfo[i].ticket_id;
								ticketInfo[i].used = true;
							}
						}
					}
					callback(result,eventInfo);
				});
				
			});
			
		}
		else{
			callback(status,{});
		}
	});
}


//FOR ADMINS
function modifyTable(table, action, keyColumn, keyVal, changeColumn, newVal, bundle, callback) {
	var sql;
	if (action == 1) {
		sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
		sql = mysql.format(sql, [table, changeColumn, newVal, keyColumn, keyVal]);
	} else if (action == 2) {
		sql = "DELETE FROM ?? WHERE ?? = ?";
		sql = mysql.format(sql, [table, keyColumn, keyVal]);
	} else if (action == 3) {
        var addstr = "'" + bundle.join("','") + "'";
        sql = "INSERT INTO "+table+" VALUES ("+addstr+")";
    }

	queryDB(sql, callback);
}

//ALSO FOR ADMINS
function showAll(table, callback) {
	var sql = "SELECT * FROM " + table;
	//sql = mysql.format(sql, [table]);
	queryDB(sql, callback);
}

//GENERIC DB QUERY FUNCTION
function queryDB(requestStr, callback) {
	client.query(requestStr,
		function (err, res) {
			if (! err) {
				callback(true, res);
			} else {
				callback(false, err);
			}
		}
	);
}

//Get current Datetime
function currDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) { dd='0'+dd; }
	if(mm<10) { mm='0'+mm; }

	return yyyy+'-'+mm+'-'+dd;
}

module.exports.registerUser = registerUser;
module.exports.performLogin = performLogin;
module.exports.search = search;
module.exports.purchase = purchase;
module.exports.cancelTicket = cancelTicket;
module.exports.modifyTable = modifyTable;
module.exports.showAll = showAll;
module.exports.showProfile = showProfile;
module.exports.queryDB = queryDB;