var http = require('http');

console.log('Node has been started...');
http.createServer(
	function(req, res) {
		console.log('Receving request...');
		var callback = function(err, result) {
			res.writeHead(200, {'Content-Type' : 'x-application/json'});
			console.log('json:', result);
			res.end(result);
		};
	parseJSON(
    //getSQL(callback);
	}
).listen(3000); //port #

function getSQL(callback) {
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
    client.connect();
	
    var query = 'SELECT * FROM artists';
    client.query(query, 
		function(err, results, fields) {
			if (err)
				return callback(err, null);

			console.log('query: ', query);
			console.log('The query-result is: ');
			console.log(results);

			// wrap result-set as json
			var json = JSON.stringify(results);
			// Nest the callback 
			client.end();
			callback(null, json);
		}
	);
};