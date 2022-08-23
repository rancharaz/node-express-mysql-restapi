//initiate packages
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

//database connection

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"
});
//connection check
connection.connect(function(err){
    if (err) throw err 
    console.log('You are now connected')
})

//start body-parser configuration 
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended:true // support url encoded bodies
}))

//open server on a port 
var server = app.listen(3000, "127.0.0.1", function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("App listening at http://%s:%s",host, port)
})

//endpoint restapi for * results

app.get('/api/students', function(req, res){

    connection.query(
            'select * from students', 

                function(error, results, fields){
                    if(error) throw error;
                    res.end(JSON.stringify(results))
    })
})

//endpoint resteapi post data

app.post('/api/students', function(req,res){

    var postData = req.body;

    connection.query('INSERT INTO students SET ?', postData, function(error, results, fields){
            if(error) throw error;
            res.end(JSON.stringify(results))
        }
    )
});

// search by id
app.get("/api/students/:id", function(req,res){
    connection.query('select * from students where id=?', [req.params.id], function(error, results, fields){
        if(error) throw error;
        res.end(JSON.stringify(results))
    })
})

//update students

app.put("/api/students",function(req,res){
    connection.query("UPDATE `students` SET `students_name`=?, `students_fee`=?, `students_age`=? where `id`=?", 
    [req.body.students_name, req.body.students_fee, req.body.students_age, req.body.id], 
    function(error, results, fields){
        if(error) throw error;
        res.end(JSON.stringify(results))
    })
})

//delete by id

app.delete("/api/students", function(req,res){
    console.log(req.body);
    connection.query('DELETE FROM `students` WHERE `id`=?', [req.body.id], function(error, results, fields){
        if(error) throw error;
        res.end('Record has been deleted')
    })
})