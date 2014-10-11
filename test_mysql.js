
var mysql = require('mysql'); 
var client = mysql.createConnection(
        {
        host:'ticketdb.cs08b6d209wu.us-west-2.rds.amazonaws.com',
        user:'masterlogin',
        password: 'masterpass',
        port: 3306,
        database: 'ticketdb'
        //ssl: true
        });

client.connect(
    function (err) { 
    	if (err){
    		console.log("connection error", err);
    	}
        else if (!err) {
            /*return client.query (
                "create table b (id integer, txt text);", 
                function (err, res) { 
                    if (! err) { 
                        console.log("result:" , res);
                        client.end();
                        return "created";
                    }
                }
            );*/
        }
    }
);
/*
client.connect(
    function (err) { 
        if (err) { 
            return console.error("error inserting!", err); 
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
            return console.error("retrieval failed!", err); 
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
); */