
console.log("console prints to here");
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

  var pg = require('pg'); 
  var client = new pg.Client(
	{
 	host:'ticketservice.cs08b6d209wu.us-west-2.rds.amazonaws.com',
 	user:'masterlogin',
 	password: 'masterpass',
 	port: '5432'
	});
//var client = new pg.Client("tcp://masterlogin@ticketdb.cs08b6d209wu.us-west-2.rds.amazonaws.com:5432/ticketdb");


client.connect(
    function (err) { 
    	if (err){
    		console.log("connection error");
    	}
        else if (!err) {
            return client.query (
                "create table b (id integer, txt text);", 
                function (err, res) { 
                    if (! err) { 
                        console.log("result:" , res);
                        client.end();
                        return "created";
                    }
                }
            );
        }
    }
);

client.connect(
    function (err) { 
        if (err) { 
            return console.error("error inserting!"); 
        } 
        else { 
            return client.query(
                "insert into b values (50,'test')", 
                function (err, res) { 
                    if (err) { 
                        return console.error("error inserting 2!"); 
                    } 
                    else { 
                        client.end(); 
                        return res;
                    } 
                } 
            ); 
        } 
    } 
); 


client.connect(
    function (err) { 
        if (err) { 
            return console.error("retrieval failed!"); 
        } 
        else { 
            return client.query(
                "select * from b", 
                function (err, res) { 
                    if (err) { 
                        return console.log("retrieval failed 2!"); 
                    } 
                    else { 
                        var row = res.rows[0]; 
                        client.end(); 
                        return console.log("result! ", row["a"].a); 
                    } 
                } 
            ); 
        } 
    } 
); 